
'use client';

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { BottomNavBar } from "@/components/bottom-nav-bar";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Leaf, MapPin, Percent, Search, Sparkles, Star } from "lucide-react";

const features = [
    {
        icon: MapPin,
        title: "Find Local Dispensaries",
        description: "Easily locate top-rated dispensaries near you for both delivery and in-store pickup."
    },
    {
        icon: Search,
        title: "Explore Products",
        description: "Browse a vast menu of flower, edibles, vapes, and concentrates with detailed descriptions."
    },
    {
        icon: Percent,
        title: "Discover Deals",
        description: "Never miss out on a promotion. Get access to exclusive deals and daily discounts."
    },
    {
        icon: Star,
        title: "Read Real Reviews",
        description: "Make informed decisions with authentic reviews from a community of fellow enthusiasts."
    },
    {
        icon: Leaf,
        title: "Learn About Cannabis",
        description: "Deepen your knowledge with guides on strains, consumption methods, and benefits."
    }
]

export default function AboutPage() {
  return (
    <>
      <div className="flex flex-col min-h-screen bg-transparent">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 pt-24 md:pt-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold font-cursive text-primary mb-4">About GreenLeaf Guide</h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              GreenLeaf Guide is your trusted partner for discovering, exploring, and enjoying cannabis safely and confidently. We connect you with local dispensaries, the best products, and a community of enthusiasts.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
                <Card key={feature.title} className="shadow-md hover:shadow-lg transition-shadow bg-card/60 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-start gap-4 p-4">
                        <feature.icon className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                        <div>
                            <CardTitle className="text-lg">{feature.title}</CardTitle>
                            <CardDescription className="mt-1 text-sm md:text-base">{feature.description}</CardDescription>
                        </div>
                    </CardHeader>
                </Card>
            ))}
          </div>

        </main>
        <Footer />
        <BottomNavBar />
      </div>
    </>
  );
}
