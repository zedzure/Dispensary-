
'use client';

import { storage } from '@/lib/firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

/**
 * Uploads a file to Firebase Storage in the 'products' directory.
 * @param file The image file to upload.
 * @returns A promise that resolves with the public download URL of the uploaded image.
 */
export const uploadImage = async (file: File): Promise<string> => {
  if (!file) {
    throw new Error("No file provided for upload.");
  }
  // Add a timestamp to the filename to prevent overwrites
  const storageRef = ref(storage, `products/${Date.now()}-${file.name}`);
  
  await uploadBytes(storageRef, file);
  
  const url = await getDownloadURL(storageRef);
  return url;
};
