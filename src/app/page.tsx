
"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { StrainRecommenderForm } from "@/components/strain-recommender-form";
import { Button } from "@/components/ui/button";
import { ArrowRight, Leaf, MapPin, Tag } from "lucide-react";
import { CategoryCircles } from "@/components/category-circles";
import { DealsSteals } from "@/components/deals-steals";
import { ProductDetailModal } from "@/components/product-detail-modal";
import type { Product } from "@/types/product";
import { CartSheet } from "@/components/cart-sheet";
import { SplashScreen } from "@/components/splash-screen";
import { BottomNavBar } from "@/components/bottom-nav-bar";
import { categories, allProducts } from "@/lib/products";
import { ProductCard } from "@/components/product-card";


export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };
  
  if (showSplash) {
    return <SplashScreen onFinished={() => setShowSplash(false)} />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-white text-foreground overflow-hidden">
      <Header />
      <CartSheet />
      <main className="flex-grow pb-16 md:pb-0">
        {/* Hero Section */}
        <section className="relative py-10 md:py-16 bg-white">
          <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
              Discover Your Perfect Strain
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-lg text-muted-foreground">
              Explore our curated selection of high-quality cannabis products and find exactly what you need with our AI-powered recommender.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button size="lg" asChild>
                <a href="#recommender">
                  Strain Finder AI <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <a href="#menu">Browse Menu</a>
              </Button>
            </div>
          </div>
        </section>

        {/* Recommender Section */}
        <section id="recommender" className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <StrainRecommenderForm />
          </div>
        </section>

        {/* Shop by Category Section */}
        <section className="pt-16 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-8 text-primary">Shop by Category</h2>
          </div>
          <CategoryCircles onProductClick={handleProductClick} />
        </section>

        {/* Deals & Steals Section */}
        <DealsSteals onProductClick={handleProductClick} />
        
        {/* Category Product Grid Section */}
        <section id="menu" className="py-16 md:py-24 bg-white">
          <div className="space-y-16">
            {categories.map((category) => (
              <div key={category.name}>
                <div className="container mx-auto px-4 md:px-6">
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-8 text-primary">{category.name}</h2>
                </div>
                {category.name === 'Coming Soon' ? (
                  <div className="container mx-auto px-4 md:px-6">
                    <p className="text-lg text-muted-foreground">Check back soon for new products!</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto no-scrollbar">
                    <ul className="flex flex-nowrap items-stretch gap-6 py-4 pl-4 pr-4 md:pl-6 md:pr-6">
                      {allProducts[category.name] && allProducts[category.name].map((product) => (
                        <li key={product.id} className="flex-shrink-0 w-64 sm:w-72">
                          <ProductCard product={product} onProductClick={handleProductClick} />
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
        
        {/* Why Choose Us Section */}
        <section id="why-us" className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-4 md:px-6">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-12 text-primary">Why GreenLeaf Guide?</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className="flex flex-col items-center p-6">
                        <div className="p-3 mb-4">
                            <Leaf className="h-10 w-10 text-primary"/>
                        </div>
                        <h3 className="text-xl font-semibold">Premium Selection</h3>
                        <p className="text-muted-foreground mt-2 max-w-xs">Curated list of the highest quality strains from trusted growers.</p>
                    </div>
                    <div className="flex flex-col items-center p-6">
                        <div className="p-3 mb-4">
                            <Tag className="h-10 w-10 text-primary"/>
                        </div>
                        <h3 className="text-xl font-semibold">Exclusive Deals</h3>
                        <p className="text-muted-foreground mt-2 max-w-xs">Access special offers and a rewarding loyalty program.</p>
                    </div>
                    <div className="flex flex-col items-center p-6">
                        <div className="p-3 mb-4">
                            <MapPin className="h-10 w-10 text-primary"/>
                        </div>
                        <h3 className="text-xl font-semibold">Local &amp; Convenient</h3>
                        <p className="text-muted-foreground mt-2 max-w-xs">Find dispensaries near you for easy pickup or delivery.</p>
                    </div>
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
