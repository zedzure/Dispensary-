
'use client';

import { useParams, notFound } from 'next/navigation';
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { BottomNavBar } from "@/components/bottom-nav-bar";
import { Leaf, MapPin, Percent, Search, Star } from "lucide-react";
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const featuresData = [
    {
        icon: MapPin,
        title: "Find Local Dispensaries",
        description: "With over 5,000 licensed dispensaries listed nationwide, our platform provides an intuitive map-based search to help you find the perfect spot in your area. Filter by services like delivery, in-store pickup, or curbside service, all while supporting local businesses that contribute over $1.8 billion in state tax revenue annually. View store hours, contact information, and navigate directly from the app.",
        slug: "find-local-dispensaries"
    },
    {
        icon: Search,
        title: "Explore Products",
        description: "Dive into a comprehensive menu of over 25,000 cannabis products from more than 3,000 unique strains. From flower and pre-rolls to edibles and tinctures, you can browse detailed information including THC/CBD content, terpene profiles, effects, and flavors. Our search and filter options make it easy to find exactly what you're looking for among the 100+ known cannabinoids.",
        slug: "explore-products"
    },
    {
        icon: Percent,
        title: "Discover Deals",
        description: "Unlock an average savings of 25% on your purchases by browsing the latest promotions and discounts from your favorite dispensaries. We aggregate thousands of deals daily to help you save. Get instant notifications for flash sales and daily specials, ensuring you never miss an opportunity to get the best value.",
        slug: "discover-deals"
    },
    {
        icon: Star,
        title: "Read Real Reviews",
        description: "Make confident choices with insights from our community of over 500,000 users. Read authentic reviews and ratings on products and dispensaries, with an average of 1,200 new reviews submitted daily. Share your own experiences to help others in the community make informed decisions and find the best cannabis for their needs.",
        slug: "read-real-reviews"
    },
    {
        icon: Leaf,
        title: "Learn About Cannabis",
        description: "Whether you're new to cannabis or a seasoned connoisseur, our learning center is a valuable resource. Did you know the cannabis plant contains over 500 chemical compounds? Deepen your knowledge with educational guides on different strains, consumption methods, and the potential benefits of cannabinoids like THC and CBD. We're committed to promoting safe and responsible consumption.",
        slug: "learn-about-cannabis"
    }
];

export default function FeatureDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const feature = featuresData.find(f => f.slug === slug);

  if (!feature) {
    notFound();
  }

  const { icon: Icon, title, description } = feature;

  return (
    <div className="flex flex-col min-h-screen bg-muted/40">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 pt-24 md:pt-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <Button asChild variant="ghost">
              <Link href="/about">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to About
              </Link>
            </Button>
          </div>
          <article className="prose lg:prose-lg dark:prose-invert max-w-none bg-card/60 backdrop-blur-sm p-6 rounded-lg">
            <div className="flex items-center gap-4 mb-4">
              <Icon className="h-10 w-10 text-primary" />
              <h1 className="!mb-0 !text-primary">{title}</h1>
            </div>
            <p className="lead">{description}</p>
          </article>
        </div>
      </main>
      <Footer />
      <BottomNavBar />
    </div>
  );
}
