
import AppDataSource from '../config/db.js';
import { listing_imagesmodule } from '../Models/listing_imagesmodule.js';
import { listingsmodule } from '../Models/listingsmodule.js';
import { headingsModule } from '../Models/headingmodule.js';
import { messagesmodule } from '../Models/messagesmodule.js';
import { conversationsmodule } from '../Models/conversationsmodule.js';
import { bookingmodule } from '../Models/bookingmodule.js';
import { usersmodule } from '../Models/usersmodule.js';
import { In } from 'typeorm';
import { wishlistmodule } from '../Models/wishlistmodule.js';
import { PushSubscription } from '../Models/PushSubscription.js';
import webpush from 'web-push';

// Repositories
const listingRepo = AppDataSource.getRepository(listingsmodule);
const listingImageRepo = AppDataSource.getRepository(listing_imagesmodule);
const headingsRepo = AppDataSource.getRepository(headingsModule);
const messageRepo = AppDataSource.getRepository(messagesmodule);
const conversationRepo = AppDataSource.getRepository(conversationsmodule);
const pushSubRepo = AppDataSource.getRepository(PushSubscription);
const bookingRepo = AppDataSource.getRepository(bookingmodule);
const wishlistRepo = AppDataSource.getRepository(wishlistmodule);
const userRepo = AppDataSource.getRepository(usersmodule);


// Create a new listing
export const listing = async (req, res) => {

  const {
    host_id,
    title,
    subtitle,
    description,
    address,
    price_per_night,
    city,
    country,
    latitude,
    longitude,
    max_guests,
    bedrooms,
    beds,
    baths,
    rating,
    reviews_count,
    map_url,
    stay_type,
    property_type,
    status = "draft",
    current_step = "step1"
  } = req.body;

  try {
    const newListing = listingRepo.create({
      host_id,
      title,
      subtitle,
      description,
      address,
      price_per_night,
      city,
      country,
      latitude,
      longitude,
      max_guests,
      bedrooms,
      beds,
      baths,
      rating,
      reviews_count,
      map_url,
      stay_type,
      property_type,
      status,
      current_step,
    });

    const saved = await listingRepo.save(newListing);
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create listing",
      error: error.message,
    });
  }
};


// Add a listing image
export const listingImage = async (req, res) => {
  const { listing_id, image_url } = req.body;

  try {
    if (!listing_id || !image_url) {
      return res.status(400).json({ message: "listing_id and image_url are required" });
    }

    const newImage = listingImageRepo.create({
      listing_id,
      image_url,

    });

    const saved = await listingImageRepo.save(newImage);
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create listing image",
      error: error.message,
    });
  }
};

// Get all listings or listings by city (grouped by city)
export const getListings = async (req, res) => {
  try {
    const { city } = req.query;

    let listings;
    if (city) {
      listings = await listingRepo.find({
        where: { city },
        relations: ['images'],
      });
    } else {
      listings = await listingRepo.find({ relations: ['images'] });
    }

    // Group listings by city
    const groupedListings = listings.reduce((acc, listing) => {
      if (!acc[listing.city]) {
        acc[listing.city] = [];
      }
      acc[listing.city].push(listing);
      return acc;
    }, {});

    res.status(200).json(groupedListings);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get listings",
      error: error.message,
    });
  }
};

// Get listings by specific city
export const getListingsByCity = async (req, res) => {
  try {
    const { city } = req.params;

    if (!city) {
      return res.status(400).json({ message: "City is required" });
    }

    const listings = await listingRepo.find({
      where: { city },
      relations: ['images'],
    });

    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get listings by city",
      error: error.message,
    });
  }
};

// Save a heading
export const saveHeading = async (req, res) => {
  const { heading_text, city } = req.body;

  try {
    if (!heading_text || !city) {
      return res.status(400).json({ message: "heading_text and city are required" });
    }

    const newHeading = headingsRepo.create({
      heading_text,
      city,
    });

    const saved = await headingsRepo.save(newHeading);

    res.status(200).json({
      message: "Heading saved successfully",
      data: saved,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to save heading",
      error: error.message,
    });
  }
};

// Get all headings grouped by city
export const getHeadingsGrouped = async (req, res) => {
  try {
    const headings = await headingsRepo.find();
    const groupedHeadings = headings.reduce((acc, heading) => {
      if (!acc[heading.city]) {
        acc[heading.city] = [];
      }
      acc[heading.city].push(heading);
      return acc;
    }, {});

    res.status(200).json(groupedHeadings);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get headings",
      error: error.message,
    });
  }
};

export const checkOrCreateHostListing = async (req, res) => {
  try {
    console.log('checkOrCreateHostListing - req.user:', req.user);
    const hostId = req.user.id;
    console.log('Host ID:', hostId);
    let listing = await listingRepo.findOne({ where: { host_id: hostId } });

    if (listing) {
      return res.status(200).json({
        success: true,
        message: "Listing exists",
        data: listing
      });
    }

    listing = listingRepo.create({
      host_id: hostId,
      title: "Untitled Listing", // Required field
      status: "draft",
      current_step: "step0"
    });

    await listingRepo.save(listing);

    return res.status(201).json({
      success: true,
      message: "New draft listing created",
      data: listing
    });

  } catch (error) {
    console.error('Error in checkOrCreateHostListing:', error);
    res.status(500).json({
      success: false,
      message: "Failed to check or create listing",
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export const saveAndUpdateListing = async (req, res) => {
  try {
    const hostId = parseInt(req.query.hostId);
    if (isNaN(hostId)) {
      return res.status(400).json({ message: "Valid hostId is required" });
    }

    const { listingId } = req.query; 

    let listing;

    if (listingId) {
      
      listing = await listingRepo.findOne({
        where: { id: listingId, host_id: hostId },
      });

      if (!listing) {
        return res.status(404).json({ message: "Listing not found for this host" });
      }
    } else {
      // If no listingId provided, reuse existing draft listing for this host (avoid creating duplicates)
      const existingDraft = await listingRepo.findOne({ where: { host_id: hostId, status: "draft" } });
      listing = existingDraft ? existingDraft : listingRepo.create({ host_id: hostId, status: "draft" });
    }

    const updatableFields = [
      "title", "subtitle", "description", "price_per_night", "city", "country",
      "address", "latitude", "longitude", "max_guests", "bedrooms", "beds", "baths",
      "rating", "reviews_count", "map_url", "stay_type", "property_type",
      "status", "current_step"
    ];

    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        listing[field] = req.body[field];
      }
    });

    const savedListing = await listingRepo.save(listing);

    return res.status(200).json({
      success: true,
      message: listingId ? "Listing updated successfully" : "New listing created successfully",
      data: savedListing
    });

  } catch (error) {
    console.error("Error saving or updating listing:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to save or update listing",
      error: error.message
    });
  }
};



export const uploadMultipleImages = async (req, res) => {
  try {
    const hostId = parseInt(req.query.hostId);
    const listingId = parseInt(req.query.listingId);

    console.log('[uploadMultipleImages] Incoming request', {
      hostIdRaw: req.query.hostId,
      parsedHostId: hostId,
      listingIdRaw: req.query.listingId,
      parsedListingId: listingId,
    });
    if (isNaN(hostId)) {
      console.warn('[uploadMultipleImages] Invalid hostId');
      return res.status(400).json({ message: "Valid hostId is required" });
    }
    if (isNaN(listingId)) {
      console.warn('[uploadMultipleImages] Missing or invalid listingId');
      return res.status(400).json({ message: "Valid listingId is required" });
    }

    const images = req.files;
    console.log('[uploadMultipleImages] Files received', {
      filesProvided: Array.isArray(images),
      filesCount: Array.isArray(images) ? images.length : 0,
      contentType: req.headers['content-type'] || null,
    });

    if (!images || images.length === 0) {
      return res.status(400).json({ 
        message: "No images provided",
        hint: "Ensure request is multipart/form-data with field name 'images'",
      });
    }

    const listing = await listingRepo.findOne({ 
      where: { id: listingId, host_id: hostId } 
    });

    if (!listing) {
      console.warn('[uploadMultipleImages] Listing not found', { listingId, hostId });
      return res.status(404).json({ 
        message: "No listing found with the provided ID for this host" 
      });
    }

    const newImages = images.map((image) =>
      listingImageRepo.create({
        listing_id: listing.id,   // ensure correct listing_id
        image_url: image.filename,
      })
    );

    await listingImageRepo.save(newImages);

    return res.status(201).json({
      message: "Images uploaded successfully",
      listing_id: listing.id,
      images: newImages,
    });

  } catch (error) {
    console.error("Error uploading image:", error);
    return res.status(500).json({
      message: "Failed to upload images",
      error: error.message,
    });
  }
};


export const getHostListingImages = async (req, res) => {
  try {
    const hostId = parseInt(req.query.hostId);
    console.log('[getHostListingImages] Incoming request', {
      hostIdRaw: req.query.hostId,
      parsedHostId: hostId,
    });

    if (isNaN(hostId)) {
      return res.status(400).json({ message: "Valid hostId is required" });
    }
    const listings = await listingRepo.find({
      where: { host_id: hostId },
      select: ["id", "title", "city", "country", "current_step", "status"], 
    });

    if (!listings || listings.length === 0) {
      return res.status(404).json({ message: "No listings found for this host" });
    }

    const listingIds = listings.map((l) => l.id);

    const images = await listingImageRepo.find({
      where: { listing_id: In(listingIds) },
      select: ["listing_id", "image_url"],
    });

    const result = listings.map((listing) => {
      const listingImages = images.filter(
        (img) => img.listing_id === listing.id
      );
      return {
        listing_id: listing.id,
        host_id: hostId,
        title: listing.title,
        city: listing.city,
        country: listing.country,
        images: listingImages.map((img) => img.image_url),
        current_step: listing.current_step,
        status: listing.status,
      };
    });

    return res.status(200).json({
      success: true,
      data: result,
    });

  } catch (error) {
    console.error("Error getting host listing images:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get host listing images",
      error: error.message,
    });
  }
};

export const deletelisting = async (req, res) => {
  try {
    const listingId = parseInt(req.query.listingId);
    const hostId = parseInt(req.query.hostId);

    console.log('[deletelisting] Incoming request', {
      listingIdRaw: req.query.listingId,
      parsedListingId: listingId,
      hostIdRaw: req.query.hostId,
      parsedHostId: hostId,
    });

    if (isNaN(listingId) || isNaN(hostId)) {
      return res.status(400).json({ message: "Valid listingId and hostId are required" });
    }

    // Find the listing with images relation
    const listing = await listingRepo.findOne({ 
      where: { id: listingId, host_id: hostId },
      relations: ['images']
    });
    
    if (!listing) {
      console.warn('[deletelisting] Listing not found', { listingId, hostId });
      return res.status(404).json({ message: "Listing not found" });
    }

    console.log('[deletelisting] Found listing', {
      listingId: listing.id,
      hostId: listing.host_id,
      imagesCount: listing.images ? listing.images.length : 0
    });

    // Delete associated images first
    if (listing.images && listing.images.length > 0) {
      await listingImageRepo.remove(listing.images);
      console.log('[deletelisting] Deleted images', { count: listing.images.length });
    }

    // Delete the listing
    await listingRepo.remove(listing);
    console.log('[deletelisting] Deleted listing successfully');

    return res.status(200).json({ 
      success: true,
      message: "Listing deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting listing:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete listing",
      error: error.message,
    });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { message, conversation_id, receiver_id } = req.body;
    const senderId = parseInt(req.user.id);

    if (!message || !conversation_id || !receiver_id) {
      return res.status(400).json({
        success: false,
        message: "message, conversation_id, and receiver_id are required"
      });
    }

    const newMessage = messageRepo.create({
      message_text: message,
      conversation_id: parseInt(conversation_id),
      sender_id: senderId,
      receiver_id: parseInt(receiver_id),
      message_type: "text",
      status: "sent"
    });

    const savedMessage = await messageRepo.save(newMessage);

    // Emit socket event
    req.io.to(conversation_id.toString()).emit("message", {
      id: savedMessage.id,
      message_text: message,
      sender_id: senderId,
      receiver_id: parseInt(receiver_id),
      conversation_id: parseInt(conversation_id),
      message_type: "text",
      status: "sent",
      created_at: savedMessage.created_at
    });

    const subscriptions = await pushSubRepo.find({ where: { user_id: parseInt(receiver_id) } });
    if (subscriptions.length > 0) {
      const senderName = req.user.name || req.user.first_name || "Someone";
      const iconUrl = "https://www.pngall.com/wp-content/uploads/13/Airbnb-Logo-PNG-Pic.png";
      const badgeUrl = "https://www.pngall.com/wp-content/uploads/13/Airbnb-Logo-PNG-Pic.png";
      const clientOrigin = process.env.CLIENT_ORIGIN || 'https://airbnb-frontend-sooty.vercel.app';
      const payload = JSON.stringify({
        title: `New message from ${senderName}`,
        body: message,
        icon: iconUrl,
        badge: badgeUrl,
        data: { 
          conversation_id: parseInt(conversation_id), 
          sender_id: senderId, 
          messageId: savedMessage.id,
          url: `${clientOrigin}/messages?conversationId=${parseInt(conversation_id)}`
        }
      });

      for (const sub of subscriptions) {
        try {
          await webpush.sendNotification(
            { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
            payload,
            { TTL: 86400 }
          );
          console.log(`Push notification sent to user ${receiver_id} for message`);
        } catch (err) {
          console.error(`Push notification failed for user ${receiver_id}:`, err);
          if (err.statusCode === 410 || err.statusCode === 404) {
            await pushSubRepo.delete({ id: sub.id });
            console.log(`Removed invalid push subscription for user ${receiver_id}`);
          }
        }
      }
    } else {
      console.log(`No push subscriptions found for user ${receiver_id}`);
    }

    return res.status(200).json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    console.error("Error sending message:", error);
    return res.status(500).json({ success: false, message: "Failed to send message", error: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { conversation_id } = req.query;
    if (!conversation_id) return res.status(400).json({ success: false, message: "conversation_id is required" });

    const messages = await messageRepo.find({
      where: { conversation_id: parseInt(conversation_id) },
      relations: ['sender', 'receiver'],
      order: { created_at: 'ASC' }
    });

    const conversation = await conversationRepo.findOne({ where: { id: parseInt(conversation_id) } });
    if (!conversation) return res.status(404).json({ success: false, message: "Conversation not found" });

    return res.status(200).json({ success: true, messages, conversation });
  } catch (error) {
    console.error("Error getting messages:", error);
    return res.status(500).json({ success: false, message: "Failed to get messages", error: error.message });
  }
};

export const getConversationsByUserId = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const currentUserId = parseInt(req.user.id);

    if (userId !== currentUserId) {
      return res.status(403).json({ success: false, message: "Access denied. You can only view your own conversations." });
    }

    const conversations = await conversationRepo.find({
      where: [{ user1_id: userId }, { user2_id: userId }],
      relations: ['user1', 'user2', 'messages'],
      order: { created_at: 'DESC' }
    });

    const formatted = await Promise.all(conversations.map(async conv => {
      const latestMessage = await messageRepo.findOne({
        where: { conversation_id: conv.id },
        relations: ['sender', 'receiver'],
        order: { created_at: 'DESC' }
      });

      const otherUser = conv.user1_id === userId ? conv.user2 : conv.user1;

      return {
        id: conv.id,
        otherUser: {
          id: otherUser.id,
          name: otherUser.name || otherUser.first_name || 'Unknown',
          email: otherUser.email,
          profile_picture: otherUser.profile_picture
        },
        latestMessage: latestMessage ? {
          id: latestMessage.id,
          message_text: latestMessage.message_text,
          message_type: latestMessage.message_type,
          status: latestMessage.status,
          created_at: latestMessage.created_at,
          sender: { id: latestMessage.sender.id, name: latestMessage.sender.name || latestMessage.sender.first_name || 'Unknown' }
        } : null,
        created_at: conv.created_at,
        updated_at: conv.updated_at
      };
    }));

    return res.status(200).json({ success: true, conversations: formatted });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch conversations", error: error.message });
  }
};

export const savePushSubscription = async (req, res) => {
  try {
    const { subscription } = req.body;
    const user_id = parseInt(req.user?.id);

    if (!subscription || typeof subscription !== 'object') return res.status(400).json({ success: false, message: "Invalid subscription payload" });
    if (!user_id) return res.status(401).json({ success: false, message: "Unauthorized" });

    const { endpoint, keys } = subscription || {};
    if (!endpoint || !keys?.p256dh || !keys?.auth) return res.status(400).json({ success: false, message: "endpoint, p256dh, and auth are required" });

    const existing = await pushSubRepo.findOne({ where: { endpoint } });
    if (existing) {
      existing.p256dh = keys.p256dh;
      existing.auth = keys.auth;
      existing.user_id = user_id;
      await pushSubRepo.save(existing);
      return res.status(200).json({ success: true, message: "Push subscription updated" });
    }

    await pushSubRepo.save({ endpoint, p256dh: keys.p256dh, auth: keys.auth, user_id });
    return res.status(201).json({ success: true, message: "Push subscription created" });
  } catch (error) {
    console.error("Error saving push subscription:", error);
    return res.status(500).json({ success: false, message: "Failed to save push subscription", error: error.message });
  }
};

export const unsubscribe = async (req, res) => {
  try {
    const { endpoint } = req.body;
    const existing = await pushSubRepo.findOne({ where: { endpoint } });

    if (!existing) return res.status(404).json({ success: false, message: "Push subscription not found" });

    await pushSubRepo.delete({ id: existing.id });
    return res.status(200).json({ success: true, message: "Push subscription deleted successfully" });
  } catch (error) {
    console.error("Error deleting push subscription:", error);
    return res.status(500).json({ success: false, message: "Failed to delete push subscription", error: error.message });
  }
};

// Helper function to send push notifications
const sendPushNotification = async (userId, title, body, data = {}) => {
  try {
    const subscriptions = await pushSubRepo.find({ where: { user_id: userId } });
    if (subscriptions.length === 0) {
      console.log(`No push subscriptions found for user ${userId}`);
      return { success: false, message: "No subscriptions found" };
    }

    const iconUrl = "https://www.pngall.com/wp-content/uploads/13/Airbnb-Logo-PNG-Pic.png";
    const badgeUrl = "https://www.pngall.com/wp-content/uploads/13/Airbnb-Logo-PNG-Pic.png";
    const payload = JSON.stringify({
      title,
      body,
      icon: iconUrl,
      badge: badgeUrl,
      data: { ...data, timestamp: Date.now() }
    });

    let successCount = 0;
    for (const sub of subscriptions) {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          payload,
          { TTL: 86400 }
        );
        successCount++;
      } catch (err) {
        console.error(`Push notification failed for user ${userId}:`, err);
        if (err.statusCode === 410 || err.statusCode === 404) {
          await pushSubRepo.delete({ id: sub.id });
          console.log(`Removed invalid push subscription for user ${userId}`);
        }
      }
    }

    return { success: successCount > 0, message: `Sent to ${successCount}/${subscriptions.length} subscriptions` };
  } catch (error) {
    console.error("Error in sendPushNotification:", error);
    return { success: false, message: error.message };
  }
};

export const sendBookingNotification = async (guestId, listingId, io, options = {}) => {
  try {
    const parsedGuestId = parseInt(guestId);
    const parsedListingId = parseInt(listingId);

    console.log('sendBookingNotification called with:', { guestId: parsedGuestId, listingId: parsedListingId });

    const guest = await userRepo.findOne({ where: { id: parsedGuestId } });
    if (!guest) {
      console.log('Guest not found:', parsedGuestId);
      return { success: false, error: "Guest user not found" };
    }
    console.log('Guest found:', { id: guest.id, name: guest.name || guest.first_name });

    const listing = await listingRepo.findOne({ where: { id: parsedListingId } });
    if (!listing) {
      console.log('Listing not found:', parsedListingId);
      return { success: false, error: "Listing not found" };
    }
    console.log('Listing found:', { id: listing.id, title: listing.title, host_id: listing.host_id });

    // ONLY use host_id
    const hostId = parseInt(listing.host_id);
    if (!hostId) {
      console.log('No host_id in listing:', listing);
      return { success: false, error: "No host found for listing" };
    }
    console.log('Host ID from listing:', hostId);

    const host = await userRepo.findOne({ where: { id: hostId } });
    if (!host) {
      console.log('Host user not found:', hostId);
      return { success: false, error: "Host user not found" };
    }
    console.log('Host found:', { id: host.id, name: host.name || host.first_name });

    // Find or create conversation
    let conversation = await conversationRepo.findOne({
      where: [{ user1_id: parsedGuestId, user2_id: hostId }, { user1_id: hostId, user2_id: parsedGuestId }]
    });
    if (!conversation) {
      conversation = await conversationRepo.save(conversationRepo.create({ 
        user1_id: parsedGuestId, 
        user2_id: hostId 
      }));
    }

    // Create system message
    const messageText = options.customMessage || `A new booking has been made for your listing "${listing.title}".`;
    const newMessage = await messageRepo.save(messageRepo.create({
      message_text: messageText,
      conversation_id: conversation.id,
      sender_id: parsedGuestId,
      receiver_id: hostId,
      message_type: "system",
      status: "sent"
    }));

    // Emit socket event to conversation room
    if (io) {
      io.to(conversation.id.toString()).emit("message", {
        id: newMessage.id,
        message_text: messageText,
        sender_id: parsedGuestId,
        receiver_id: hostId,
        conversation_id: conversation.id,
        message_type: "system",
        status: "sent",
        created_at: newMessage.created_at
      });
    }

    // Send push notifications to host
    const subscriptions = await pushSubRepo.find({ where: { user_id: hostId } });
    if (subscriptions.length > 0) {
      const iconUrl = "https://www.pngall.com/wp-content/uploads/13/Airbnb-Logo-PNG-Pic.png";
      const badgeUrl = "https://www.pngall.com/wp-content/uploads/13/Airbnb-Logo-PNG-Pic.png";
      const clientOrigin = process.env.CLIENT_ORIGIN || 'https://airbnb-frontend-sooty.vercel.app';
      const payload = JSON.stringify({
        title: `New booking for ${listing.title}`,
        body: messageText,
        icon: iconUrl,
        badge: badgeUrl,
        data: { 
          conversation_id: conversation.id, 
          sender_id: parsedGuestId, 
          messageId: newMessage.id, 
          bookingId: options.bookingId, 
          type: "booking",
          listingId: parsedListingId,
          url: `${clientOrigin}/messages?conversationId=${conversation.id}`
        }
      });

      for (const sub of subscriptions) {
        try {
          await webpush.sendNotification(
            { 
              endpoint: sub.endpoint, 
              keys: { p256dh: sub.p256dh, auth: sub.auth } 
            }, 
            payload, 
            { TTL: 86400 }
          );
          console.log(`Push notification sent to host ${hostId} for booking`);
        } catch (err) {
          console.error(`Push notification failed for host ${hostId}:`, err);
          if (err.statusCode === 410 || err.statusCode === 404) {
            await pushSubRepo.delete({ id: sub.id });
            console.log(`Removed invalid push subscription for host ${hostId}`);
          }
        }
      }
    } else {
      console.log(`No push subscriptions found for host ${hostId}`);
    }

    return { success: true, conversation, message: newMessage };
  } catch (error) {
    console.error("Error in sendBookingNotification:", error);
    return { success: false, error: error.message };
  }
};

export const confirmBooking = async (req, res) => {
  try {
    const { listing_id, check_in_date, check_out_date, guests, total_price } = req.body;
    const guestId = parseInt(req.user.id);

    console.log('Booking request:', { listing_id, guestId, check_in_date, check_out_date, guests, total_price });

    if (!listing_id || !check_in_date || !check_out_date || !guests || !total_price) {
      return res.status(400).json({ success: false, message: "listing_id, check_in_date, check_out_date, guests, and total_price are required" });
    }

    const checkInDate = new Date(check_in_date);
    const checkOutDate = new Date(check_out_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkInDate < today) return res.status(400).json({ success: false, message: "check_in_date cannot be in the past" });
    if (checkOutDate <= checkInDate) return res.status(400).json({ success: false, message: "check_out_date must be after check_in_date" });

    const listing = await listingRepo.findOne({ where: { id: parseInt(listing_id) } });
    if (!listing) return res.status(404).json({ success: false, message: "Listing not found" });

    console.log('Found listing:', { id: listing.id, title: listing.title, host_id: listing.host_id });
    if (listing.host_id === guestId) {
      return res.status(400).json({ success: false, message: "You cannot book your own listing" });
    }

    const bookingData = {
      listing_id: parseInt(listing_id),
      guest_id: guestId,
      check_in_date,
      check_out_date,
      guests: parseInt(guests),
      total_price: parseFloat(total_price),
      status: "confirmed"
    };

    console.log('Creating booking with data:', bookingData);

    const savedBooking = await bookingRepo.save(bookingRepo.create(bookingData));
    console.log('Booking created successfully:', { id: savedBooking.id, listing_id: savedBooking.listing_id });

    const notificationResult = await sendBookingNotification(guestId, parseInt(listing_id), req.io, { bookingId: savedBooking.id });

    const response = {
      success: true,
      message: "Booking confirmed successfully",
      booking: savedBooking,
      notification: notificationResult
    };

    if (!notificationResult.success) {
      response.warning = "Booking confirmed but notification failed: " + notificationResult.error;
    }

    return res.status(200).json(response);
  } catch (error) {
    console.error("Error in confirmBooking:", error);
    return res.status(500).json({ success: false, message: "Failed to confirm booking", error: error.message });
  }
};

// Wishlist Controllers
export const addToWishlist = async (req, res) => {
  try {
    const { user_id, listing_id } = req.body;

    if (!user_id || !listing_id) {
      return res.status(400).json({ success: false, message: "user_id and listing_id are required" });
    }

    const userId = parseInt(user_id);
    const listingId = parseInt(listing_id);

    const user = await userRepo.findOne({ where: { id: userId } });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const listing = await listingRepo.findOne({ where: { id: listingId } });
    if (!listing) return res.status(404).json({ success: false, message: "Listing not found" });

    const existing = await wishlistRepo.findOne({ where: { user_id: userId, listing_id: listingId } });
    if (existing) {
      return res.status(200).json({ success: true, message: "Listing already in wishlist", data: existing });
    }

    const saved = await wishlistRepo.save(wishlistRepo.create({ user_id: userId, listing_id: listingId }));
    return res.status(201).json({ success: true, message: "Added to wishlist", data: saved });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to add to wishlist", error: error.message });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const { id } = req.params;
    const wishlistId = parseInt(id);
    if (isNaN(wishlistId)) return res.status(400).json({ success: false, message: "Valid wishlist id is required" });

    const existing = await wishlistRepo.findOne({ where: { id: wishlistId } });
    if (!existing) return res.status(404).json({ success: false, message: "Wishlist item not found" });

    await wishlistRepo.delete({ id: wishlistId });
    return res.status(200).json({ success: true, message: "Removed from wishlist" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to remove from wishlist", error: error.message });
  }
};

export const getUserWishlist = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) return res.status(400).json({ success: false, message: "Valid userId is required" });

    const items = await wishlistRepo.find({ where: { user_id: userId } });
    if (!items || items.length === 0) {
      return res.status(200).json({ success: true, message: "No wishlist items", data: [] });
    }

    const listingIds = items.map(i => i.listing_id);
    const listings = await listingRepo.find({ where: { id: In(listingIds) }, relations: ['images'] });

    const byId = new Map(listings.map(l => [l.id, l]));
    const result = items.map(i => ({
      id: i.id,
      listing_id: i.listing_id,
      created_at: i.created_at,
      listing: byId.get(i.listing_id) ? {
        id: byId.get(i.listing_id).id,
        title: byId.get(i.listing_id).title,
        price_per_night: byId.get(i.listing_id).price_per_night,
        city: byId.get(i.listing_id).city,
        country: byId.get(i.listing_id).country,
        images: (byId.get(i.listing_id).images || []).map(img => img.image_url)
      } : null
    }));

    return res.status(200).json({ success: true, message: "Wishlist fetched", data: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch wishlist", error: error.message });
  }
};