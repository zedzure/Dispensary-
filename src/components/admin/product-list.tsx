'use client';

import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, orderBy, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import type { Product } from '@/types/product';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Star } from 'lucide-react';

export const ProductList = () => {
  const [productsByCategory, setProductsByCategory] = useState<Record<string, Product[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const productsRef = collection(db, 'products');
        
        const q = query(
          productsRef,
          where('price', '>=', 1),
          where('price', '<=', 130),
          orderBy('price')
        );
        
        const querySnapshot = await getDocs(q);
        const productList: Product[] = querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || 'No Name',
            price: data.price ?? 0,
            image: data.imageUrl || data.image || 'https://placehold.co/400x400.png',
            category: data.category || 'Uncategorized',
            description: data.description || '',
            hint: data.hint || 'product',
            type: data.type,
            thc: data.thc,
            stock: data.stock,
            rating: data.rating,
            active: data.active,
          } as Product;
        });
        
        const groupedProducts = productList.reduce((acc, product) => {
            const category = product.category || 'Uncategorized';
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(product);
            return acc;
        }, {} as Record<string, Product[]>);

        const sortedCategories = Object.keys(groupedProducts).sort();
        const sortedGroupedProducts = sortedCategories.reduce((acc, key) => {
            acc[key] = groupedProducts[key].sort((a, b) => a.name.localeCompare(b.name));
            return acc;
        }, {} as Record<string, Product[]>);

        setProductsByCategory(sortedGroupedProducts);
      } catch (e: any) {
        console.error("Error fetching from Firestore: ", e);
        if (e.code === 'failed-precondition') {
          setError("Query failed. You likely need to create a composite index in Firestore. Check your browser's developer console for a direct link to create it for the query on the 'price' field.");
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
        {Object.keys(productsByCategory).length === 0 ? (
            <p>No products found matching the criteria (Price between $1 and $130) in Firestore.</p>
        ) : (
            Object.entries(productsByCategory).map(([category, products]) => (
                <div key={category}>
                    <h2 className="text-2xl font-bold font-cursive text-primary capitalize">{category}</h2>
                    <Separator className="my-4" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.map((p) => (
                           <Card key={p.id} className="flex flex-col overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                                <CardHeader className="p-0">
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
                </div>
            ))
        )}
    </div>
  );
};
