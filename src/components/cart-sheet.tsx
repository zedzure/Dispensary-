
"use client";

import { useState } from "react";
import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { CheckoutDialog } from "@/components/checkout-dialog";
import CartItem from "./cart-item";

export function CartSheet() {
  const { items, removeFromCart, updateQuantity, clearCart, totalPrice, totalItems, isCartOpen, setCartOpen } = useCart();
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
                <div className="flex flex-col gap-0 p-6">
                  {items.map((item) => (
                    <CartItem 
                      key={item.id}
                      item={item}
                      onUpdateQuantity={updateQuantity}
                      onRemoveItem={removeFromCart}
                    />
                  ))}
                </div>
              </ScrollArea>
              <SheetFooter className="p-6 pt-4 bg-background border-t">
                <div className="w-full space-y-4">
                  <div className="flex justify-between font-semibold">
                    <span>Subtotal</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <Button
                    className="w-full text-foreground"
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
              <Button className="mt-4 text-foreground" onClick={() => setCartOpen(false)}>
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
