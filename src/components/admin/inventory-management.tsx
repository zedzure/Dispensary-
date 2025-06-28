
"use client";

import React, { useState, useEffect } from 'react';
import { Package, PlusCircle, Trash2, PackageSearch, Tag, Layers3, MoreVertical, Printer, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { InventoryItem } from '@/types/pos';
import { generateMockInventory, saveInventory } from '@/lib/mockInventory';
import { categories } from '@/lib/products';
import Link from 'next/link';
import { InventoryItemDetailModal } from './inventory-item-detail-modal';

const getStockStatus = (stock: number, threshold: number): { text: string; variant: "default" | "secondary" | "destructive" | "outline" } => {
  if (stock <= 0) return { text: 'Out of Stock', variant: 'destructive' };
  if (stock < threshold) return { text: 'Low Stock', variant: 'secondary' };
  return { text: 'In Stock', variant: 'default' };
};

const initialProductFormState: Omit<InventoryItem, 'id' | 'lastRestockDate'> = {
  name: '', sku: '', category: '', supplier: '', stock: 0,
  lowStockThreshold: 20, purchasePrice: 0, salePrice: 0, rating: 0,
  tags: '', notes: '', image: 'https://placehold.co/400x400.png', 
  hint: 'product image', description: ''
};

export function InventoryManagement() {
  const { toast } = useToast();
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [stockStatusFilter, setStockStatusFilter] = useState<string>('all');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<InventoryItem | null>(null);

  useEffect(() => {
    setInventoryItems(generateMockInventory());
  }, []);

  const filteredInventory = inventoryItems
    .filter(item =>
      (item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       item.sku.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (categoryFilter === 'all' || item.category === categoryFilter) &&
      (stockStatusFilter === 'all' || getStockStatus(item.stock, item.lowStockThreshold).text.replace(' ', '').toLowerCase() === stockStatusFilter)
    )
    .sort((a,b) => (a.name > b.name ? 1 : -1));

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredInventory.length / itemsPerPage);
  const paginatedInventory = filteredInventory.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleOpenModal = (item?: InventoryItem | null) => {
    if (item) {
      setEditingItem(item);
    } else {
      const newItemTemplate: InventoryItem = {
        ...initialProductFormState,
        id: `NEW-${Date.now()}`,
        lastRestockDate: new Date().toISOString()
      };
      setEditingItem(newItemTemplate);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };
  
  const handleSaveItem = (itemToSave: InventoryItem) => {
    const isNew = itemToSave.id.startsWith('NEW-');
    let updatedInventory;

    if (isNew) {
      updatedInventory = [{ ...itemToSave, id: `PROD-${Date.now()}`}, ...inventoryItems];
      toast({ title: "Product Added", description: `${itemToSave.name} has been added to inventory.` });
    } else {
      updatedInventory = inventoryItems.map(item => item.id === itemToSave.id ? itemToSave : item);
      toast({ title: "Product Updated", description: `${itemToSave.name} has been successfully updated.` });
    }
    setInventoryItems(updatedInventory);
    saveInventory(updatedInventory);
    handleCloseModal();
  };

  const openDeleteConfirm = (item: InventoryItem) => {
    setItemToDelete(item);
    setDeleteConfirmOpen(true);
  };

  const closeDeleteConfirm = () => {
    setItemToDelete(null);
    setDeleteConfirmOpen(false);
  };

  const handleDeleteItem = () => {
    if (!itemToDelete) return;
    const updatedInventory = inventoryItems.filter(p => p.id !== itemToDelete.id);
    setInventoryItems(updatedInventory);
    saveInventory(updatedInventory);
    toast({ title: "Product Deleted", description: `Product ${itemToDelete.name} has been removed.`, variant: "destructive" });
    closeDeleteConfirm();
  };

  return (
    <>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold font-cursive text-primary flex items-center">
            <Package className="mr-3 h-8 w-8" />
            Product CMS
          </h1>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href="/admin/products/print" target="_blank" rel="noopener noreferrer">
                  <Printer className="mr-2 h-5 w-5" /> Print List
              </Link>
            </Button>
            <Button onClick={() => handleOpenModal()}>
              <PlusCircle className="mr-2 h-5 w-5" /> Add New Product
            </Button>
          </div>
        </div>

        <Dialog open={isDeleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogDescription>Are you sure you want to delete "{itemToDelete?.name}"? This action cannot be undone.</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={closeDeleteConfirm}>Cancel</Button>
                    <Button variant="destructive" onClick={handleDeleteItem}>Delete</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>


        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center"><PackageSearch className="mr-2 h-5 w-5 text-primary"/>Product Inventory ({filteredInventory.length})</CardTitle>
            <CardDescription>View, add, and manage all product details and stock levels.</CardDescription>
            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <Input 
                placeholder="Search by Product Name or SKU..." 
                className="flex-grow"
                value={searchTerm}
                onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              />
              <div className="flex gap-3 w-full sm:w-auto">
                <Select value={categoryFilter} onValueChange={value => { setCategoryFilter(value); setCurrentPage(1); }}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(cat => <SelectItem key={cat.name} value={cat.name}>{cat.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={stockStatusFilter} onValueChange={value => { setStockStatusFilter(value); setCurrentPage(1); }}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by Stock Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="instock">In Stock</SelectItem>
                    <SelectItem value="lowstock">Low Stock</SelectItem>
                    <SelectItem value="outofstock">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px]">SKU</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead><Layers3 className="inline-block mr-1 h-4 w-4" />Category</TableHead>
                    <TableHead className="text-center">Stock</TableHead>
                    <TableHead className="text-right"><Tag className="inline-block mr-1 h-4 w-4" />Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedInventory.map((item) => {
                    const stockInfo = getStockStatus(item.stock, item.lowStockThreshold);
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="font-mono text-xs">{item.sku}</TableCell>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell className="text-center">{item.stock}</TableCell>
                        <TableCell className="text-right">${item.salePrice.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge variant={stockInfo.variant}>{stockInfo.text}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenModal(item)}>
                            <Eye className="h-4 w-4" /> <span className="sr-only">View/Edit</span>
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => openDeleteConfirm(item)}>
                            <Trash2 className="h-4 w-4" /> <span className="sr-only">Delete</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            
            <div className="space-y-4 md:hidden">
              {paginatedInventory.map((item) => {
                const stockInfo = getStockStatus(item.stock, item.lowStockThreshold);
                 return (
                  <Card key={item.id} className="border-border/60">
                    <CardHeader className="flex flex-row items-start justify-between p-4">
                      <div>
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.category} / {item.sku}</p>
                      </div>
                      <MoreVertical className="h-4 w-4 cursor-pointer" onClick={() => handleOpenModal(item)}/>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="flex justify-between items-center text-sm border-t pt-4">
                          <div className="text-muted-foreground">
                            <p>Price</p>
                            <p className="font-bold text-foreground">${item.salePrice.toFixed(2)}</p>
                          </div>
                          <div className="text-muted-foreground text-center">
                            <p>Stock</p>
                            <p className="font-bold text-foreground">{item.stock}</p>
                          </div>
                          <div className="text-muted-foreground text-right">
                            <p>Status</p>
                            <Badge variant={stockInfo.variant} className="mt-1">{stockInfo.text}</Badge>
                          </div>
                      </div>
                    </CardContent>
                  </Card>
                 )
              })}
            </div>
             {paginatedInventory.length === 0 && (
                <div className="h-24 text-center flex items-center justify-center text-muted-foreground">
                  No products found matching your criteria.
                </div>
              )}
          </CardContent>
          {totalPages > 1 && (
            <div className="p-4 border-t flex items-center justify-between">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </Card>
      </div>
       <InventoryItemDetailModal
        item={editingItem}
        isOpen={isModalOpen}
        onSave={handleSaveItem}
        onClose={handleCloseModal}
      />
    </>
  );
}
