import 'dotenv/config';
import webpush from 'web-push';
import AppDataSource from '../config/db.js';
import { PushSubscription } from '../Models/PushSubscription.js';

let isConfigured = false;

function configureWebPush() {
  if (isConfigured) return;
  const publicKey = process.env.VAPID_PUBLIC_KEY || 'BP0OJzfIv3gutn2bu2VbP3Y062ZYRhtLNiYxxDe_OM1aueh7bJKcx5S72UzsRs40kFsukwOxfV13oTUJo-3vOFU';
  const privateKey = process.env.VAPID_PRIVATE_KEY || 'FrHS98ZYC1XfvaAxRTklh0ssn492LDTSLA07pUkwQS8';
  const email = process.env.VAPID_EMAIL || process.env.VAPID_CONTACT || 'mailto:hamzanadeem2398@gmail.com';
  if (publicKey && privateKey) {
    webpush.setVapidDetails(email, publicKey, privateKey);
    isConfigured = true;
    console.log('✅ VAPID configured successfully for production notifications');
  }
}

export async function sendNotificationToUser(userId, payload) {
  if (!userId) return { success: false, message: 'Missing userId' };
  try {
    if (process.env.NODE_ENV !== 'production') {
      return { success: false, message: 'Notifications disabled outside production' };
    }

    const serverOrigin = process.env.SERVER_ORIGIN || process.env.SERVER_PUBLIC_URL || '';
    // Ensure we are running behind a real production origin (HTTPS)
    if (!/^https:\/\//i.test(serverOrigin)) {
      console.log('❌ Server origin check failed:', { serverOrigin, SERVER_ORIGIN: process.env.SERVER_ORIGIN, SERVER_PUBLIC_URL: process.env.SERVER_PUBLIC_URL });
      return { success: false, message: 'Server origin is not production (https)'};
    }

    configureWebPush();
    if (!isConfigured) {
      console.log('❌ VAPID not configured:', { 
        VAPID_PUBLIC_KEY: !!process.env.VAPID_PUBLIC_KEY, 
        VAPID_PRIVATE_KEY: !!process.env.VAPID_PRIVATE_KEY,
        VAPID_EMAIL: process.env.VAPID_EMAIL,
        VAPID_CONTACT: process.env.VAPID_CONTACT
      });
      return { success: false, message: 'VAPID keys not configured' };
    }

    const pushSubRepo = AppDataSource.getRepository(PushSubscription);
    const subscriptions = await pushSubRepo.find({ where: { user_id: Number(userId) } });
    // Allow only HTTPS endpoints and exclude any localhost-style endpoints
    const filtered = subscriptions.filter(s => {
      const endpoint = String(s.endpoint || '');
      if (!/^https:\/\//i.test(endpoint)) return false;
      if (/^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0)(:|$)/i.test(endpoint)) return false;
      return true;
    });
    if (filtered.length === 0) {
      console.log('❌ No valid subscriptions for user:', { userId, totalSubscriptions: subscriptions.length, filteredCount: filtered.length });
      return { success: false, message: 'No valid subscriptions' };
    }

    const clientOrigin = process.env.CLIENT_ORIGIN || 'https://airbnb-frontend-sooty.vercel.app';
    const iconUrl = process.env.NOTIFICATION_ICON_URL || '/icons/notification.svg';
    const minimalPayload = JSON.stringify({
      title: payload?.title || 'Notification',
      body: payload?.body || '',
      data: {
        ...(payload?.data || {}),
        kind: payload?.kind || 'generic',
        url: payload?.data?.url || `${clientOrigin}/messages`
      },
      icon: payload?.icon || iconUrl,
      badge: payload?.badge || iconUrl
    });

    let sent = 0;
    for (const sub of filtered) {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          minimalPayload,
          { TTL: 86400 }
        );
        sent++;
      } catch (err) {
        if (err?.statusCode === 410 || err?.statusCode === 404) {
          await pushSubRepo.delete({ id: sub.id });
        }
      }
    }
    return { success: sent > 0, sent, total: filtered.length };
  } catch (error) {
    return { success: false, message: error.message };
  }
}
