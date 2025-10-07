
'use client';

import Link from 'next/link';
import { Leaf } from 'lucide-react';
import { states } from '@/lib/states';
import { cn } from '@/lib/utils';

export function StateStoryReel() {
    if (states.length === 0) return null;

    return (
        <section className="py-8 md:py-12 space-y-4">
           <div className="overflow-x-auto no-scrollbar">
                <ul className="flex items-start gap-4 px-4 md:px-6 pb-4">
                    {states.map((state) => (
                        <li key={state.abbreviation} className="flex-shrink-0">
                            <Link 
                                href={`/state/${encodeURIComponent(state.name)}`} 
                                className="flex flex-col items-center space-y-2 w-28 group text-center focus:outline-none"
                            >
                               <div className={cn(
                                    "relative w-[98px] h-[98px] transition-all duration-300 rounded-full p-1",
                                    "bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500"
                                )}>
                                    <div className="absolute inset-0.5 bg-card rounded-full p-1 flex items-center justify-center">
                                        <Leaf className="h-12 w-12 text-primary" />
                                    </div>
                                </div>
                                <p className="text-xs font-medium text-foreground truncate w-full text-center">{state.name}</p>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
