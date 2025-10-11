
'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useUser, useFirestore, addDocumentNonBlocking, setDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase';
import type { PostIt, PostItColor } from '@/types/post-it';
import { cn } from '@/lib/utils';
import { collection, doc, serverTimestamp } from 'firebase/firestore';
import { Trash } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


interface PostItModalProps {
  isOpen: boolean;
  onClose: () => void;
  note: PostIt | null;
}

const colorOptions: { name: PostItColor, className: string }[] = [
  { name: 'yellow', className: 'bg-yellow-300' },
  { name: 'pink', className: 'bg-pink-300' },
  { name: 'blue', className: 'bg-blue-300' },
  { name: 'green', className: 'bg-green-300' },
];

export function PostItModal({ isOpen, onClose, note }: PostItModalProps) {
  const { user } = useUser();
  const firestore = useFirestore();
  const [content, setContent] = useState('');
  const [color, setColor] = useState<PostItColor>('yellow');

  useEffect(() => {
    if (isOpen) {
      setContent(note?.content || '');
      setColor(note?.color || 'yellow');
    }
  }, [isOpen, note]);

  const handleSave = () => {
    if (!user || !firestore || !content.trim()) return;

    const postItsCol = collection(firestore, 'users', user.uid, 'post-its');

    if (note) {
      // Update existing note
      const noteRef = doc(postItsCol, note.id);
      setDocumentNonBlocking(noteRef, {
        content,
        color,
        updatedAt: serverTimestamp(),
      }, { merge: true });
    } else {
      // Create new note
      addDocumentNonBlocking(postItsCol, {
        content,
        color,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
    onClose();
  };

  const handleDelete = () => {
    if (!user || !firestore || !note) return;
    const noteRef = doc(firestore, 'users', user.uid, 'post-its', note.id);
    deleteDocumentNonBlocking(noteRef);
    onClose();
  }

  const noteColorClass = {
    'yellow': 'bg-yellow-200/80 border-yellow-300/80 text-yellow-900',
    'pink': 'bg-pink-200/80 border-pink-300/80 text-pink-900',
    'blue': 'bg-blue-200/80 border-blue-300/80 text-blue-900',
    'green': 'bg-green-200/80 border-green-300/80 text-green-900',
  }[color];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn("sm:max-w-md transition-colors duration-300", noteColorClass)}>
        <DialogHeader>
          <DialogTitle>{note ? 'Edit Note' : 'Add Note'}</DialogTitle>
          <DialogDescription>
            Jot down your thoughts. They will be saved to your profile.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Your note..."
            className="min-h-[150px] bg-white/50 focus:bg-white"
            autoFocus
          />
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">Color:</p>
            {colorOptions.map(c => (
              <button
                key={c.name}
                onClick={() => setColor(c.name)}
                className={cn(
                  "h-8 w-8 rounded-full border-2 transition-transform hover:scale-110",
                  c.className,
                  color === c.name ? 'border-foreground' : 'border-transparent'
                )}
              />
            ))}
          </div>
        </div>
        <DialogFooter className="sm:justify-between">
          <div>
            {note && (
                 <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="icon">
                            <Trash className="h-4 w-4" />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your note.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
          </div>
          <div className='flex gap-2'>
            <Button type="button" variant="secondary" onClick={onClose}>
                Cancel
            </Button>
            <Button type="button" onClick={handleSave} disabled={!content.trim()}>
                Save Note
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
