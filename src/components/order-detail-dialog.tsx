
'use client';

import type { BudtenderOrder } from "@/app/budtender/page";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';

const TAX_RATE = 0.0825; // 8.25%

interface OrderDetailDialogProps {
  order: BudtenderOrder | null;
  onOpenChange: (open: boolean) => void;
}

export function OrderDetailDialog({ order, onOpenChange }: OrderDetailDialogProps) {
  if (!order) {
    return null;
  }

  const subtotal = order.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * TAX_RATE;
  const calculatedTotal = subtotal + tax;

  return (
    <Dialog open={!!order} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Order Details: {order.id}</DialogTitle>
          <DialogDescription>
            For customer: {order.customer}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <h4 className="mb-4 text-sm font-medium">Order Items</h4>
          <div className="max-h-[250px] overflow-y-auto pr-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-center">Qty</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md">
                          <Image
                            src={item.image}
                            alt={item.name}
                            data-ai-hint={item.hint}
                            fill
                            style={{ objectFit: 'cover' }}
                          />
                        </div>
                        <span>{item.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">{item.quantity}</TableCell>
                    <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${(item.price * item.quantity).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Separator className="my-4" />
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax ({(TAX_RATE * 100).toFixed(2)}%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
              <span>Total</span>
              <span>${calculatedTotal.toFixed(2)}</span>
            </div>
             <div className="flex justify-between text-xs text-muted-foreground pt-2">
                <span>Original Total (for reference)</span>
                <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
