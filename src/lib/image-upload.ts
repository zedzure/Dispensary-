
import { ref, uploadBytes, getDownloadURL, getStorage } from "firebase/storage";

export const uploadImage = async (file: File, path?: string): Promise<string> => {
  const storage = getStorage();
  const defaultPath = `images/${Date.now()}-${file.name}`;
  const storageRef = ref(storage, path || defaultPath);

  try {
    const snapshot = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(snapshot.ref);
    return url;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Image upload failed.");
  }
};
