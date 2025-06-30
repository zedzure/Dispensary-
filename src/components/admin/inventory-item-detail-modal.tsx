
"use client";

import type { FC, ChangeEvent, DragEvent } from 'react';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Package, Tag, Building, BarChartBig, DollarSign, CalendarDays, Info, AlertTriangle, Save, Edit, StarIcon, ImagePlus, Power, Loader2, Upload } from 'lucide-react';
import type { InventoryItem } from '@/types/pos';
import { useToast } from "@/hooks/use-toast";
import { Switch } from '../ui/switch';
import { uploadImage } from '@/lib/image-upload';

interface InventoryItemDetailModalProps {
  item: InventoryItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (editedItem: InventoryItem) => void;
}

const getStockBadgeInfo = (stock: number, threshold: number): { text: string; className: string } => {
  if (stock === 0) return { text: "Out of Stock", className: "bg-red-500/20 text-red-700 border-red-500/30" };
  if (stock <= threshold) return { text: "Low Stock", className: "bg-yellow-500/20 text-yellow-700 border-yellow-500/30" };
  return { text: "In Stock", className: "bg-green-500/20 text-green-700 border-green-500/30" };
};

const isValidImageUrl = (url?: string): boolean => {
  if (!url || typeof url !== 'string') return false;
  // Allow data URIs and Firebase Storage URLs
  if (url.startsWith('data:image/') || url.startsWith('https://firebasestorage.googleapis.com')) return true;
  if (url.startsWith('/')) return true; 

  if (url.startsWith('http://') || url.startsWith('https:')) {
    try {
      const parsedUrl = new URL(url);
      const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'];
      const pathname = parsedUrl.pathname.toLowerCase();
      if (parsedUrl.hostname.includes('placehold.co') || parsedUrl.hostname.includes('pexels.com')) return true;
      if (imageExtensions.some(ext => pathname.endsWith(ext))) {
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }
  return false;
};


export function InventoryItemDetailModal({ item, isOpen, onClose, onSave }: InventoryItemDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editableItem, setEditableItem] = useState<InventoryItem | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (item) {
      setEditableItem({ ...item });
      setIsEditing(item.id.startsWith('NEW-')); // Automatically enter edit mode for new items
    } else {
      setEditableItem(null);
    }
  }, [item]);

  if (!isOpen || !editableItem) return null;

  const stockBadge = getStockBadgeInfo(editableItem.stock, editableItem.lowStockThreshold);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'image') {
      setEditableItem(prev => prev ? { ...prev, image: value } : null);
      return; 
    }

    let processedValue: string | number = value;
    const numericFields = ['stock', 'lowStockThreshold', 'purchasePrice', 'salePrice', 'rating'];
    if (numericFields.includes(name)) {
      processedValue = value === '' ? '' : parseFloat(value); 
    }
    setEditableItem(prev => prev ? { ...prev, [name]: processedValue } : null);
  };
  
  const handleSwitchChange = (checked: boolean) => {
    setEditableItem(prev => prev ? { ...prev, active: checked } : null);
  };

  const handleSaveClick = () => {
    if (editableItem) {
      const fieldsToValidateAsNumbers: (keyof InventoryItem)[] = [
        'stock', 'lowStockThreshold', 'purchasePrice', 'salePrice', 'rating'
      ];
      
      for (const fieldName of fieldsToValidateAsNumbers) {
        const fieldValue = editableItem[fieldName];
        const numValue = parseFloat(String(fieldValue));
        if (isNaN(numValue) || numValue < 0) {
            const userFriendlyFieldName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1).replace(/([A-Z])/g, ' $1').toLowerCase();
            toast({ variant: 'destructive', title: "Validation Error", description: `${userFriendlyFieldName} must be a valid non-negative number.` });
            return;
        }
        (editableItem as any)[fieldName] = numValue;
      }
      
      if (editableItem.rating > 5) {
         toast({ variant: 'destructive', title: "Validation Error", description: "Rating cannot be more than 5." });
         return;
      }
      
      if(!editableItem.name.trim()) {
        toast({ variant: 'destructive', title: "Validation Error", description: "Product name is required." });
        return;
      }

      onSave(editableItem);
      setIsEditing(false);
    }
  };
  
  const handleCancelEdit = () => {
    if (item && !item.id.startsWith('NEW-')) {
       setEditableItem({...item});
       setIsEditing(false);
    } else {
        onClose(); // Close modal if it was a new item
    }
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!isUploading) setIsDraggingOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
  };

  const handleFileSelected = async (file: File | null | undefined) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({ variant: 'destructive', title: "Invalid File", description: 'Please select an image file (e.g., PNG, JPG, GIF).' });
      return;
    }
    
    setIsUploading(true);
    try {
      const imageUrl = await uploadImage(file);
      if (editableItem) {
        setEditableItem({ ...editableItem, image: imageUrl });
      }
      toast({ title: "Image Uploaded", description: "The new product image has been successfully uploaded." });
    } catch (error) {
       console.error("Image upload failed:", error);
       toast({ variant: 'destructive', title: "Upload Failed", description: 'There was an error uploading your image. Please try again.' });
    } finally {
        setIsUploading(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
    if (isUploading) return;
    const file = e.dataTransfer.files?.[0];
    handleFileSelected(file);
  };
  
  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (isUploading) return;
    const file = e.target.files?.[0];
    handleFileSelected(file);
    // Reset file input to allow re-uploading the same file
    if (e.target) {
      e.target.value = '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl p-0 overflow-hidden shadow-2xl">
        <DialogHeader className="p-6 border-b border-border flex flex-row justify-between items-center">
          <div>
            <DialogTitle className="text-2xl font-cursive text-primary flex items-center">
              <Package className="mr-3 h-6 w-6"/> {isEditing ? 'Edit: ' : ''}{editableItem.name || 'New Product'}
            </DialogTitle>
            <DialogDescription>
              SKU: {editableItem.sku || 'Will be generated'} (Category: {editableItem.category})
            </DialogDescription>
          </div>
          {!isEditing ? (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              <Edit className="mr-2 h-4 w-4" /> Edit
            </Button>
          ) : (
             <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                <X className="mr-2 h-4 w-4" /> Cancel
            </Button>
          )}
        </DialogHeader>

        <ScrollArea className="max-h-[calc(80vh-180px)]">
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            
            <div className="md:col-span-2 space-y-3">
              {isEditing && <Label className="mb-1 text-sm font-medium">Product Image</Label>}
              <div className="w-full flex justify-center">
                <div className="w-40 h-40 relative border-2 border-primary/30 rounded-lg overflow-hidden shadow-md bg-muted/10 p-1">
                  {isUploading && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 rounded-lg">
                      <Loader2 className="h-10 w-10 text-white animate-spin" />
                    </div>
                  )}
                  {isValidImageUrl(editableItem.image) ? (
                    <Image
                      src={editableItem.image}
                      alt={editableItem.name}
                      fill
                      style={{ objectFit: 'contain' }}
                      className="rounded-sm" 
                      data-ai-hint={editableItem.hint || editableItem.category.toLowerCase()}
                      key={editableItem.image} 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted rounded-sm">
                      <ImagePlus className="h-16 w-16 text-muted-foreground/70" />
                    </div>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="space-y-3 pt-2">
                  <div>
                    <Label htmlFor="itemImage" className="text-xs text-muted-foreground">Image URL</Label>
                    <Input id="itemImage" name="image" value={editableItem.image || ''} onChange={handleInputChange} placeholder="Enter URL, or upload below" className="h-9"/>
                  </div>
                   <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileInputChange}
                    className="hidden"
                    accept="image/*"
                    disabled={isUploading}
                  />
                  <Button type="button" variant="outline" className="w-full" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                    <Upload className="mr-2 h-4 w-4"/>
                    Upload from Computer
                  </Button>
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                    <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">Or</span></div>
                  </div>

                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`p-4 py-6 border-2 border-dashed rounded-md text-center cursor-pointer transition-colors
                                ${isDraggingOver ? 'border-primary bg-primary/10 ring-2 ring-primary ring-offset-2' : 'border-border hover:border-muted-foreground/70'}
                                ${isUploading ? 'pointer-events-none opacity-50' : ''}`}
                  >
                    <ImagePlus className={`mx-auto h-8 w-8 mb-1 ${isDraggingOver ? 'text-primary' : 'text-muted-foreground/70'}`} />
                    <p className="text-xs text-muted-foreground">
                      {isDraggingOver ? 'Release to upload' : 'Drag & drop image here'}
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            <Separator className="md:col-span-2 my-2" />

            {isEditing ? (
              <>
                <div className="md:col-span-2 space-y-1">
                    <Label htmlFor="itemName">Product Name</Label>
                    <Input id="itemName" name="name" value={editableItem.name} onChange={handleInputChange} />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="itemSupplier">Supplier</Label>
                    <Input id="itemSupplier" name="supplier" value={editableItem.supplier} onChange={handleInputChange} />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="itemStock">Current Stock</Label>
                    <Input id="itemStock" name="stock" type="number" value={String(editableItem.stock)} onChange={handleInputChange} min="0" />
                </div>
                 <div className="space-y-1">
                    <Label htmlFor="itemLowStockThreshold">Low Stock Threshold</Label>
                    <Input id="itemLowStockThreshold" name="lowStockThreshold" type="number" value={String(editableItem.lowStockThreshold)} onChange={handleInputChange} min="0"/>
                </div>
                <div className="space-y-1">
                    <Label htmlFor="itemPurchasePrice">Purchase Price ($)</Label>
                    <Input id="itemPurchasePrice" name="purchasePrice" type="number" step="0.01" value={String(editableItem.purchasePrice)} onChange={handleInputChange} min="0"/>
                </div>
                 <div className="space-y-1">
                    <Label htmlFor="itemSalePrice">Sale Price ($)</Label>
                    <Input id="itemSalePrice" name="salePrice" type="number" step="0.01" value={String(editableItem.salePrice)} onChange={handleInputChange} min="0"/>
                </div>
                 <div className="space-y-1">
                    <Label htmlFor="itemTags">Tags (comma-separated)</Label>
                    <Input id="itemTags" name="tags" value={editableItem.tags} onChange={handleInputChange} />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="itemRating">Rating (0-5)</Label>
                    <Input id="itemRating" name="rating" type="number" step="0.1" min="0" max="5" value={String(editableItem.rating)} onChange={handleInputChange} />
                </div>
                <div className="md:col-span-2 space-y-1">
                    <Label htmlFor="itemDescription">Description</Label>
                    <Textarea id="itemDescription" name="description" value={editableItem.description || ''} onChange={handleInputChange} rows={3} />
                </div>
                <div className="md:col-span-2 space-y-1">
                    <Label htmlFor="itemNotes">Internal Notes</Label>
                    <Textarea id="itemNotes" name="notes" value={editableItem.notes || ''} onChange={handleInputChange} rows={3} />
                </div>
                <Separator className="md:col-span-2 my-2" />
                <div className="md:col-span-2 flex items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                        <Label htmlFor="itemActive" className="text-base">Active Status</Label>
                        <p className="text-xs text-muted-foreground">Inactive products will not be visible on the storefront.</p>
                    </div>
                    <Switch
                        id="itemActive"
                        checked={editableItem.active}
                        onCheckedChange={handleSwitchChange}
                    />
                </div>
              </>
            ) : (
              <>
                <DetailItem icon={Power} label="Active Status:" value={null} isComponent value={<Badge variant={editableItem.active ? 'default' : 'outline'}>{editableItem.active ? 'Active' : 'Inactive'}</Badge>} />
                <DetailItem icon={Tag} label="Category:" value={editableItem.category} isBadge />
                <DetailItem icon={Building} label="Supplier:" value={editableItem.supplier} />
                <DetailItem icon={BarChartBig} label="Current Stock:" value={`${editableItem.stock} units`} />
                <DetailItem icon={null} label="Stock Status:" value={<Badge variant="outline" className={`capitalize ${stockBadge.className}`}>{stockBadge.text}</Badge>} isComponent />
                <DetailItem icon={AlertTriangle} label="Low Stock Threshold:" value={`${editableItem.lowStockThreshold} units`} className="text-yellow-600" />
                <DetailItem icon={CalendarDays} label="Last Restock:" value={new Date(editableItem.lastRestockDate).toLocaleDateString()} />
                <DetailItem icon={DollarSign} label="Purchase Price:" value={`$${Number(editableItem.purchasePrice).toFixed(2)}`} />
                <DetailItem icon={DollarSign} label="Sale Price:" value={`$${Number(editableItem.salePrice).toFixed(2)}`} className="text-primary" />
                 <DetailItem icon={Tag} label="Tags:" value={editableItem.tags} />
                <DetailItem icon={StarIcon} label="Rating:" value={`${editableItem.rating} / 5`} />
                
                 {editableItem.description && (
                    <div className="md:col-span-2 space-y-1 pt-2">
                        <h3 className="font-semibold text-sm mb-1 flex items-center"><Info className="mr-2 h-4 w-4 text-primary" />Description:</h3>
                        <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md border border-border/70 whitespace-pre-wrap">{editableItem.description}</p>
                    </div>
                )}
                {editableItem.notes && (
                    <div className="md:col-span-2 space-y-1 pt-2">
                        <h3 className="font-semibold text-sm mb-1 flex items-center"><Info className="mr-2 h-4 w-4 text-primary" />Notes:</h3>
                        <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md border border-border/70 whitespace-pre-wrap">{editableItem.notes}</p>
                    </div>
                )}
              </>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="p-6 bg-muted/30 flex-col sm:flex-row gap-3">
          <Button variant="outline" onClick={isEditing ? handleCancelEdit : onClose} className="w-full sm:w-auto">
             <X className="mr-2 h-4 w-4" /> {isEditing ? 'Cancel' : 'Close'}
          </Button>
          {isEditing && (
            <Button onClick={handleSaveClick} className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white" disabled={isUploading}>
              {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
               {isUploading ? 'Uploading...' : 'Save Changes'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

function DetailItem({ icon: IconComponent, label, value, isBadge, isComponent, className }: DetailItemProps) {
    return (
        <div className={`flex items-start text-sm ${isComponent ? '' : 'py-2 border-b border-border/30 last:border-b-0'}`}>
            {IconComponent && <IconComponent className={`mr-3 h-5 w-5 text-muted-foreground shrink-0 mt-0.5 ${className || ''}`} />}
            {!IconComponent && !isComponent && <div className="w-8 shrink-0"></div>}
            <span className="text-muted-foreground w-2/5 shrink-0">{label}</span>
            {isComponent ? <div className="ml-auto text-right">{value}</div> :
             isBadge ? <Badge variant="secondary" className="ml-auto capitalize whitespace-nowrap">{String(value)}</Badge> :
            <strong className={`ml-auto font-medium text-right ${className || 'text-foreground'}`}>{String(value)}</strong>}
        </div>
    );
};

interface DetailItemProps {
    icon: React.ElementType | null;
    label: string;
    value: string | React.ReactNode;
    isBadge?: boolean;
    isComponent?: boolean;
    className?: string;
}
