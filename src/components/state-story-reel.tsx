
'use client';

import Link from 'next/link';
import { Leaf } from 'lucide-react';
import { states } from '@/lib/states';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export function StateStoryReel() {
    if (states.length === 0) return null;

    return (
        <section className="py-8 md:py-12 space-y-4 bg-transparent">
           <div className="overflow-x-auto no-scrollbar">
                <ul className="flex items-start gap-4 px-4 md:px-6 pb-4 pt-2">
                    {states.map((state, i) => (
                        <motion.li 
                            key={state.abbreviation} 
                            className="flex-shrink-0"
                            animate={{
                                y: [0, -5, 0],
                                scale: [1, 1.02, 1],
                            }}
                            transition={{
                                duration: 3 + i * 0.2,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        >
                            <Link 
                                href={`/state/${encodeURIComponent(state.name)}`} 
                                className="flex flex-col items-center space-y-2 w-28 group text-center focus:outline-none"
                            >
                               <div className="relative w-[98px] h-[98px] rounded-full liquid-glass">
                                    <div className="absolute inset-0 rounded-full p-1 flex items-center justify-center">
                                        <Leaf className="h-12 w-12 text-primary" />
                                    </div>
                                </div>
                                <p className="text-xs font-medium text-foreground truncate w-full text-center">{state.name}</p>
                            </Link>
                        </motion.li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
