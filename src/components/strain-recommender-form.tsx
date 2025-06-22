
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { strainRecommender, type StrainRecommenderOutput } from "@/ai/flows/strain-recommender";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles, Wand2 } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import { ProductCard } from "./product-card";
import type { Product } from "@/types/product";
import { ProductDetailModal } from "./product-detail-modal";

const formSchema = z.object({
  preferences: z.string().min(10, {
    message: "Please tell us a bit more about what you're looking for (at least 10 characters).",
  }),
});

const quickRecs = [
    { label: "Sativa Vapes", query: "I'm looking for a Sativa vape pen for daytime energy and focus." },
    { label: "For Sleep", query: "I need a strong Indica flower or edible to help me fall asleep and stay asleep." },
    { label: "Relaxing Indica", query: "What's a good Indica strain for relaxing on the couch and watching movies?" },
    { label: "Creative Hybrids", query: "I want a hybrid strain that sparks creativity and conversation without causing anxiety." },
];

export function StrainRecommenderForm() {
  const [result, setResult] = useState<StrainRecommenderOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      preferences: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const recommenderResult = await strainRecommender({ preferences: values.preferences });
      setResult(recommenderResult);
    } catch (error) {
      console.error(error);
      toast({
        title: "An error occurred",
        description: "Failed to get recommendations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleQuickRec = (query: string) => {
    form.setValue("preferences", query);
    form.handleSubmit(onSubmit)();
  };
  
  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  return (
    <>
    <div className="w-full max-w-4xl mx-auto">
      <Card className="bg-card shadow-xl border-border/60">
        <CardHeader className="text-center items-center">
          <Sparkles className="h-10 w-10 text-primary mb-4" />
          <CardTitle className="text-3xl font-semibold tracking-tight">AI Strain Finder</CardTitle>
          <CardDescription>Tell our AI what you're looking for, or try one of our popular requests.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="preferences"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">Describe your desired experience</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 'I'm looking for something to help me relax after work, without making me too sleepy. I prefer fruity flavors.'"
                        className="min-h-[120px] resize-none text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <div className="flex flex-wrap items-center justify-center gap-2">
                {quickRecs.map(rec => (
                    <Button key={rec.label} type="button" variant="outline" size="sm" onClick={() => handleQuickRec(rec.query)} disabled={isLoading}>
                        <Wand2 className="mr-2 h-4 w-4" />
                        {rec.label}
                    </Button>
                ))}
               </div>
              <Button type="submit" disabled={isLoading} className="w-full" size="lg">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Find My Strains
              </Button>
            </form>
          </Form>

          {isLoading && (
            <div className="mt-8 space-y-4">
              <p className="font-semibold text-2xl text-center text-muted-foreground animate-pulse">Finding the perfect match...</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Skeleton className="h-96 w-full rounded-lg" />
                <Skeleton className="h-96 w-full rounded-lg" />
                <Skeleton className="h-96 w-full rounded-lg" />
                <Skeleton className="h-96 w-full rounded-lg" />
              </div>
            </div>
          )}

          {result && (
            <div className="mt-8">
              <h3 className="font-semibold text-2xl mb-2 text-center">Your AI Recommendations</h3>
              <p className="text-muted-foreground text-center mb-6 max-w-2xl mx-auto">{result.recommendation}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {result.products.map((product) => (
                    <ProductCard key={product.id} product={product} onProductClick={handleProductClick} />
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
    <ProductDetailModal
        isOpen={!!selectedProduct}
        onOpenChange={(isOpen) => !isOpen && closeModal()}
        product={selectedProduct}
    />
    </>
  );
}
