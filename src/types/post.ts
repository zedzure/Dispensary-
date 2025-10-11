
import type { Timestamp } from 'firebase/firestore';

export interface Post {
  id: string;
  type: 'photo' | 'video' | 'music' | 'text';
  fileUrl?: string;
  thumbnail?: string;
  caption?: string;
  userId: string;
  likes: number;
  commentsCount: number;
  duration?: number;
  tags?: string[];
  createdAt: Timestamp;
}
