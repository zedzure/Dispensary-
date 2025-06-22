'use client';

import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
  onProductClick: (product: Product) => void;
  className?: string;
}

export function ProductCard({ product, onProductClick, className }: ProductCardProps) {
  return (
    <Card className={`h-full flex flex-col overflow-hidden group bg-white border-border/60 shadow-lg ${className}`}>
      <CardHeader className="p-0">
        <button onClick={() => onProductClick(product)} className="w-full aspect-[3/2] relative">
            <Image
              src={product.image}
              data-ai-hint={product.hint}
              alt={product.name}
              layout="fill"
              objectFit="cover"
              className=""
            />
        </button>
      </CardHeader>
      <CardContent className="p-6 flex-grow">
        <CardTitle className="text-xl font-semibold">{product.name}</CardTitle>
        <p className="text-sm text-muted-foreground mt-2">{product.type} | {product.thc}% THC</p>
      </CardContent>
      <CardFooter className="p-6 pt-0 flex items-center justify-between">
        <p className="text-xl font-bold text-primary">${product.price?.toFixed(2)}</p>
        <Button variant="default" onClick={() => onProductClick(product)}>View</Button>
      </CardFooter>
    </Card>
  );
}
