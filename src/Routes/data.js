import express from 'express';
import {listing, listingImage, getListings, getListingsByCity, saveHeading, getHeadingsGrouped, checkOrCreateHostListing, saveAndUpdateListing, uploadMultipleImages, getHostListingImages, deletelisting, sendMessage, getMessages, getConversationsByUserId, savePushSubscription, unsubscribe, confirmBooking, addToWishlist, removeFromWishlist, getUserWishlist, replaceListingImage} from '../Controllers/datacontroller.js';
import { authMiddleware } from '../middleware/authmiddleware.js';
import AppDataSource from '../config/db.js';
import { listingsmodule } from '../Models/listingsmodule.js';
import { bookingmodule } from '../Models/bookingmodule.js';
import { In } from 'typeorm';
import { upload } from '../middleware/uploads.js';
const listingRepo = AppDataSource.getRepository(listingsmodule);
const bookingRepo = AppDataSource.getRepository(bookingmodule);
const dataRouter = express.Router();
dataRouter.post('/listing', listing);
dataRouter.post('/listingImage', listingImage);
dataRouter.get('/listing', getListings);
dataRouter.get('/listingImage', (req, res)=>{
    res.status(200).json({message: "Listing image fetched successfully"});
});
dataRouter.get('/listing/city/:city', getListingsByCity);
dataRouter.get('/listing/city/rawalpindi', (req, res, next) => {
    req.params.city = 'Rawalpindi';
    return getListingsByCity(req, res, next);
});
dataRouter.post('/heading', saveHeading);
dataRouter.get('/headings/grouped', getHeadingsGrouped);
dataRouter.post('/host/listing', authMiddleware, checkOrCreateHostListing);
dataRouter.get('/test-db', async (req, res) => {
  try {
    const testListing = await listingRepo.findOne();
    res.json({ 
      success: true, 
      message: 'Database connection working',
      hasListings: !!testListing 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Database connection failed',
      error: error.message 
    });
  }
});

dataRouter.patch("/listings/save-exit", saveAndUpdateListing);
dataRouter.post('/upload-images', (req, res, next) => {
  const handler = upload.fields([
    { name: 'images', maxCount: 5 },
    { name: 'image', maxCount: 1 },
  ]);
  handler(req, res, function (err) {
    if (err) {
      const isSize = err && (err.code === 'LIMIT_FILE_SIZE');
      const isCount = err && (err.code === 'LIMIT_FILE_COUNT');
      const isType = /Only image files are allowed/i.test(err.message || '');
      const detail = isSize ? 'File too large. Max 20MB each.' : isCount ? 'Too many files. Max 10.' : isType ? 'Unsupported file type.' : (err.message || String(err));
      return res.status(400).json({ message: 'Image upload failed', detail });
    }
    next();
  });
}, uploadMultipleImages);
dataRouter.post('/upload-image',  upload.single('image'), uploadMultipleImages);
// Replace a specific image of a listing
dataRouter.put('/listings/:listingId/images/:imageId/replace', authMiddleware, (req, res, next) => {
  console.log('[replaceImage][PUT] incoming', {
    path: req.path,
    method: req.method,
    params: req.params,
    query: req.query,
    contentType: req.headers['content-type'],
    hasAuth: !!req.headers['authorization'],
    origin: req.headers['origin']
  });
  const handler = upload.single('image');
  handler(req, res, function (err) {
    if (err) {
      const isSize = err && (err.code === 'LIMIT_FILE_SIZE');
      const isType = /Only image files are allowed/i.test(err.message || '');
      const detail = isSize ? 'File too large. Max 20MB each.' : isType ? 'Unsupported file type.' : (err.message || String(err));
      return res.status(400).json({ message: 'Image upload failed', detail });
    }
    console.log('[replaceImage][PUT] file received', {
      filePresent: !!req.file,
      filename: req.file && req.file.filename,
      size: req.file && req.file.size
    });
    next();
  });
}, replaceListingImage);

// POST alias for environments that have issues with PUT + multipart
dataRouter.post('/listings/:listingId/images/:imageId/replace', authMiddleware, (req, res, next) => {
  console.log('[replaceImage][POST alias] incoming', {
    path: req.path,
    method: req.method,
    params: req.params,
    query: req.query,
    contentType: req.headers['content-type'],
    hasAuth: !!req.headers['authorization'],
    origin: req.headers['origin']
  });
  const handler = upload.single('image');
  handler(req, res, function (err) {
    if (err) {
      const isSize = err && (err.code === 'LIMIT_FILE_SIZE');
      const isType = /Only image files are allowed/i.test(err.message || '');
      const detail = isSize ? 'File too large. Max 20MB each.' : isType ? 'Unsupported file type.' : (err.message || String(err));
      return res.status(400).json({ message: 'Image upload failed', detail });
    }
    console.log('[replaceImage][POST alias] file received', {
      filePresent: !!req.file,
      filename: req.file && req.file.filename,
      size: req.file && req.file.size
    });
    next();
  });
}, replaceListingImage);

// Body/query driven fallback: POST /listings/replace-image?listingId=...&imageId=...
dataRouter.post('/listings/replace-image', authMiddleware, (req, res, next) => {
  console.log('[replaceImage][POST fallback] incoming', {
    path: req.path,
    method: req.method,
    params: req.params,
    query: req.query,
    body: req.body && Object.keys(req.body),
    contentType: req.headers['content-type'],
    hasAuth: !!req.headers['authorization'],
    origin: req.headers['origin']
  });
  const handler = upload.single('image');
  handler(req, res, function (err) {
    if (err) {
      const isSize = err && (err.code === 'LIMIT_FILE_SIZE');
      const isType = /Only image files are allowed/i.test(err.message || '');
      const detail = isSize ? 'File too large. Max 20MB each.' : isType ? 'Unsupported file type.' : (err.message || String(err));
      return res.status(400).json({ message: 'Image upload failed', detail });
    }
    console.log('[replaceImage][POST fallback] file received', {
      filePresent: !!req.file,
      filename: req.file && req.file.filename,
      size: req.file && req.file.size
    });
    next();
  });
}, replaceListingImage);

// Lightweight debug to confirm router is mounted in prod
dataRouter.get('/_debug/replace-route/:listingId/:imageId', (req, res) => {
  res.status(200).json({
    ok: true,
    message: 'Replace route namespace is mounted',
    params: req.params
  });
});
dataRouter.get('/listings/HostListingImages', getHostListingImages);
dataRouter.delete('/listings/deletelisting', deletelisting);
dataRouter.post('/messages/send-message', authMiddleware, sendMessage);
dataRouter.get('/messages/get-messages', authMiddleware, getMessages);
dataRouter.get('/conversations/:userId', authMiddleware, getConversationsByUserId);
dataRouter.post('/subscribe', authMiddleware, savePushSubscription);
dataRouter.post('/unsubscribe', unsubscribe);
dataRouter.post('/bookings/confirm', authMiddleware, confirmBooking);

// Wishlist routes
dataRouter.post('/wishlist/add', addToWishlist);
dataRouter.delete('/wishlist/remove/:id', removeFromWishlist);
dataRouter.get('/wishlist/:userId', getUserWishlist);

dataRouter.get('/bookings/listing/:listingId', async (req, res) => {
  try {
    const listingId = parseInt(req.params.listingId);
    if (isNaN(listingId)) {
      return res.status(400).json({ success: false, message: 'Valid listingId is required' });
    }

    const bookings = await bookingRepo.find({
      where: { listing_id: listingId, status: 'confirmed' },
      select: ['check_in_date', 'check_out_date']
    });

    const getDatesInRange = (startDate, endDate) => {
      const dates = [];
      const start = new Date(startDate);
      const end = new Date(endDate);
      for (let date = new Date(start); date < end; date.setDate(date.getDate() + 1)) {
        dates.push(date.toISOString().split('T')[0]); 
      }
      
      return dates;
    };
    const allBookedDates = [];
    (bookings || []).forEach(booking => {
      const dates = getDatesInRange(booking.check_in_date, booking.check_out_date);
      allBookedDates.push(...dates);
    });

    // Remove duplicates and sort
    const uniqueBookedDates = [...new Set(allBookedDates)].sort();

    return res.status(200).json({ 
      success: true, 
      listing_id: listingId, 
      disabled_dates: uniqueBookedDates,
      count: uniqueBookedDates.length
    });
  } catch (error) {
    console.error('Error fetching booked ranges:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch booked ranges', error: error.message });
  }
});
dataRouter.get('/bookings/:bookingId', authMiddleware, async (req, res) => {
  try {
    const bookingId = parseInt(req.params.bookingId);
    const userId = parseInt(req.user.id);
    
    const booking = await bookingRepo.findOne({ 
      where: { id: bookingId },
      relations: ['listing', 'guest']
    });
    
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }
    
    // Check if user is either the guest or the host of the listing
    if (booking.guest_id !== userId && booking.listing.host_id !== userId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    
    return res.status(200).json({ success: true, booking });
  } catch (error) {
    console.error("Error fetching booking:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch booking", error: error.message });
  }
});

// Get all bookings for a user (as guest and as host)
dataRouter.get('/bookings/user/:userId', authMiddleware, async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const currentUserId = parseInt(req.user.id);
    
    if (userId !== currentUserId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    
    // Get bookings where user is the guest
    const guestBookings = await bookingRepo.find({ 
      where: { guest_id: userId },
      relations: ['listing']
    });
    
    // Get listings where user is the host, then get bookings for those listings
    const hostListings = await listingRepo.find({ 
      where: { host_id: userId },
      select: ['id']
    });
    
    const listingIds = hostListings.map(listing => listing.id);
    const hostBookings = listingIds.length > 0 ? await bookingRepo.find({ 
      where: { listing_id: In(listingIds) },
      relations: ['listing', 'guest']
    }) : [];
    
    return res.status(200).json({ 
      success: true, 
      bookings: {
        asGuest: guestBookings,
        asHost: hostBookings
      }
    });
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch bookings", error: error.message });
  }
});

// Debug endpoint to check push subscription status
dataRouter.get('/push-subscriptions/:userId', authMiddleware, async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const currentUserId = parseInt(req.user.id);
    
    if (userId !== currentUserId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    
    const { PushSubscription } = await import('../Models/PushSubscription.js');
    const pushSubRepo = AppDataSource.getRepository(PushSubscription);
    
    const subscriptions = await pushSubRepo.find({ where: { user_id: userId } });
    
    return res.status(200).json({ 
      success: true, 
      subscriptions: subscriptions.map(sub => ({
        id: sub.id,
        endpoint: sub.endpoint.substring(0, 50) + '...',
        created_at: sub.created_at
      })),
      count: subscriptions.length
    });
  } catch (error) {
    console.error("Error fetching push subscriptions:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch subscriptions", error: error.message });
  }
});

// Send booking notification endpoint
dataRouter.post('/notifications/send-booking', authMiddleware, async (req, res) => {
  try {
    const { guestId, listingId, bookingId, message } = req.body;
    const currentUserId = parseInt(req.user.id);
    
    // Validate required fields
    if (!guestId || !listingId) {
      return res.status(400).json({ 
        success: false, 
        message: "guestId and listingId are required" 
      });
    }
    
    const parsedGuestId = parseInt(guestId);
    const parsedListingId = parseInt(listingId);
    
    // Validate that the current user is either the guest or has permission to send notifications
    if (parsedGuestId !== currentUserId) {
      // You might want to add additional permission checks here
      // For now, we'll allow it but log it
      console.log(`User ${currentUserId} sending notification for guest ${parsedGuestId}`);
    }
    
    const { sendBookingNotification } = await import('../Controllers/datacontroller.js');
    const result = await sendBookingNotification(parsedGuestId, parsedListingId, req.io, { 
      bookingId: bookingId || 'manual-notification',
      customMessage: message
    });
    
    if (result.success) {
      return res.status(200).json({ 
        success: true, 
        message: "Booking notification sent successfully",
        data: {
          conversation: result.conversation,
          message: result.message,
          notificationSent: true
        }
      });
    } else {
      return res.status(400).json({ 
        success: false, 
        message: "Failed to send booking notification",
        error: result.error 
      });
    }
  } catch (error) {
    console.error("Error sending booking notification:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Failed to send booking notification", 
      error: error.message 
    });
  }
});

// Test notification endpoint
dataRouter.post('/test-notification', authMiddleware, async (req, res) => {
  try {
    const { listingId, message } = req.body;
    const userId = parseInt(req.user.id);
    
    if (!listingId) {
      return res.status(400).json({ success: false, message: "listingId is required" });
    }
    
    const { sendBookingNotification } = await import('../Controllers/datacontroller.js');
    const result = await sendBookingNotification(userId, listingId, req.io, { 
      bookingId: 'test-booking',
      testMessage: message || 'Test notification'
    });
    
    return res.status(200).json({ 
      success: true, 
      message: "Test notification sent",
      result 
    });
  } catch (error) {
    console.error("Error sending test notification:", error);
    return res.status(500).json({ success: false, message: "Failed to send test notification", error: error.message });
  }
});
export default dataRouter;