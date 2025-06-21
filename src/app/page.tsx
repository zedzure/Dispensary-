
"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { StrainRecommenderForm } from "@/components/strain-recommender-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Leaf, MapPin, Tag } from "lucide-react";
import Image from 'next/image';
import { CategoryCircles } from "@/components/category-circles";
import { DealsSteals } from "@/components/deals-steals";
import { ProductDetailModal } from "@/components/product-detail-modal";
import type { Product } from "@/types/product";
import { CartSheet } from "@/components/cart-sheet";
import { SplashScreen } from "@/components/splash-screen";
import { BottomNavBar } from "@/components/bottom-nav-bar";

const categories = [
  { name: 'Pre-rolls', hint: 'cannabis joint' },
  { name: 'Flower', hint: 'cannabis bud' },
  { name: 'Seeds', hint: 'cannabis seed' },
  { name: 'Edibles', hint: 'gummy candy' },
  { name: 'Concentrates', hint: 'cannabis oil' },
  { name: 'Tinctures', hint: 'dropper bottle' },
  { name: 'Topicals', hint: 'cream jar' },
  { name: 'Vapes', hint: 'vape pen' },
  { name: 'Gear', hint: 'grinder accessory' },
  { name: 'Deals', hint: 'sale tag' },
];

const generateProducts = (category: { name: string, hint: string }, count: number): Product[] => {
  return Array.from({ length: count }).map((_, i) => {
    const productType = i % 3 === 0 ? 'Sativa' : i % 3 === 1 ? 'Indica' : 'Hybrid';
    let specificHint = category.hint;
    
    if (category.name === 'Flower') {
      specificHint = `${productType.toLowerCase()} cannabis`;
    } else if (productType !== 'Hybrid') {
        if (category.name === 'Vapes') {
            specificHint = `${productType.toLowerCase()} vape`;
        } else if (category.name === 'Pre-rolls') {
            specificHint = `${productType.toLowerCase()} joint`;
        }
    }

    return {
        id: `${category.name}-${i}`,
        name: `${category.name} Product ${i + 1}`,
        category: category.name,
        type: productType,
        thc: ((i * 3) % 15) + 15,
        price: ((i * 7) % 40) + 20,
        description: `An exquisite ${category.name.toLowerCase()} with a unique profile. Perfect for both new and experienced users looking for a quality experience.`,
        image: `https://placehold.co/600x400.png`,
        hint: specificHint,
    };
  });
};

const allProducts = categories.reduce((acc, category) => {
  acc[category.name] = generateProducts(category, 10);
  return acc;
}, {} as Record<string, Product[]>);


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
    <div className="flex flex-col min-h-screen bg-white text-foreground">
      <Header />
      <CartSheet />
      <main className="flex-grow pb-16 md:pb-0">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 bg-white">
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
            <CategoryCircles onProductClick={handleProductClick} />
          </div>
        </section>

        {/* Deals & Steals Section */}
        <DealsSteals onProductClick={handleProductClick} />
        
        {/* Category Product Grid Section */}
        <section id="menu" className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4 md:px-6 space-y-16">
            {categories.map((category) => (
              <div key={category.name}>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-8 text-primary">{category.name}</h2>
                <div className="overflow-x-auto no-scrollbar -mx-4 px-4 md:-mx-6 md:px-6">
                  <ul className="flex flex-nowrap items-stretch gap-6 py-4">
                    {allProducts[category.name].map((product) => (
                      <li key={product.id} className="flex-shrink-0 w-64 sm:w-72">
                        <Card className="h-full flex flex-col overflow-hidden group bg-white border-border/60 shadow-lg">
                          <CardHeader className="p-0">
                            <button onClick={() => handleProductClick(product)} className="w-full aspect-[3/2] relative">
                                <Image
                                  src={product.image}
                                  data-ai-hint={product.hint}
                                  alt={product.name}
                                  layout="fill"
                                  objectFit="cover"
                                  className=""
                                />
                            </button>
                          </CardHeader>
                          <CardContent className="p-6 flex-grow">
                            <CardTitle className="text-xl font-semibold">{product.name}</CardTitle>
                            <p className="text-sm text-muted-foreground mt-2">{product.type} | {product.thc}% THC</p>
                          </CardContent>
                          <CardFooter className="p-6 pt-0 flex items-center justify-between">
                            <p className="text-xl font-bold text-primary">${product.price?.toFixed(2)}</p>
                            <Button variant="default" onClick={() => handleProductClick(product)}>View</Button>
                          </CardFooter>
                        </Card>
                      </li>
                    ))}
                  </ul>
                </div>
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
