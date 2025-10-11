
'use client';

import type { PostIt } from '@/types/post-it';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface PostItCardProps {
  note: PostIt;
  onClick: () => void;
}

const colorClasses = {
  yellow: 'bg-yellow-200/80 border-yellow-300/80 text-yellow-900',
  pink: 'bg-pink-200/80 border-pink-300/80 text-pink-900',
  blue: 'bg-blue-200/80 border-blue-300/80 text-blue-900',
  green: 'bg-green-200/80 border-green-300/80 text-green-900',
};

export function PostItCard({ note, onClick }: PostItCardProps) {
  const noteColor = note.color || 'yellow';
  const date = note.createdAt?.toDate ? format(note.createdAt.toDate(), 'MMM d, yyyy') : '...';

  return (
    <button
      onClick={onClick}
      className={cn(
        'p-4 rounded-lg shadow-md flex flex-col h-48 border transition-transform hover:scale-105 hover:shadow-xl text-left w-full',
        colorClasses[noteColor]
      )}
    >
      <div className="flex-grow overflow-auto">
        <p className="text-sm whitespace-pre-wrap">{note.content}</p>
      </div>
      <div className="text-right text-xs opacity-70 mt-2 pt-2 border-t border-current/20">
        {date}
      </div>
    </button>
  );
}
