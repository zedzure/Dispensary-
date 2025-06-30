
'use client';

import { db } from '@/lib/firebase';
import { collection, getDocs, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import type { Product } from '@/types/product';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Star, Pin } from 'lucide-react';
import { cn } from '@/lib/utils';

// The specific document ID to highlight.
const HIGHLIGHT_ID = 'NPcl8u1BqP0b4o58PpNR';

export const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const productsRef = collection(db, 'Rolls');
        
        // Simplest query: get all documents without ordering.
        const querySnapshot = await getDocs(productsRef);

        if (querySnapshot.empty) {
            setError("No products found in your 'Rolls' collection. Please check that the collection is not empty and that your Firestore security rules allow reading from it.");
            setIsLoading(false);
            return;
        }

        const productList: Product[] = querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
          const data = doc.data();
          const imageUrl = data.imageUrl || data['image/Url'] || data.image || 'https://placehold.co/400x400.png';
          return {
            id: doc.id,
            name: data.name || 'No Name',
            price: data.price ?? 0,
            image: imageUrl,
            category: data.catagory || "Rolls",
            description: data.description || '',
            hint: data.hint || 'product',
            type: data.type,
            thc: data.thc,
            stock: data.stock,
            rating: data.rating,
            active: data.active,
          } as Product;
        });
        
        setProducts(productList);

      } catch (e: any) {
        if (e.code === 'permission-denied') {
            setError("Permission Denied. Please check your Firestore security rules to allow reading from the 'Rolls' collection.");
        }
        else {
          setError("Failed to fetch products. Make sure Firestore is set up correctly and the 'Rolls' collection exists.");
          console.error("Firestore query failed with error:", e);
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
                <Card key={i} className="flex flex-col">
                    <CardHeader className="p-4">
                        <Skeleton className="aspect-square w-full rounded-md" />
                    </CardHeader>
                    <CardContent className="flex-grow p-4 space-y-2">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                         <div className="flex gap-2 pt-2">
                            <Skeleton className="h-5 w-16" />
                            <Skeleton className="h-5 w-20" />
                        </div>
                    </CardContent>
                    <CardFooter className="p-4">
                        <Skeleton className="h-7 w-1/3" />
                    </CardFooter>
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
    <div className="space-y-12">
        {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((p) => (
                    <Card key={p.id} className={cn(
                        "flex flex-col overflow-hidden shadow-md hover:shadow-xl transition-all",
                        p.id === HIGHLIGHT_ID && "ring-4 ring-offset-2 ring-blue-500"
                    )}>
                        <CardHeader className="p-0 relative">
                            {p.id === HIGHLIGHT_ID && (
                                <div className="absolute top-2 right-2 z-10 p-1.5 bg-blue-500 rounded-full text-white shadow-lg">
                                    <Pin className="w-5 h-5" />
                                </div>
                            )}
                            <div className="aspect-square w-full relative bg-muted">
                                <Image src={p.image} alt={p.name} layout="fill" objectFit="cover" data-ai-hint={p.hint || 'product'} />
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 flex-grow space-y-2">
                            <CardTitle className="truncate text-lg" title={p.name}>{p.name}</CardTitle>
                            <p className="text-sm text-muted-foreground line-clamp-2 h-10">{p.description}</p>
                                <div className="flex flex-wrap gap-1 pt-1 text-xs">
                                {p.type && <Badge variant="secondary">{p.type}</Badge>}
                                {p.thc !== undefined && <Badge variant="outline">THC: {p.thc}%</Badge>}
                                {p.stock !== undefined && <Badge variant="outline">Stock: {p.stock}</Badge>}
                                {p.rating !== undefined && (
                                    <Badge variant="outline" className="flex items-center gap-1">
                                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500"/>{p.rating.toFixed(1)}
                                    </Badge>
                                )}
                                {p.active !== undefined && <Badge variant={p.active ? 'default' : 'destructive'}>{p.active ? 'Active' : 'Inactive'}</Badge>}
                            </div>
                        </CardContent>
                        <CardFooter className="p-4 mt-auto">
                            <p className="font-bold text-xl text-primary">${p.price?.toFixed(2)}</p>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        ) : null}
    </div>
  );
};
