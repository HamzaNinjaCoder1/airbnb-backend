## Production Push Notifications Guide (Web Push)

This guide explains exactly what is already implemented in the backend and everything the frontend must do to enable browser push notifications in production.

### Summary
- Backend uses VAPID Web Push with `web-push` and TypeORM to store browser push subscriptions per user.
- Push sending is strictly production-only and requires HTTPS origins.
- Frontend must: register a service worker, request notification permission, subscribe to push with the public VAPID key, send the subscription to the backend, and optionally trigger booking notifications. Message notifications are sent automatically by the backend when messages are created.

---

### Backend: What is already implemented

1) VAPID configuration and sending
- File: `src/services/NotificationService.js`
- Function: `sendNotificationToUser(userId, payload)`
  - Sends Web Push to all valid HTTPS subscriptions for a user.
  - Disabled unless `NODE_ENV === 'production'`.
  - Requires `SERVER_ORIGIN` or `SERVER_PUBLIC_URL` to be an `https://` URL.
  - Filters out non-HTTPS and `localhost` endpoints.
  - Payload shape used by service worker:
    ```json
    {
      "title": "Notification",
      "body": "...",
      "data": { "kind": "generic", "url": "<CLIENT_ORIGIN>/messages", ... },
      "icon": "/icons/notification.svg",
      "badge": "/icons/notification.svg"
    }
    ```

2) Push subscription storage
- File: `src/Models/PushSubscription.js`
- Table: `push_subscriptions`
- Columns: `id`, `user_id`, `endpoint` (unique, HTTPS), `p256dh`, `auth`, `created_at`.

3) REST endpoints used by the frontend
- Router: `src/Routes/data.js` (mounted at `/api/data` in `src/app.js`)
- Auth: Cookie session-based; send requests with credentials.
- Endpoints:
  - `POST /api/data/subscribe` (auth required)
    - Controller: `savePushSubscription`
    - Body: `{ subscription }` (standard Push API subscription object)
    - Upserts by `endpoint` and binds to the current authenticated `user_id`.
    - Validation: rejects non-HTTPS endpoints; rejects localhost endpoints in production.
  - `POST /api/data/unsubscribe`
    - Controller: `unsubscribe`
    - Body: `{ endpoint }`
    - Deletes a stored subscription by endpoint.
  - `POST /api/data/notifications/send-booking` (auth required)
    - Controller: `sendBookingNotificationToHost`
    - Body (minimal): `{ hostId: number, listingId: number, title?: string, body?: string, data?: object }`
    - Validates that `listingId` belongs to `hostId` and sends a push to the host.
  - `POST /api/data/messages/send-message` (auth required)
    - Controller: `sendMessage`
    - Automatically sends a push to the `receiver_id` after saving the message (no frontend trigger required).

4) Static assets for icons
- `public/icons/notification.svg` is served at `/icons/notification.svg` by the backend for default icon/badge.
- You can override with `NOTIFICATION_ICON_URL` env var if desired.

5) Required backend environment variables
- `NODE_ENV=production` (push sending disabled otherwise)
- `SERVER_ORIGIN=https://your-backend-domain` (or `SERVER_PUBLIC_URL`)
- `CLIENT_ORIGIN=https://your-frontend-domain` (used to build default URL in payload)
- `VAPID_PUBLIC_KEY=...` (Base64 URL-safe string)
- `VAPID_PRIVATE_KEY=...`
- `VAPID_EMAIL=mailto:you@example.com` (or `VAPID_CONTACT`)
- Optional: `NOTIFICATION_ICON_URL=https://.../icons/notification.svg`

---

### Frontend: Everything required

1) Frontend environment variables
- Public VAPID key exposed to the browser (example for Next.js):
  - `NEXT_PUBLIC_VAPID_PUBLIC_KEY=BP0OJzfIv3gutn2bu2VbP3Y062ZYRhtLNiYxxDe_OM1aueh7bJKcx5S72UzsRs40kFsukwOxfV13oTUJo-3vOFU`
- Backend origin for API calls:
  - `NEXT_PUBLIC_API_URL=https://your-backend-domain`

2) Host a notification icon on the frontend (recommended)
- Place the icon at `/public/icons/notification.svg` so it is served from `https://your-frontend-domain/icons/notification.svg`.
- This aligns with the backend default `icon`/`badge` values.

3) Create a service worker at the site root (e.g., `/sw.js`)
- The service worker must be at the root scope to receive pushes for the app.
- Implement push display and click handling:
```javascript
// sw.js
self.addEventListener('push', (event) => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch (_) {}

  const title = data.title || 'Notification';
  const body = data.body || '';
  const icon = data.icon || '/icons/notification.svg';
  const badge = data.badge || '/icons/notification.svg';

  const options = {
    body,
    icon,
    badge,
    data: data.data || {},
    tag: (data.data && data.data.kind) || 'generic',
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || '/messages';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientsArr) => {
      const client = clientsArr.find(c => c.url.includes(url) || c.visibilityState === 'visible');
      if (client) { client.focus(); client.navigate(url); return; }
      return clients.openWindow(url);
    })
  );
});
```

4) Register the service worker, request permission, subscribe to push, and send subscription to backend
- Include after user login or behind a settings toggle.
- Always send requests with credentials (cookies) because backend uses sessions.
```javascript
// pushSetup.js
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64);
  const output = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; ++i) output[i] = raw.charCodeAt(i);
  return output;
}

export async function enablePushNotifications() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    throw new Error('Push not supported in this browser');
  }
  if (!VAPID_PUBLIC_KEY) {
    throw new Error('Missing VAPID public key');
  }

  const registration = await navigator.serviceWorker.register('/sw.js');

  let permission = Notification.permission;
  if (permission === 'default') permission = await Notification.requestPermission();
  if (permission !== 'granted') throw new Error('Notification permission not granted');

  let subscription = await registration.pushManager.getSubscription();
  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });
  }

  const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/data/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ subscription }),
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to save subscription');
  }
  return true;
}
```

5) Unsubscribe flow
- Also remove on the server to keep storage clean.
```javascript
export async function disablePushNotifications() {
  const registration = await navigator.serviceWorker.getRegistration();
  const subscription = await registration?.pushManager.getSubscription();
  if (subscription) {
    const endpoint = subscription.endpoint;
    await subscription.unsubscribe().catch(() => {});
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/data/unsubscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ endpoint }),
    }).catch(() => {});
  }
}
```

6) Triggering notifications (when initiated from frontend)
- Messages: No action required; backend triggers push on `POST /api/data/messages/send-message`.
- Bookings: Optional explicit trigger to notify host.
```javascript
await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/data/notifications/send-booking`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    hostId,            // required: number
    listingId,         // required: number
    title: 'New Booking Confirmed!',
    body: 'A new booking was made.',
    data: {
      check_in: '2025-10-01',
      check_out: '2025-10-05',
      guests: 2,
      url: `${window.location.origin}/messages`,
    },
  }),
});
```

7) Frontend UX and production requirements
- Permission handling: If denied, show how to enable in browser settings.
- Idempotency: Backend upserts by endpoint; re-subscribing then posting again is safe.
- Cookies: Always set `credentials: 'include'` on fetch because server uses sessions.
- HTTPS only: Browsers and backend both require HTTPS for push endpoints in production.
- Development note: Server will not send actual pushes unless `NODE_ENV=production`. You can still test subscription and service worker, but you won’t receive pushes from the backend in development.

---

### Quick checklist (Frontend)
- Expose `NEXT_PUBLIC_VAPID_PUBLIC_KEY` and `NEXT_PUBLIC_API_URL`.
- Serve `/icons/notification.svg` from your frontend.
- Add `/sw.js` with `push` and `notificationclick` handlers.
- After login, call `enablePushNotifications()` to register, request permission, subscribe, and POST to `/api/data/subscribe` with credentials.
- Optionally implement `disablePushNotifications()` to clean up both browser and server.
- To notify hosts about bookings from the UI, call `/api/data/notifications/send-booking` as shown.

---

### Quick checklist (Backend already done)
- VAPID keys integration with `web-push`.
- Subscription persistence in `push_subscriptions`.
- Endpoints: `/subscribe`, `/unsubscribe`, `/notifications/send-booking`, and auto-send on `/messages/send-message`.
- HTTPS/production enforcement and localhost endpoint filtering.
- Default icon/badge at `/icons/notification.svg`.

---

If you follow the steps above on a production HTTPS domain for both frontend and backend, users will receive push notifications reliably for messages (automatic) and bookings (on demand).

-----  Steps to Create Database with the help of the "TypeORM" ----------
1) -> install necessary dependicies as like 
       "npm install mysql2 typeorm reflect-metadata dotenv"
2) -> sab sa pahla config ka nam pa folder bnana hai aur is ka andar db.js ka nam pa file create kara
3) -> then put the necessary data inside in it as like as:
   /*                              -------Code-------
   import { DataSource } from "typeorm";
    import "dotenv/config";
    import dotenv from "dotenv";

    dotenv.config();

    const AppDataSource = new DataSource({
        type: "mysql",
        port: process.env.DB_PORT,
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        entities: [path.join(__dirname, '../models/**/*.{ts,js}')],
        logging: false,
        synchronize: false
    })

    export default AppDataSource;
   */
4) -> write the code inside the users.js in models folder accurately as:
  /*
  import { EntitySchema } from "typeorm";

export const usersmodule = new EntitySchema({
    name: "usersmodule",
    tableName: "users",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
          },
          name: {
            type: "varchar",
            length: 100,
            nullable: false,
          },
          email: {
            type: "varchar",
            length: 150,
            unique: true,
            nullable: false,
          },
          password_hash: {
            type: "varchar",
            length: 255,
            nullable: false,
          },
          phone: {
            type: "varchar",
            length: 20,
            nullable: true,
          },
          profile_picture: {
            type: "text",
            nullable: true,
          },
          role: {
            type: "enum",
            enum: ["guest", "host", "admin"],
            default: "guest",
          },
          created_at: {
            type: "timestamp",
            createDate: true,
          },
    }
})
  */

4) -> sab sa pahla hama kisi bhi controller ma ya 3 cheeza mustly import karni hi pada gi for example
(i) import {usermodule} from 'usermodules' -> is liya ka is typeorm database ka table jo ham na bniya hai us ko map kar sakha hamra code ka sath easily and accurately
(ii) import {AppDatasource} from '../config/db' taka ham apni data base ko yaha par register kar sakha
(iii) const userRepo = AppDatasource.getReposity(usermodule) in order to perform the crud operations

is ka baad hama phir requests aur response creates karna hota hai according to or operations accurately like as if we want to register or add a new user then
export const userRegister = (req, res) => 
    {
        try
            {
                const user = userRepo.create(req.body);
                const savedUser = userRepo.save(user);
                res.status(210).json({success: true, data:savedUser})
            }
        catch
            {
                res.status(500).json({success: false error: err.message})
            }
    }
  
5) -> inside the router folder in the realted router file define all of the routes as like as
import express from 'express'
import userController from 'userController'
const userRouter = express.Router();
userRouter.post('/register', usercontroller)

"""" By default or boilerplaite code of the express app.js is: """"
import express from "express";

const app = express();

app.get("/", (req, res) => 
    {
    res.send("Hello World");
    });

const port = 8081;
app.listen(port, () => 
    {
    console.log(`Server running on port ${port}`);
    });
// ---- frontened ma data get karna ----
(1) -> import axios karo 
(2) -> import {useState, useEffect} from 'react'
