
"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { InventoryItem } from '@/types/pos';
import { allProductsFlat } from '@/lib/products';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface InventoryItemDetailModalProps {
  item: InventoryItem | null;
  isOpen: boolean;
  onSave: (item: InventoryItem) => void;
  onClose: () => void;
}

export function InventoryItemDetailModal({ item, isOpen, onSave, onClose }: InventoryItemDetailModalProps) {
  const [editedItem, setEditedItem] = useState<InventoryItem | null>(item);

  useEffect(() => {
    setEditedItem(item);
  }, [item]);

  if (!isOpen || !editedItem) {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedItem(prev => prev ? { ...prev, [name]: name === 'salePrice' || name === 'stock' ? parseFloat(value) || 0 : value } : null);
  };
  
  const handleCategoryChange = (categoryName: string) => {
    setEditedItem(prev => (prev ? { ...prev, category: categoryName } : null));
  };


  const handleSave = () => {
    if (editedItem) {
      onSave(editedItem);
    }
  };

  const categories = Array.from(new Set(allProductsFlat.map(p => p.category)));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Inventory Item</DialogTitle>
          <DialogDescription>
            Make changes to "{editedItem.name}". Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Name</Label>
            <Input id="name" name="name" value={editedItem.name} onChange={handleChange} className="col-span-3" />
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">Description</Label>
            <Textarea id="description" name="description" value={editedItem.description} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">Category</Label>
             <Select value={editedItem.category} onValueChange={handleCategoryChange}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                  </SelectContent>
                </Select>
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="salePrice" className="text-right">Price</Label>
            <Input id="salePrice" name="salePrice" type="number" value={editedItem.salePrice} onChange={handleChange} className="col-span-3" />
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="stock" className="text-right">Stock</Label>
            <Input id="stock" name="stock" type="number" value={editedItem.stock} onChange={handleChange} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="button" onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
