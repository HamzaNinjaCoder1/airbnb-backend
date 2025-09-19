# Production Notification System Setup Guide

## Environment Variables Required

Add these environment variables to your production environment (Railway):

```env
# VAPID Configuration for Push Notifications
VAPID_PUBLIC_KEY=BP0OJzfIv3gutn2bu2VbP3Y062ZYRhtLNiYxxDe_OM1aueh7bJKcx5S72UzsRs40kFsukwOxfV13oTUJo-3vOFU
VAPID_PRIVATE_KEY=your_vapid_private_key_here
VAPID_EMAIL=mailto:hamzanadeem2398@gmail.com

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
your_private_key_here
=======================================
```

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
