
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import type { Product } from '@/types/product';
import type { InventoryItem, ReelConfigItem } from '@/types/pos';
import { generateMockInventory } from '@/lib/mockInventory';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const REEL_CONFIG_STORAGE_KEY = 'silzeyPosReelConfigV2';

interface ProductStoryReelProps {
  onProductClick: (product: Product) => void;
}

interface ReelItem extends InventoryItem {
    badgeType: string;
    pulsatingBorder: boolean;
}

const ReelRow = ({ items, onProductClick, borderColorClass }: { items: ReelItem[], onProductClick: (product: Product) => void, borderColorClass: string }) => {
    if (items.length === 0) return null;

    return (
        <div className="overflow-x-auto no-scrollbar">
            <ul className="flex items-start gap-4 px-4 md:px-6 pb-4">
                {items.map((item, index) => (
                    <li key={`${item.id}-${index}`} className="flex-shrink-0">
                         <button 
                            onClick={(e) => { e.preventDefault(); onProductClick(item); }} 
                            className="flex flex-col items-center space-y-2 w-28 group text-center focus:outline-none"
                         >
                           <div className={cn(
                                "relative w-[98px] h-[98px] transition-all duration-300 rounded-full p-1",
                                borderColorClass,
                                item.pulsatingBorder && "animate-pulse"
                            )}>
                                <div className="absolute inset-0.5 bg-card rounded-full p-1">
                                    <div className="relative h-full w-full rounded-full overflow-hidden">
                                        <Image
                                            src={item.image}
                                            data-ai-hint={item.hint}
                                            alt={item.name}
                                            fill
                                            style={{objectFit: 'cover'}}
                                        />
                                    </div>
                                </div>
                            </div>
                            {item.badgeType && item.badgeType !== "None" && (
                                <div className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-md">
                                    {item.badgeType}
                                </div>
                            )}
                            <p className="text-xs font-medium text-foreground truncate w-full text-center">{item.name}</p>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export function ProductStoryReel({ onProductClick }: ProductStoryReelProps) {
    const [reelItems, setReelItems] = useState<ReelItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const allInventory = generateMockInventory();
        const storedConfigRaw = localStorage.getItem(REEL_CONFIG_STORAGE_KEY);
        
        let finalReelItems: ReelItem[] = [];

        if (storedConfigRaw) {
            try {
                const reelConfig: ReelConfigItem[] = JSON.parse(storedConfigRaw);
                const inventoryMap = new Map(allInventory.map(item => [item.id, item]));

                finalReelItems = reelConfig
                    .map(config => {
                        const product = inventoryMap.get(config.inventoryItemId);
                        if (product) {
                            return { ...product, ...config };
                        }
                        return null;
                    })
                    .filter((item): item is ReelItem => item !== null && item.active);

            } catch (e) {
                console.error("Failed to parse reel config, using default:", e);
            }
        }
        
        if (finalReelItems.length === 0) {
            const defaultItems = allInventory
                .filter(item => item.category === "Flower" && item.active)
                .slice(0, 20)
                .map(item => ({ ...item, badgeType: 'New', pulsatingBorder: false }));
            finalReelItems = defaultItems;
        }

        setReelItems(finalReelItems);
        setIsLoading(false);
    }, []);
    
    if (isLoading || (reelItems.length === 0)) {
        return null;
    }

    return (
        <section className="py-8 md:py-12 bg-background space-y-4">
           <ReelRow 
             items={reelItems} 
             onProductClick={onProductClick} 
             borderColorClass="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500"
           />
        </section>
    );
}
