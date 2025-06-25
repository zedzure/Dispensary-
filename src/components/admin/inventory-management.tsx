
"use client";

import React, { useState } from 'react';
import { Package, PlusCircle, Edit3, Trash2, PackageSearch, Tag, Layers3, MoreVertical } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/hooks/use-toast";
import type { Product } from '@/types/product';
import { allProductsFlat, categories } from '@/lib/products';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const getStockStatus = (stock: number): { text: string; variant: "default" | "secondary" | "destructive" | "outline" } => {
  if (stock <= 0) return { text: 'Out of Stock', variant: 'destructive' };
  if (stock < 20) return { text: 'Low Stock', variant: 'secondary' }; // secondary for warning
  return { text: 'In Stock', variant: 'default' };
};

const initialProductFormState: Partial<Product> = {
  name: '',
  description: '',
  price: 0,
  category: '',
  stock: 0,
  image: 'https://placehold.co/600x400.png',
  hint: 'product image'
};

export function InventoryManagement() {
  const { toast } = useToast();
  const [inventoryItems, setInventoryItems] = useState<Product[]>(allProductsFlat);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [stockStatusFilter, setStockStatusFilter] = useState<string>('all');
  
  // State for the product form (add/edit)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [productFormData, setProductFormData] = useState<Partial<Product>>(initialProductFormState);

  // State for the delete confirmation dialog
  const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);


  const filteredInventory = inventoryItems
    .filter(item =>
      (item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       (item.id && item.id.toLowerCase().includes(searchTerm.toLowerCase()))) &&
      (categoryFilter === 'all' || item.category === categoryFilter) &&
      (stockStatusFilter === 'all' || getStockStatus(item.stock ?? 0).text.replace(' ', '').toLowerCase() === stockStatusFilter)
    )
    .sort((a,b) => (a.name > b.name ? 1 : -1));

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredInventory.length / itemsPerPage);
  const paginatedInventory = filteredInventory.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProductFormData(prev => ({ ...prev, [name]: name === 'price' || name === 'stock' ? parseFloat(value) || 0 : value }));
  };

  const handleCategoryChange = (categoryName: string) => {
    setProductFormData(prev => ({ 
      ...prev, 
      category: categoryName,
    }));
  };
  
  const handleOpenForm = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setProductFormData(product);
    } else {
      setEditingProduct(null);
      setProductFormData(initialProductFormState);
    }
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
    setProductFormData(initialProductFormState);
  };

  const handleSubmitProduct = () => {
    if (!productFormData.name || !productFormData.category || (productFormData.price ?? 0) <= 0) {
      toast({ title: "Validation Error", description: "Name, category, and a valid price are required.", variant: "destructive"});
      return;
    }
    if (editingProduct && editingProduct.id) {
      setInventoryItems(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...productFormData } as Product : p));
      toast({ title: "Product Updated", description: `${productFormData.name} has been updated.` });
    } else {
      const newProduct: Product = {
        ...initialProductFormState,
        ...productFormData,
        id: `NEWPROD-${Date.now()}`,
      } as Product;
      setInventoryItems(prev => [newProduct, ...prev]);
      toast({ title: "Product Added", description: `${newProduct.name} has been added.` });
    }
    handleCloseForm();
  };

  const openDeleteConfirm = (product: Product) => {
    setProductToDelete(product);
    setDeleteConfirmOpen(true);
  };

  const closeDeleteConfirm = () => {
    setProductToDelete(null);
    setDeleteConfirmOpen(false);
  };

  const handleDeleteProduct = () => {
    if (!productToDelete) return;
    setInventoryItems(prev => prev.filter(p => p.id !== productToDelete.id));
    toast({ title: "Product Deleted", description: `Product ID ${productToDelete.id} has been removed.`, variant: "destructive" });
    closeDeleteConfirm();
  };

  return (
    <>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold font-cursive text-primary flex items-center">
            <Package className="mr-3 h-8 w-8" />
            Inventory Management
          </h1>
          <Button onClick={() => handleOpenForm()}>
            <PlusCircle className="mr-2 h-5 w-5" /> Add New Product
          </Button>
        </div>

        {/* Product Form Dialog */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
              <DialogDescription>
                {editingProduct ? 'Update details for this product.' : 'Fill in the details for the new product.'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right col-span-1">Name</Label>
                <Input id="name" name="name" value={productFormData.name} onChange={handleInputChange} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right col-span-1">Description</Label>
                <Textarea id="description" name="description" value={productFormData.description} onChange={handleInputChange} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right col-span-1">Category</Label>
                <Select value={productFormData.category} onValueChange={handleCategoryChange}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => <SelectItem key={cat.name} value={cat.name}>{cat.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right col-span-1">Price ($)</Label>
                <Input id="price" name="price" type="number" value={productFormData.price} onChange={handleInputChange} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="stock" className="text-right col-span-1">Stock</Label>
                <Input id="stock" name="stock" type="number" value={productFormData.stock} onChange={handleInputChange} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="image" className="text-right col-span-1">Image URL</Label>
                <Input id="image" name="image" value={productFormData.image} onChange={handleInputChange} className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleCloseForm}>Cancel</Button>
              <Button onClick={handleSubmitProduct}>
                {editingProduct ? 'Save Changes' : 'Add Product'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogDescription>Are you sure you want to delete "{productToDelete?.name}"? This action cannot be undone.</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={closeDeleteConfirm}>Cancel</Button>
                    <Button variant="destructive" onClick={handleDeleteProduct}>Delete</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>


        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center"><PackageSearch className="mr-2 h-5 w-5 text-primary"/>Product Inventory ({filteredInventory.length})</CardTitle>
            <CardDescription>Track and manage product stock levels and details.</CardDescription>
            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <Input 
                placeholder="Search by Product Name or ID..." 
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
                    <SelectItem value="all">All Stock Statuses</SelectItem>
                    <SelectItem value="instock">In Stock</SelectItem>
                    <SelectItem value="lowstock">Low Stock</SelectItem>
                    <SelectItem value="outofstock">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Desktop View */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="hidden lg:table-cell w-[120px]">Product ID</TableHead>
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
                    const stockInfo = getStockStatus(item.stock ?? 0);
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="hidden lg:table-cell font-medium text-xs">{item.id}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell className="text-center">{item.stock ?? 0}</TableCell>
                        <TableCell className="text-right">${(item.price ?? 0).toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge variant={stockInfo.variant}>{stockInfo.text}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenForm(item)}>
                            <Edit3 className="h-4 w-4" /> <span className="sr-only">Edit</span>
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
            {/* Mobile View */}
            <div className="space-y-4 md:hidden">
              {paginatedInventory.map((item) => {
                const stockInfo = getStockStatus(item.stock ?? 0);
                 return (
                  <Card key={item.id} className="border-border/60">
                    <CardHeader className="flex flex-row items-start justify-between p-4">
                      <div>
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.category}</p>
                      </div>
                      <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 -mt-2"><MoreVertical className="h-4 w-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleOpenForm(item)}>
                              <Edit3 className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openDeleteConfirm(item)} className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="flex justify-between items-center text-sm border-t pt-4">
                          <div className="text-muted-foreground">
                            <p>Price</p>
                            <p className="font-bold text-foreground">${(item.price ?? 0).toFixed(2)}</p>
                          </div>
                          <div className="text-muted-foreground text-center">
                            <p>Stock</p>
                            <p className="font-bold text-foreground">{item.stock ?? 0}</p>
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
    </>
  );
}
