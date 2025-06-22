
'use server';

/**
 * @fileOverview An AI-powered strain recommender flow that suggests specific products.
 *
 * - strainRecommender - A function that handles the strain recommendation process.
 * - StrainRecommenderInput - The input type for the strainRecommender function.
 * - StrainRecommenderOutput - The return type for the strainRecommender function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import { allProductsFlat } from '@/lib/products';
import type { Product } from '@/types/product';

const StrainRecommenderInputSchema = z.object({
  preferences: z.string().describe('A description of the user preferences and desired effects for cannabis strains.'),
  productsJSON: z.string().describe('A JSON string of all available products.'),
});
export type StrainRecommenderInput = z.infer<typeof StrainRecommenderInputSchema>;

// Zod schema for a single product, mirroring the Product type
const ProductSchema = z.object({
    id: z.string(),
    name: z.string(),
    category: z.string(),
    type: z.enum(['Sativa', 'Indica', 'Hybrid']).optional(),
    thc: z.coerce.number().optional(),
    price: z.coerce.number().optional(),
    description: z.string(),
    image: z.string(),
    hint: z.string(),
});

const StrainRecommenderOutputSchema = z.object({
  recommendation: z.string().describe('A summary of why these products are recommended based on the user preferences.'),
  products: z.array(ProductSchema).length(4).describe('An array of exactly 4 recommended products from the provided list that best match the preferences.'),
});
export type StrainRecommenderOutput = z.infer<typeof StrainRecommenderOutputSchema>;

// This is the exported function that the frontend will call.
export async function strainRecommender(input: { preferences: string }): Promise<StrainRecommenderOutput> {
  // The full product list is stringified and passed to the flow.
  return strainRecommenderFlow({
    preferences: input.preferences,
    productsJSON: JSON.stringify(allProductsFlat),
  });
}

const prompt = ai.definePrompt({
  name: 'strainRecommenderPrompt',
  input: {schema: StrainRecommenderInputSchema},
  output: {schema: StrainRecommenderOutputSchema},
  prompt: `You are an expert cannabis sommelier for GreenLeaf Guide.
A user is looking for recommendations.
Their preferences are: "{{{preferences}}}"

Here is a list of all available products in JSON format:
{{{productsJSON}}}

Please analyze the user's preferences and the product list.
Your task is to:
1. Write a short, friendly, and insightful summary explaining your recommendation strategy.
2. Select exactly 4 products from the list that best match the user's preferences.
3. Your response MUST be in the specified JSON format, containing the recommendation summary and the 4 selected product objects. Do not add any products that are not in the provided list.
`,
});

const strainRecommenderFlow = ai.defineFlow(
  {
    name: 'strainRecommenderFlow',
    inputSchema: StrainRecommenderInputSchema,
    outputSchema: StrainRecommenderOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
