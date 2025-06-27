
'use client';

import type { Order } from '@/types/pos';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

interface OrderReceiptModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

const TAX_RATE = 0.0825; // Example tax rate

export function OrderReceiptModal({ order, isOpen, onClose }: OrderReceiptModalProps) {
  if (!order) return null;

  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const taxes = subtotal * TAX_RATE;
  const total = subtotal + taxes;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex flex-col">
            <span>Order Receipt</span>
            <span className="text-sm font-normal text-muted-foreground">{order.id}</span>
          </DialogTitle>
          <DialogDescription>
            For {order.customerName} on {new Date(order.orderDate).toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>
        
        <Separator />
        
        <ScrollArea className="max-h-[300px] pr-4 -mr-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead className="text-center">Qty</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items.map(item => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                        <Image src={item.image} alt={item.name} width={40} height={40} className="rounded-md" data-ai-hint={item.hint} />
                        <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-xs text-muted-foreground">${item.price.toFixed(2)} ea.</p>
                        </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">{item.quantity}</TableCell>
                  <TableCell className="text-right font-medium">${(item.price * item.quantity).toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
        
        <Separator />
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
           <div className="flex justify-between">
            <span className="text-muted-foreground">Taxes ({(TAX_RATE * 100).toFixed(2)}%)</span>
            <span>${taxes.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-base border-t pt-2 mt-2">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <DialogFooter className="sm:justify-between flex-col-reverse sm:flex-row gap-2">
            <div className='flex items-center gap-2'>
                <span className="text-sm text-muted-foreground">Status:</span>
                <Badge variant={order.status === "Pending Checkout" ? "destructive" : "default"} className="capitalize">{order.status}</Badge>
            </div>
            <Button type="button" variant="outline" onClick={onClose}>
                Close
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
