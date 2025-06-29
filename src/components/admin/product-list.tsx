'use client';

import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, orderBy, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import type { Product } from '@/types/product';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const productsRef = collection(db, 'products');
        
        // Construct the query with the specified filters and ordering
        const q = query(
          productsRef,
          where('category', '==', 'flower'),
          where('price', '<=', 50),
          orderBy('price')
        );
        
        const querySnapshot = await getDocs(q);
        const productList = querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || 'No Name',
            price: data.price || 0,
            image: data.imageUrl || data.image || 'https://placehold.co/100x100.png',
            category: data.category || 'Uncategorized',
            description: data.description || '',
            hint: data.hint || 'product',
          } as Product;
        });
        setProducts(productList);
      } catch (e: any) {
        console.error("Error fetching from Firestore: ", e);
        if (e.code === 'failed-precondition') {
          setError("Query failed. You likely need to create a composite index in Firestore. Check your browser's developer console for a direct link to create it.");
        } else {
          setError("Failed to fetch products. Make sure Firestore is set up correctly and the 'products' collection exists.");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
                <Card key={i}>
                    <CardHeader>
                        <Skeleton className="h-6 w-3/4" />
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-4">
                        <Skeleton className="h-24 w-24 rounded-md" />
                        <Skeleton className="h-5 w-1/4" />
                    </CardContent>
                </Card>
            ))}
        </div>
    )
  }

  if (error) {
    return (
        <Card className="bg-destructive/10 border-destructive">
            <CardHeader>
                <CardTitle className="text-destructive">Error</CardTitle>
            </CardHeader>
            <CardContent>
                <p>{error}</p>
            </CardContent>
        </Card>
    )
  }

  return (
    <div>
        {products.length === 0 ? (
            <p>No products found matching the criteria (Category: flower, Price: &lt;= $50) in Firestore.</p>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((p) => (
                <Card key={p.id}>
                    <CardHeader>
                         <CardTitle className="truncate text-lg">{p.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-4">
                        <Image src={p.image} alt={p.name} width={100} height={100} className="rounded-md object-cover" />
                        <p className="font-bold text-lg text-primary">${p.price?.toFixed(2)}</p>
                    </CardContent>
                </Card>
            ))}
            </div>
        )}
    </div>
  );
};
