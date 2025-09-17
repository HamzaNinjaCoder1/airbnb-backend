// Frontend helper functions for image uploads
// Add this to your frontend project

// Convert file to base64 (for the existing endpoint)
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

// Upload single image using FormData (recommended)
export const uploadSingleImage = async (file, listingId) => {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('listing_id', listingId);

  try {
    const response = await fetch('http://localhost:5000/api/data/upload-image', {
      method: 'POST',
      credentials: 'include',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// Upload multiple images using FormData (recommended)
export const uploadMultipleImages = async (files, listingId) => {
  const formData = new FormData();
  files.forEach(file => {
    formData.append('images', file);
  });
  formData.append('listing_id', listingId);

  try {
    const response = await fetch('http://localhost:5000/api/data/upload-images', {
      method: 'POST',
      credentials: 'include',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error uploading images:', error);
    throw error;
  }
};

// Upload using base64 (existing method - not recommended for large files)
export const uploadImageBase64 = async (file, listingId) => {
  try {
    const base64 = await fileToBase64(file);
    
    const response = await fetch('http://localhost:5000/api/data/listingImage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        listing_id: listingId,
        image_url: base64
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// Example usage in your React component:
/*
import { uploadSingleImage, uploadMultipleImages } from './frontend-upload-helper';

// In your component:
const handleFileUpload = async (file, listingId) => {
  try {
    const result = await uploadSingleImage(file, listingId);
    console.log('Upload successful:', result);
  } catch (error) {
    console.error('Upload failed:', error);
  }
};

const handleMultipleFileUpload = async (files, listingId) => {
  try {
    const result = await uploadMultipleImages(files, listingId);
    console.log('Upload successful:', result);
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
*/

