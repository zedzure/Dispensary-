
"use client";

import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/types/product";
import { Button } from "./ui/button";

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function ProductDetailModal({ product, isOpen, onOpenChange }: ProductDetailModalProps) {
  if (!product) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl p-0">
        <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="relative h-64 md:h-full min-h-[300px]">
                <Image
                    src={product.image}
                    data-ai-hint={product.hint}
                    alt={product.name}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-lg md:rounded-l-lg md:rounded-t-none"
                />
            </div>
            <div className="p-6 flex flex-col">
                <DialogHeader>
                    <DialogTitle className="text-3xl font-bold mb-2">{product.name}</DialogTitle>
                </DialogHeader>
                <div className="flex items-center gap-2 flex-wrap mb-4">
                    <Badge variant="outline">{product.category}</Badge>
                    {product.type && <Badge variant="outline">{product.type}</Badge>}
                    {product.thc && <Badge variant="outline">{product.thc}% THC</Badge>}
                </div>
                <p className="text-base text-muted-foreground flex-grow mb-4">{product.description}</p>
                <div className="flex items-center justify-between pt-4 border-t">
                    {product.price ? <p className="text-2xl font-bold text-primary">${product.price.toFixed(2)}</p> : <div />}
                    <Button size="lg">Add to Cart</Button>
                </div>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
