
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
import { Loader2, Sparkles, Leaf } from "lucide-react";
import { Skeleton } from "./ui/skeleton";

const formSchema = z.object({
  preferences: z.string().min(20, {
    message: "Please tell us a bit more about what you're looking for (at least 20 characters).",
  }),
});

export function StrainRecommenderForm() {
  const [result, setResult] = useState<StrainRecommenderOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
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

  return (
    <div className="w-full max-w-3xl mx-auto">
      <Card className="bg-card shadow-xl border-border/60">
        <CardHeader className="text-center items-center">
          <Sparkles className="h-10 w-10 text-primary mb-4" />
          <CardTitle className="text-3xl font-semibold tracking-tight">Recommended for you</CardTitle>
          <CardDescription>Not sure what to choose? Let our AI guide you to the perfect experience.</CardDescription>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Skeleton className="h-48 w-full rounded-lg" />
                <Skeleton className="h-48 w-full rounded-lg" />
                <Skeleton className="h-48 w-full rounded-lg" />
              </div>
            </div>
          )}

          {result && (
            <div className="mt-8">
              <h3 className="font-semibold text-2xl mb-4 text-center">Here are your recommendations:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {result.strainSuggestions.map((strain, index) => (
                  <Card key={index} className="flex flex-col bg-secondary/30 border-border/60 hover:border-primary transition-colors">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 font-semibold">
                        <Leaf className="h-5 w-5 text-primary" />
                        {strain}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-sm text-muted-foreground">{result.reasons[index]}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
