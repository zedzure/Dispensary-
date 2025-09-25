
'use client';

import { useState } from 'react';
import type { Product } from '@/types/product';
import { CartSheet } from '@/components/cart-sheet';
import { allProducts } from '@/lib/products';
import { ProductCard } from '@/components/product-card';
import { ProductDetailModal } from '@/components/product-detail-modal';
import { Store } from 'lucide-react';
import { ProductStoryReel } from './product-story-reel';

interface PublicMenuProps {
  locationId: string;
  locationName: string;
}

export function PublicMenu({ locationId, locationName }: PublicMenuProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };
  
  const productsForLocation = allProducts;

  return (
    <>
      <div className="container mx-auto px-4 md:px-6">
        <section className="py-12 text-center">
            <Store className="mx-auto h-12 w-12 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold font-cursive mt-4 text-primary">
                {locationName} Menu
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                Explore the curated selection of products available at our {locationName} location.
            </p>
        </section>

        <ProductStoryReel onProductClick={handleProductClick} />

        <div id="menu" className="space-y-16 py-8">
          {Object.entries(productsForLocation).map(([categoryName, products]) => (
            <section key={categoryName}>
              <div className="container mx-auto px-0">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-8 text-foreground">
                  {categoryName}
                </h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onProductClick={handleProductClick}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
       <ProductDetailModal
        isOpen={!!selectedProduct}
        onOpenChange={(isOpen) => !isOpen && closeModal()}
        product={selectedProduct ?? undefined}
      />
    </>
  );
}
