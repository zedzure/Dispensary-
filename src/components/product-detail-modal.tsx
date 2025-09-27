
"use client";

import Image from "next/image";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/types/product";
import { Button } from "./ui/button";
import { useCart } from "@/context/cart-context";
import { useToast } from "@/hooks/use-toast";
import { Check } from "lucide-react";
import Link from "next/link";

interface ProductDetailModalProps {
  product: Product | undefined;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function ProductDetailModal({ product, isOpen, onOpenChange }: ProductDetailModalProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();

  if (!product) {
    return null;
  }

  const handleAddToCart = () => {
    addToCart(product);
    toast({
      title: "Added to cart!",
      description: (
        <div className="flex items-start gap-4 mt-2">
          <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md">
            <Image
              src={product.image}
              alt={product.name}
              data-ai-hint={product.hint}
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-foreground">{product.name}</p>
            {product.price && (
              <p className="text-sm font-bold text-primary">
                ${product.price.toFixed(2)}
              </p>
            )}
          </div>
        </div>
      ),
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl p-0">
        <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="relative h-64 md:h-full min-h-[300px]">
                <Image
                    src={product.image}
                    data-ai-hint={product.hint}
                    alt={product.name}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="rounded-t-lg md:rounded-l-lg md:rounded-t-none"
                />
            </div>
            <div className="p-6 flex flex-col">
                <DialogHeader>
                    <DialogTitle className="text-3xl font-bold mb-2">{product.name}</DialogTitle>
                    <DialogDescription className="sr-only">Details for {product.name}</DialogDescription>
                </DialogHeader>
                <div className="flex items-center gap-2 flex-wrap mb-4">
                    <Badge variant="outline">{product.category}</Badge>
                    {product.type && <Badge variant="outline">{product.type}</Badge>}
                    {product.thc && <Badge variant="outline">{product.thc}% THC</Badge>}
                </div>
                <p className="text-base text-muted-foreground mb-4">{product.description}</p>
                
                <div className="mt-auto flex flex-wrap items-center justify-between gap-4 border-t pt-4">
                    {product.price && (
                        <p className="text-2xl font-bold text-primary">
                            ${product.price.toFixed(2)}
                        </p>
                    )}
                    <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                        <Button variant="outline" onClick={() => onOpenChange(false)}>
                            Keep Browsing
                        </Button>
                        <Button onClick={handleAddToCart}>
                            Add to Cart
                        </Button>
                    </div>
                </div>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
