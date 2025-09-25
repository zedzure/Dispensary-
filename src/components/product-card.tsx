
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
    <Card className={cn("h-full flex flex-col overflow-hidden group bg-white border-border/60 shadow-lg", className)}>
      <CardHeader className="p-0">
        <button onClick={() => onProductClick(product)} className="w-full aspect-square md:aspect-square relative">
            <Image
              src={product.image}
              data-ai-hint={product.hint}
              alt={product.name}
              fill
              style={{ objectFit: 'cover' }}
              className=""
            />
        </button>
      </CardHeader>
      <CardContent className="p-3 flex-grow">
        <CardTitle className="text-sm md:text-base font-semibold line-clamp-2">{product.name}</CardTitle>
        <p className="text-[11px] md:text-xs text-muted-foreground mt-1">{product.type} | {product.thc}% THC</p>
      </CardContent>
      <CardFooter className="p-3 pt-0 flex items-center justify-end">
        <Button variant="default" size="sm" onClick={() => onProductClick(product)}>View</Button>
      </CardFooter>
    </Card>
  );
}
