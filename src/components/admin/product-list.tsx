
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
    // Diagnostic log to check the Firebase project ID the app is connected to.
    console.log(`[DIAGNOSTIC] App is configured for Firebase project: ${db.app.options.projectId}`);
    
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      const collectionName = 'Pre Rolls';
      console.log(`[DIAGNOSTIC] Attempting to fetch documents from collection: "${collectionName}"`);

      try {
        const productsRef = collection(db, collectionName);
        const querySnapshot = await getDocs(productsRef);
        
        console.log(`[DIAGNOSTIC] Firestore query successful. Found ${querySnapshot.size} documents.`);

        if (querySnapshot.empty) {
            setError(`No products found in your '${collectionName}' collection. Please double-check that the collection name is exact (case-sensitive) and that it contains documents. Also, verify your Firebase security rules allow reads.`);
            setIsLoading(false);
            return;
        }

        const productList: Product[] = querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
          const data = doc.data();
          // Handle potential variations in the image URL field name
          const imageUrl = data.imageUrl || data['image/Url'] || data.image || 'https://placehold.co/400x400.png';
          return {
            id: doc.id,
            name: data.name || 'No Name',
            // Handle variations in category field name
            category: data.category || data.catagory || "Pre Rolls",
            price: data.price ?? 0,
            image: imageUrl,
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
        console.error("[DIAGNOSTIC] Firestore query failed with error:", e);
        if (e.code === 'permission-denied') {
            setError(`Permission Denied. Please check your Firestore security rules to allow reading from the '${collectionName}' collection. The current project is ${db.app.options.projectId}.`);
        } else if (e.code === 'failed-precondition') {
             setError(`Query requires an index. Please check the browser console for a link to create the required Firestore index. The error is: ${e.message}`);
        }
        else {
          setError(`Failed to fetch products. Error: ${e.message}.`);
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
