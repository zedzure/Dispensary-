
import type { Timestamp } from 'firebase/firestore';

export type PostItColor = 'yellow' | 'pink' | 'blue' | 'green';

export interface PostIt {
  id: string;
  content: string;
  color?: PostItColor;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
