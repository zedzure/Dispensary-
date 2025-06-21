import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { StrainRecommenderForm } from "@/components/strain-recommender-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Leaf, MapPin, Tag } from "lucide-react";
import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32">
          <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(to_bottom,white,transparent)] dark:bg-grid-slate-700/5"></div>
          <Image
            src="https://placehold.co/1920x1080.png"
            data-ai-hint="cannabis plant"
            alt="Hero background"
            fill={true}
            quality={80}
            className="object-cover opacity-5 dark:opacity-10"
            priority
          />
          <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
            <h1 className="text-4xl md:text-6xl font-headline font-bold text-foreground">
              Discover Your Perfect Strain
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              Explore our curated selection of high-quality cannabis products and find exactly what you need with our AI-powered recommender.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button size="lg" asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
                <a href="#menu">Browse Menu <ArrowRight className="ml-2 h-5 w-5" /></a>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <a href="#recommender">Strain Finder AI</a>
              </Button>
            </div>
          </div>
        </section>

        {/* Recommender Section */}
        <section id="recommender" className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <StrainRecommenderForm />
          </div>
        </section>

        {/* Featured Products Section */}
        <section id="menu" className="py-16 md:py-24 bg-secondary/30">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-headline font-bold text-center mb-12">
              Featured Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="overflow-hidden group border-border/60 hover:border-primary transition-all duration-300 hover:shadow-lg">
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
                  <CardContent className="p-4">
                    <CardTitle className="text-lg font-headline">Product Name {i + 1}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">Sativa | 22% THC</p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button className="w-full" variant="outline">View Product</Button>
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
        <section id="why-us" className="py-16 md:py-24">
            <div className="container mx-auto px-4 md:px-6">
                <h2 className="text-3xl md:text-4xl font-headline font-bold text-center mb-12">Why GreenLeaf Guide?</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className="flex flex-col items-center p-6 rounded-lg">
                        <div className="bg-primary/20 p-4 rounded-full mb-4">
                            <Leaf className="h-8 w-8 text-primary"/>
                        </div>
                        <h3 className="text-xl font-headline font-semibold">Premium Selection</h3>
                        <p className="text-muted-foreground mt-2 max-w-xs">Curated list of the highest quality strains from trusted growers.</p>
                    </div>
                    <div className="flex flex-col items-center p-6 rounded-lg">
                        <div className="bg-primary/20 p-4 rounded-full mb-4">
                            <Tag className="h-8 w-8 text-primary"/>
                        </div>
                        <h3 className="text-xl font-headline font-semibold">Exclusive Deals</h3>
                        <p className="text-muted-foreground mt-2 max-w-xs">Access special offers and a rewarding loyalty program.</p>
                    </div>
                    <div className="flex flex-col items-center p-6 rounded-lg">
                        <div className="bg-primary/20 p-4 rounded-full mb-4">
                            <MapPin className="h-8 w-8 text-primary"/>
                        </div>
                        <h3 className="text-xl font-headline font-semibold">Local & Convenient</h3>
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
