
"use client";

import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/types/product";
import { Button } from "./ui/button";
import { useCart } from "@/context/cart-context";
import { useToast } from "@/hooks/use-toast";
import { Check } from "lucide-react";

interface ProductDetailModalProps {
  product: Product | null;
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
      title: (
        <div className="flex items-center">
          <Check className="h-5 w-5 text-green-500 mr-2" />
          <span>Added to cart!</span>
        </div>
      ),
      description: `${product.name} is now in your cart.`,
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
                <p className="text-base text-muted-foreground mb-4">{product.description}</p>
                
                <div className="mt-auto flex flex-wrap items-center justify-between gap-4 border-t pt-4">
                    {product.price ? (
                        <p className="text-2xl font-bold text-primary">${product.price.toFixed(2)}</p>
                    ) : (
                        <div />
                    )}
                    <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                        <Button variant="outline" onClick={() => onOpenChange(false)}>
                            Continue Shopping
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
