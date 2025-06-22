
'use server';

/**
 * @fileOverview An AI-powered strain recommender flow.
 * This file implements a more robust, two-step recommendation process.
 * 1. The AI first generates a narrative description of the ideal product.
 * 2. The code then programmatically filters the product list based on keywords from that narrative.
 * This approach is more reliable than asking the AI to select from a large list or return complex JSON.
 *
 * - strainRecommender - The main function that handles the recommendation process.
 * - StrainRecommenderOutput - The return type for the strainRecommender function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { allProductsFlat } from '@/lib/products';
import type { Product } from '@/types/product';

// Input/Output schemas for the exported function
export type StrainRecommenderInput = { preferences: string };

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
export const StrainRecommenderOutputSchema = z.object({
  recommendation: z.string(),
  products: z.array(ProductSchema),
});
export type StrainRecommenderOutput = z.infer<typeof StrainRecommenderOutputSchema>;

// Exported function calls the flow
export async function strainRecommender(input: StrainRecommenderInput): Promise<StrainRecommenderOutput> {
  return strainRecommenderFlow(input);
}


// --- AI and Flow Logic ---

// Step 1: AI generates a narrative description of the ideal product.
const idealProductNarrativePrompt = ai.definePrompt({
    name: 'idealProductNarrativePrompt',
    input: { schema: z.object({ preferences: z.string() }) },
    output: { schema: z.object({ ideal_product_description: z.string().describe("A short paragraph describing the ideal product, including type, THC level, and desired effects/flavors.") }) },
    config: {
        safetySettings: [ { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' } ],
    },
    prompt: `Analyze the user's request and describe the ideal cannabis product for them in a short paragraph.
Your description should be used to find matching products.
Include the ideal type (like Sativa, Indica, or Hybrid), THC level (like low, moderate, or high), and key effects or flavors (like relaxing, focus, sleepy, fruity, earthy).

User Request: "{{{preferences}}}"

Ideal Product Description:`,
});

// Step 2: Code scores products based on the AI's narrative.
function scoreProduct(product: Product, narrative: string): number {
    let score = 0;
    const productText = `${product.name} ${product.description} ${product.type}`.toLowerCase();
    const narrativeLower = narrative.toLowerCase();

    // Give a big boost for type match
    if (product.type) {
        if (narrativeLower.includes(product.type.toLowerCase())) {
            score += 5;
        }
    }

    // Check for THC level keywords
    const thc = product.thc ?? 0;
    if ((narrativeLower.includes('low') || narrativeLower.includes('mild')) && thc < 18) score += 3;
    if (narrativeLower.includes('moderate') && thc >= 18 && thc <= 25) score += 3;
    if ((narrativeLower.includes('high') || narrativeLower.includes('strong') || narrativeLower.includes('potent')) && thc > 25) score += 3;

    // Use keywords from the narrative to score
    // Simple keyword extraction from the narrative.
    const keywords = narrativeLower.match(/\b(\w+)\b/g) || [];
    const uniqueKeywords = [...new Set(keywords)].filter(kw => kw.length > 3); // Filter short words

    uniqueKeywords.forEach(keyword => {
        if (productText.includes(keyword)) {
            score += 1;
        }
    });

    return score;
}

// Step 3: AI generates a friendly summary for the chosen products.
const summaryGeneratorPrompt = ai.definePrompt({
    name: 'summaryGeneratorPrompt',
    input: { schema: z.object({ preferences: z.string(), products: z.array(ProductSchema) }) },
    output: { schema: z.object({ recommendation: z.string() }) },
    config: {
        safetySettings: [ { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' } ],
    },
    prompt: `You are a helpful cannabis expert. A user described what they want, and you have selected the following products that are a good match.
Write a short, friendly summary explaining why these products are a good choice based on their request.

User Request: "{{{preferences}}}"

Your Recommended Products:
{{#each products}}
- {{this.name}}
{{/each}}
`,
});

// The main flow that orchestrates the new logic.
const strainRecommenderFlow = ai.defineFlow(
  {
    name: 'strainRecommenderFlow',
    inputSchema: z.object({ preferences: z.string() }),
    outputSchema: StrainRecommenderOutputSchema,
  },
  async ({ preferences }) => {
    // Step 1: Generate a narrative description of the ideal product.
    const { output } = await idealProductNarrativePrompt({ preferences });
    if (!output?.ideal_product_description) {
      throw new Error('AI failed to generate a product description. Please try rephrasing your request.');
    }
    const narrative = output.ideal_product_description;

    // Step 2: Score all products based on the AI-generated narrative.
    const scoredProducts = allProductsFlat.map(p => ({ product: p, score: scoreProduct(p, narrative) }));
    
    // Step 3: Filter and sort to find the best matches.
    const sortedProducts = scoredProducts.filter(p => p.score > 0).sort((a, b) => b.score - a.score);
    const recommendedProducts = sortedProducts.slice(0, 4).map(p => p.product);

    // Step 4: Handle the case where no products match.
    if (recommendedProducts.length === 0) {
      return {
        recommendation: "We couldn't find any products that currently match your preferences. Please try being more specific or using different keywords.",
        products: [],
      };
    }
    
    // Step 5: Generate a friendly summary for the recommended products.
    const { output: summary } = await summaryGeneratorPrompt({ preferences, products: recommendedProducts });
    if (!summary?.recommendation) {
      throw new Error('AI failed to generate a recommendation summary.');
    }

    // Return the final result.
    return {
      recommendation: summary.recommendation,
      products: recommendedProducts,
    };
  }
);
