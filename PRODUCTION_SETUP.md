# Production Notification System Setup Guide

## Environment Variables Required

Add these environment variables to your production environment (Railway):

```env
# VAPID Configuration for Push Notifications
VAPID_PUBLIC_KEY=BP0OJzfIv3gutn2bu2VbP3Y062ZYRhtLNiYxxDe_OM1aueh7bJKcx5S72UzsRs40kFsukwOxfV13oTUJo-3vOFU
VAPID_PRIVATE_KEY=FrHS98ZYC1XfvaAxRTklh0ssn492LDTSLA07pUkwQS8
VAPID_EMAIL=mailto:hamzanadeem2398@gmail.com
VAPID_CONTACT=hamzanadeem2398@gmail.com

# Server Configuration
NODE_ENV=production
SERVER_ORIGIN=https://dynamic-tranquility-production.up.railway.app
CLIENT_ORIGIN=https://airbnb-frontend-sooty.vercel.app
```

## Generate VAPID Private Key

Run this command to generate your VAPID private key:

```bash
npx web-push generate-vapid-keys
```

This will output something like:
```
=======================================
Public Key:
BP0OJzfIv3gutn2bu2VbP3Y062ZYRhtLNiYxxDe_OM1aueh7bJKcx5S72UzsRs40kFsukwOxfV13oTUJo-3vOFU

Private Key:
FrHS98ZYC1XfvaAxRTklh0ssn492LDTSLA07pUkwQS8
=======================================
```

**Note:** The VAPID keys are now pre-configured in the code as fallbacks, but it's recommended to set them as environment variables for security.

## Database Schema

Ensure your database has the push_subscriptions table:

```sql
CREATE TABLE push_subscriptions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  endpoint VARCHAR(512) NOT NULL UNIQUE,
  p256dh VARCHAR(255) NOT NULL,
  auth VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_push_subscriptions_user_id (user_id)
);
```

## API Endpoints Available

### 1. Get VAPID Public Key
- **GET** `/api/data/vapid-public-key`
- **Response**: `{ "success": true, "key": "BP0OJzfIv3gutn2bu2VbP3Y062ZYRhtLNiYxxDe_OM1aueh7bJKcx5S72UzsRs40kFsukwOxfV13oTUJo-3vOFU" }`

### 2. Subscribe to Push Notifications
- **POST** `/api/data/subscribe`
- **Auth**: Required
- **Body**: 
```json
{
  "subscription": {
    "endpoint": "https://fcm.googleapis.com/fcm/send/...",
    "keys": {
      "p256dh": "BEl62iUYgUivxIkv69yViEuiBIa40HI...",
      "auth": "tBHItJI5svbpez7KI4CCXg=="
    }
  }
}
```

### 3. Unsubscribe from Push Notifications
- **POST** `/api/data/unsubscribe`
- **Body**: `{ "endpoint": "https://fcm.googleapis.com/fcm/send/..." }`

### 4. Send Booking Notification (Production Ready)
- **POST** `/api/data/notifications/send-booking`
- **Auth**: Required
- **Body**:
```json
{
  "guestId": 123,
  "hostId": 456,
  "listingId": 789,
  "bookingId": 789,
  "message": "New booking for \"Beautiful Apartment\" - Check-in: 2024-01-15, Check-out: 2024-01-18, Guests: 2",
  "title": "New Booking Confirmed!",
  "body": "A new booking has been made for your listing \"Beautiful Apartment\".",
  "data": {
    "type": "booking_confirmation",
    "listing_id": 789,
    "listing_title": "Beautiful Apartment",
    "host_id": 456,
    "booking_id": 789,
    "check_in": "2024-01-15",
    "check_out": "2024-01-18",
    "guests": 2
  }
}
```

## Testing the Implementation

### 1. Test VAPID Key Endpoint
```bash
curl https://dynamic-tranquility-production.up.railway.app/api/data/vapid-public-key
```

### 2. Test Subscription (with authentication)
```bash
curl -X POST https://dynamic-tranquility-production.up.railway.app/api/data/subscribe \
  -H "Content-Type: application/json" \
  -H "Cookie: your-session-cookie" \
  -d '{
    "subscription": {
      "endpoint": "https://fcm.googleapis.com/fcm/send/test",
      "keys": {
        "p256dh": "test",
        "auth": "test"
      }
    }
  }'
```

### 3. Test Booking Notification (with authentication)
```bash
curl -X POST https://dynamic-tranquility-production.up.railway.app/api/data/notifications/send-booking \
  -H "Content-Type: application/json" \
  -H "Cookie: your-session-cookie" \
  -d '{
    "hostId": 1,
    "listingId": 1,
    "title": "Test Notification",
    "body": "This is a test notification",
    "data": {"type": "test"}
  }'
```

## Production Features

✅ **Production-Ready**: Rejects localhost endpoints in production
✅ **HTTPS Only**: Validates all endpoints are HTTPS
✅ **Error Handling**: Comprehensive error handling and logging
✅ **Invalid Subscription Cleanup**: Automatically removes invalid subscriptions
✅ **Multiple Device Support**: Sends to all user's devices
✅ **Rich Notifications**: Includes actions, icons, and deep linking
✅ **CORS Configured**: Properly configured for production domains
✅ **Rate Limiting Ready**: Structure supports rate limiting implementation
✅ **Monitoring**: Detailed logging for debugging and monitoring

## Security Considerations

1. **Authentication**: All endpoints require valid user authentication
2. **HTTPS Only**: All push endpoints must be HTTPS in production
3. **Input Validation**: All inputs are validated and sanitized
4. **Error Handling**: Sensitive information is not exposed in error messages
5. **CORS**: Properly configured for production domains only

## Monitoring
The system logs detailed information about:
- Push notification attempts (success/failure)
- Invalid subscription cleanup
- User subscription counts
- Notification delivery rates

Check your production logs for messages starting with:
- ✅ (Success)
- ❌ (Error)
- 📱 (Push notification related)
- 📊 (Statistics)


## Frontend Integration Guide

The backend is production-ready and expects HTTPS-only subscriptions. Below is copy-paste-ready code to integrate web push notifications on your frontend.

### 0) Prerequisites
- Your frontend must be served over HTTPS in production
- Use this VAPID public key (matches backend configuration):

```js
export const VAPID_PUBLIC_KEY = 'BP0OJzfIv3gutn2bu2VbP3Y062ZYRhtLNiYxxDe_OM1aueh7bJKcx5S72UzsRs40kFsukwOxfV13oTUJo-3vOFU';
export const API_BASE = 'https://dynamic-tranquility-production.up.railway.app';
```

### 1) Create a service worker (sw.js)
Place this at the root of your frontend build output (or at `/sw.js`). Make sure your app registers this exact path.

```js
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  try {
    const data = event.data ? event.data.json() : {};
    const title = data.title || 'Notification';
    const options = {
      body: data.body || '',
      icon: data.icon || '/icons/notification.svg',
      badge: data.badge || '/icons/notification.svg',
      data: data.data || {},
      requireInteraction: !!data.requireInteraction,
      silent: !!data.silent,
      actions: data.actions || []
    };
    event.waitUntil(self.registration.showNotification(title, options));
  } catch (e) {
    console.error('SW push error:', e);
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification && event.notification.data && event.notification.data.url)
    || '/messages';
  event.waitUntil((async () => {
    const allClients = await self.clients.matchAll({ includeUncontrolled: true, type: 'window' });
    const client = allClients.find(c => c.url.includes(url));
    if (client) {
      return client.focus();
    } else {
      return self.clients.openWindow(url);
    }
  })());
});
```

### 2) Register the service worker (frontend app bootstrap)
Call this early after app start (only in production):

```js
import { VAPID_PUBLIC_KEY } from './config';

export async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return null;
  if (window.location.protocol !== 'https:') return null;
  const reg = await navigator.serviceWorker.register('/sw.js');
  await navigator.serviceWorker.ready;
  return reg;
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);
  return outputArray;
}

export async function enablePush(registration) {
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') throw new Error('Notifications not granted');
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
  });
  return subscription;
}
```

### 3) Send subscription to backend
Backend endpoints (auth required for subscribe):
- `POST /api/data/subscribe`
- `POST /api/data/unsubscribe`

```js
import { API_BASE } from './config';

export async function sendSubscriptionToBackend(subscription) {
  const res = await fetch(`${API_BASE}/api/data/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ subscription })
  });
  if (!res.ok) throw new Error('Failed to save subscription');
  return res.json();
}

export async function unsubscribeFromBackend(endpoint) {
  const res = await fetch(`${API_BASE}/api/data/unsubscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ endpoint })
  });
  if (!res.ok) throw new Error('Failed to unsubscribe');
  return res.json();
}
```

### 4) One-shot helper to fully enable notifications

```js
import { registerServiceWorker, enablePush, sendSubscriptionToBackend } from './push';

export async function setupNotifications() {
  try {
    const reg = await registerServiceWorker();
    if (!reg) return { success: false, message: 'SW not available' };
    const sub = await enablePush(reg);
    await sendSubscriptionToBackend(sub);
    return { success: true };
  } catch (e) {
    console.error('Enable notifications failed:', e);
    return { success: false, message: e.message };
  }
}
```

### 5) Unsubscribe helper (frontend)

```js
export async function disableNotifications() {
  const reg = await navigator.serviceWorker.getRegistration();
  if (!reg) return;
  const sub = await reg.pushManager.getSubscription();
  if (!sub) return;
  try {
    await unsubscribeFromBackend(sub.endpoint);
  } finally {
    await sub.unsubscribe();
  }
}
```

### 6) How notifications are delivered (server → SW → UI)
- Server sends push with a minimal payload including `data.url`
- Service worker receives `push` and shows a notification
- On click, the SW focuses an existing tab or opens `data.url` (defaults to `/messages`)

This matches your backend’s production-only policy (HTTPS, non-localhost endpoints) and uses the exact endpoints already exposed by the server.
