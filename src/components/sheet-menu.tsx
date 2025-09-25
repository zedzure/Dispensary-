
'use client';

import { useState } from 'react';
import type { Product } from '@/types/product';
import { allProducts } from '@/lib/products';
import { ProductCard } from '@/components/product-card';
import { ProductDetailModal } from '@/components/product-detail-modal';

export function SheetMenu() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  return (
    <>
      <div className="space-y-12 p-4">
        {Object.entries(allProducts).map(([categoryName, products]) => (
          <section key={categoryName}>
            <h2 className="text-2xl font-bold tracking-tight mb-4 text-foreground">
              {categoryName}
            </h2>
            <div className="grid grid-cols-2 gap-4">
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
       <ProductDetailModal
        isOpen={!!selectedProduct}
        onOpenChange={(isOpen) => !isOpen && closeModal()}
        product={selectedProduct ?? undefined}
      />
    </>
  );
}
