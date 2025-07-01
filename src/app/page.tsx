
"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { ProductDetailModal } from "@/components/product-detail-modal";
import type { Product } from "@/types/product";
import { CartSheet } from "@/components/cart-sheet";
import { BottomNavBar } from "@/components/bottom-nav-bar";
import { allProducts } from "@/lib/products";
import { ProductCard } from "@/components/product-card";
import { SplashScreen } from "@/components/splash-screen";


export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const splashShown = sessionStorage.getItem('splashShown');
    if (splashShown) {
      setShowSplash(false);
    }
  }, []);

  const handleSplashFinished = () => {
    sessionStorage.setItem('splashShown', 'true');
    setShowSplash(false);
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  const flowerCategory = {
    name: 'Flower',
    products: allProducts['Flower'] || []
  };

  if (showSplash) {
    return <SplashScreen onFinished={handleSplashFinished} />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-white text-foreground overflow-hidden">
      <Header />
      <CartSheet />
      <main className="flex-grow pb-16 md:pb-0">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
              Welcome to GreenLeaf Guide
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-lg text-muted-foreground">
              Explore our curated selection of high-quality cannabis products.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button size="lg" asChild>
                <a href="#menu">
                  Browse The Menu <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Product Grid Section */}
        <section id="menu" className="py-16 md:py-24 bg-muted/20">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-8 text-primary">{flowerCategory.name}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {flowerCategory.products.map((product) => (
                <ProductCard key={product.id} product={product} onProductClick={handleProductClick} />
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
      <ProductDetailModal
        isOpen={!!selectedProduct}
        onOpenChange={(isOpen) => !isOpen && closeModal()}
        product={selectedProduct}
      />
      <BottomNavBar />
    </div>
  );
}
