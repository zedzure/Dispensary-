
'use client';

import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Product } from '@/types/product';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  onProductClick: (product: Product) => void;
  className?: string;
}

export function ProductCard({ product, onProductClick, className }: ProductCardProps) {
  return (
    <Card 
      className={cn(
        "h-full flex flex-col overflow-hidden group transition-all duration-300 ease-in-out",
        "bg-white/20 backdrop-blur-xl border border-white/30 shadow-lg rounded-[24px]", // liquid glass with large radius
        "hover:transform hover:-translate-y-1 hover:shadow-2xl",
        className
      )}
    >
      <CardHeader className="p-0">
        <button onClick={() => onProductClick(product)} className="w-full aspect-square md:aspect-square relative overflow-hidden rounded-t-[24px]">
            <Image
              src={product.image}
              data-ai-hint={product.hint}
              alt={product.name}
              fill
              style={{ objectFit: 'cover' }}
              className="group-hover:scale-105 transition-transform"
            />
        </button>
      </CardHeader>
      <CardContent className="p-3 flex-grow">
        <CardTitle className="text-sm md:text-base font-semibold line-clamp-2">{product.name}</CardTitle>
        <p className="text-[11px] md:text-xs text-muted-foreground mt-1">{product.type} | {product.thc}% THC</p>
      </CardContent>
      <CardFooter className="p-3 pt-0 flex items-center justify-end">
        <Button size="sm" onClick={() => onProductClick(product)}>View</Button>
      </CardFooter>
    </Card>
  );
}
