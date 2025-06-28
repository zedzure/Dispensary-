
"use client";

import type { FC } from 'react';
import type { UpsellSuggestionsOutput } from '@/ai/flows/upsell-suggestions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface UpsellSectionProps {
  suggestions: UpsellSuggestionsOutput | null;
  isLoading: boolean;
}

const UpsellSection: FC<UpsellSectionProps> = ({ suggestions, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="bg-accent/10 border-accent/30">
        <CardHeader className="py-2">
          <CardTitle className="flex items-center text-md text-accent font-cursive">
            <Lightbulb className="mr-2 h-4 w-4 animate-pulse" /> AI Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 py-2">
          <Skeleton className="h-4 w-3/4" />
          <div className="flex gap-2 pt-1">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!suggestions || !suggestions.reasoning || suggestions.suggestions.length === 0) {
    return null; 
  }

  return (
    <Card className="bg-accent/10 border-accent/30 shadow-inner">
      <CardHeader className="py-2">
        <CardTitle className="flex items-center text-md text-accent font-cursive">
          <Lightbulb className="mr-2 h-4 w-4" /> AI Suggestion
        </CardTitle>
      </CardHeader>
      <CardContent className="py-2">
        <p className="text-xs text-accent-foreground/90 mb-2 italic">"{suggestions.reasoning}"</p>
        <div className="flex flex-wrap gap-1">
          {suggestions.suggestions.map((suggestion, index) => (
            <Badge key={index} variant="default" className="bg-accent text-accent-foreground py-0.5">
              {suggestion}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UpsellSection;
