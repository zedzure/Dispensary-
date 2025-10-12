
import type { Timestamp } from 'firebase/firestore';

export interface User {
  uid: string;
  username: string;
  displayName: string;
  photoURL: string;
  bio: string;
  followersCount: number;
  followingCount: number;
  createdAt: Timestamp | Date;
  chatIds?: string[];
  followers?: string[];
  following?: string[];
  friendRequests?: string[];
  acceptedFriends?: string[];
}
