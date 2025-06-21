import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { StrainRecommenderForm } from "@/components/strain-recommender-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Leaf, MapPin, Tag } from "lucide-react";
import Image from 'next/image';
import { CategoryCircles } from "@/components/category-circles";
import { DealsSteals } from "@/components/deals-steals";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 bg-card">
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
        <section id="recommender" className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <StrainRecommenderForm />
          </div>
        </section>

        {/* Category Section */}
        <section id="categories" className="py-16 md:py-24 bg-card">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-12">
              Shop by Category
            </h2>
            <CategoryCircles />
          </div>
        </section>

        <DealsSteals />

        {/* Featured Products Section */}
        <section id="menu" className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-12">
              Featured Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="overflow-hidden group bg-card border-border/60 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <CardHeader className="p-0">
                    <Image
                      src={`https://placehold.co/600x400.png`}
                      data-ai-hint="cannabis product"
                      alt={`Product ${i + 1}`}
                      width={600}
                      height={400}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </CardHeader>
                  <CardContent className="p-6">
                    <CardTitle className="text-xl font-semibold">Product Name {i + 1}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-2">Sativa | 22% THC</p>
                  </CardContent>
                  <CardFooter className="p-6 pt-0">
                    <Button className="w-full" variant="secondary">View Product</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            <div className="text-center mt-12">
              <Button size="lg" variant="secondary">View Full Menu</Button>
            </div>
          </div>
        </section>
        
        {/* Why Choose Us Section */}
        <section id="why-us" className="py-16 md:py-24 bg-card">
            <div className="container mx-auto px-4 md:px-6">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-12">Why GreenLeaf Guide?</h2>
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
    </div>
  );
}
