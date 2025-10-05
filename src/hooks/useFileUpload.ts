
"use client";

import { useState } from "react";
import { useAuth, useFirestore } from "@/firebase";
import { getStorage, ref, uploadBytes, getDownloadURL, getMetadata, deleteObject } from "firebase/storage";
import {
  doc,
  collection,
  addDoc,
  updateDoc,
  increment,
  serverTimestamp,
  getDoc,
  deleteDoc,
} from "firebase/firestore";

export function useFileUpload() {
  const auth = useAuth();
  const db = useFirestore();
  const storage = getStorage();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (file: File) => {
    if (!auth.currentUser) throw new Error("User not logged in.");
    const userId = auth.currentUser.uid;
    const userRef = doc(db, "users", userId);

    try {
      setUploading(true);
      setError(null);

      // 1️⃣ Quota check (1GB per user)
      const userSnap = await getDoc(userRef);
      const currentSpaceUsed = userSnap.data()?.usedStorage || 0;
      const MAX_SPACE = 1 * 1024 * 1024 * 1024; // 1GB
      if (currentSpaceUsed + file.size > MAX_SPACE) {
        throw new Error("Storage limit exceeded (1GB max).");
      }

      // 2️⃣ Size check (10MB per file)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error("File size exceeds 10MB limit.");
      }

      // 3️⃣ Upload
      const storageRef = ref(storage, `user_uploads/${userId}/${Date.now()}-${file.name}`);
      await uploadBytes(storageRef, file);

      // 4️⃣ Get metadata + URL
      const downloadURL = await getDownloadURL(storageRef);
      const metadata = await getMetadata(storageRef);

      // 5️⃣ Save metadata in Firestore
      const uploadDoc = await addDoc(collection(db, "users", userId, "uploads"), {
        name: file.name,
        type: file.type,
        size: file.size,
        url: downloadURL,
        uploadedAt: serverTimestamp(),
      });

      // 6️⃣ Update storage usage
      await updateDoc(userRef, {
        usedStorage: increment(file.size),
      });

      return { url: downloadURL, metadata, id: uploadDoc.id };
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  const deleteFile = async (userId: string, fileId: string, filePath: string, fileSize: number) => {
    try {
      // 1️⃣ Delete from Storage
      const fileRef = ref(storage, filePath);
      await deleteObject(fileRef);

      // 2️⃣ Delete from Firestore
      await deleteDoc(doc(db, "users", userId, "uploads", fileId));

      // 3️⃣ Update storage usage
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        usedStorage: increment(-fileSize),
      });
    } catch (err) {
      console.error("Delete failed:", err);
      throw err;
    }
  };

  return { uploadFile, deleteFile, uploading, error };
}
