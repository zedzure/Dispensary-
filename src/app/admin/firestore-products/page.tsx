'use client';

import { ProductList } from '@/components/admin/product-list';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Database } from 'lucide-react';

export default function FirestoreProductsPage() {
  return (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle className="font-cursive text-primary flex items-center">
                    <Database className="mr-2 h-6 w-6" /> Live "Flower" Products from Firestore
                </CardTitle>
                <CardDescription>This page directly fetches products with the catagory 'flower' from your 'products' collection in Firestore. Make sure your Firestore security rules and indexes are correctly configured.</CardDescription>
            </CardHeader>
        </Card>
        <ProductList />
    </div>
  );
}
