// Utility to get full image URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const BASE_URL = API_URL.replace('/api', '');

export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // If already full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If starts with /uploads, use base URL
  if (imagePath.startsWith('/uploads')) {
    const fullUrl = `${BASE_URL}${imagePath}`;
    // Debug in development
    if (import.meta.env.DEV) {
      console.log('Image URL:', fullUrl, 'from path:', imagePath);
    }
    return fullUrl;
  }
  
  // Otherwise, assume it's relative to uploads
  const fullUrl = `${BASE_URL}/uploads/${imagePath}`;
  if (import.meta.env.DEV) {
    console.log('Image URL:', fullUrl, 'from path:', imagePath);
  }
  return fullUrl;
};

export default getImageUrl;

