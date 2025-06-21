
"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { CheckoutDialog } from "@/components/checkout-dialog";
import { X, Gift } from "lucide-react";

export function CartSheet() {
  const { items, removeFromCart, clearCart, totalPrice, totalItems, isCartOpen, setCartOpen } = useCart();
  const [isCheckoutOpen, setCheckoutOpen] = useState(false);

  const handleCheckout = () => {
    clearCart();
    setCheckoutOpen(true);
  };

  const onCheckoutDialogClose = () => {
    setCheckoutOpen(false);
  }

  return (
    <>
      <Sheet open={isCartOpen} onOpenChange={setCartOpen}>
        <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
          <SheetHeader className="px-6">
            <SheetTitle>My Cart ({totalItems})</SheetTitle>
          </SheetHeader>
          <Separator />
          {items.length > 0 ? (
            <>
              <ScrollArea className="flex-1">
                <div className="flex flex-col gap-6 p-6">
                  {items.map((item) => {
                    const points = Math.floor((item.price ?? 0) * item.quantity);
                    return (
                      <div key={item.id} className="flex items-start gap-4">
                        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
                          <Image
                            src={item.image}
                            alt={item.name}
                            data-ai-hint={item.hint}
                            layout="fill"
                            objectFit="cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Qty: {item.quantity}
                          </p>
                          <p className="text-sm font-medium">
                            ${(item.price ?? 0).toFixed(2)}
                          </p>
                          <div className="flex items-center text-xs text-primary mt-1">
                            <Gift className="mr-1 h-3 w-3" />
                            <span>
                              {points} points earned
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Remove item</span>
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
              <SheetFooter className="p-6 pt-4 bg-background border-t">
                <div className="w-full space-y-4">
                  <div className="flex justify-between font-semibold">
                    <span>Subtotal</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleCheckout}
                  >
                    Checkout
                  </Button>
                </div>
              </SheetFooter>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center p-6">
              <h3 className="text-lg font-semibold">Your cart is empty</h3>
              <p className="text-sm text-muted-foreground">
                Add some products to get started!
              </p>
              <Button className="mt-4" onClick={() => setCartOpen(false)}>
                Continue Shopping
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
      <CheckoutDialog isOpen={isCheckoutOpen} onOpenChange={onCheckoutDialogClose} />
    </>
  );
}
