
'use server';

/**
 * @fileOverview An AI-powered strain recommender flow.
 * This file implements a flow that asks the AI to select product IDs and then looks them up.
 * It includes robust error handling and fallbacks to ensure it always returns a valid response.
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

// Prepare a string of all products for the AI prompt.
const productListForPrompt = allProductsFlat.map(p => JSON.stringify({
    id: p.id,
    name: p.name,
    category: p.category,
    type: p.type,
    thc: p.thc,
    description: p.description,
})).join('\n');

// Prompt for the AI to select relevant product IDs.
const productSelectorPrompt = ai.definePrompt({
    name: 'productSelectorPrompt',
    input: { schema: z.object({ preferences: z.string(), products: z.string() }) },
    config: {
        safetySettings: [ { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' } ],
    },
    prompt: `You are a cannabis expert. Based on the user's preferences, select up to 4 of the most relevant product IDs from the provided list.
Return ONLY a single line of comma-separated product IDs and nothing else. For example: "Flower-1,Edibles-5,Pre-rolls-2"

USER PREFERENCES:
"{{{preferences}}}"

AVAILABLE PRODUCTS (JSON format, one per line):
{{{products}}}

Selected product IDs:`,
});

// Prompt to generate a summary for the selected products.
const summaryGeneratorPrompt = ai.definePrompt({
    name: 'summaryGeneratorPrompt',
    input: { schema: z.object({ preferences: z.string(), products: z.array(ProductSchema) }) },
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

Your Summary:
`,
});

// The main flow that orchestrates the logic with robust fallbacks.
const strainRecommenderFlow = ai.defineFlow(
  {
    name: 'strainRecommenderFlow',
    inputSchema: z.object({ preferences: z.string() }),
    outputSchema: StrainRecommenderOutputSchema,
  },
  async ({ preferences }) => {
    let recommendedProducts: Product[] = [];
    let recommendation = "";

    try {
        // Step 1: Ask AI to select product IDs.
        const idSelectionResponse = await productSelectorPrompt({ preferences, products: productListForPrompt });
        const idString = idSelectionResponse.text?.trim();

        if (idString) {
            const productIds = idString.split(',').map(id => id.trim());
            
            // Create a map for efficient lookup and preserving order.
            const productMap = new Map(allProductsFlat.map(p => [p.id, p]));
            const orderedProducts = productIds.map(id => productMap.get(id)).filter((p): p is Product => !!p);

            if (orderedProducts.length > 0) {
                recommendedProducts = orderedProducts;
            }
        }
    } catch (e) {
        console.error("AI recommendation failed, using fallback.", e);
        // The fallback logic below will be triggered if this block fails.
    }

    // Step 2: If AI fails or finds nothing, use a fallback.
    if (recommendedProducts.length === 0) {
        recommendation = "We had some trouble finding a specific match for your request. In the meantime, here are some of our most popular products for you to check out!";
        // Provide a sensible fallback, e.g., the first 4 flower products.
        recommendedProducts = allProductsFlat.filter(p => p.category === 'Flower').slice(0, 4);
    } else {
        // Step 3: If products were found, try to generate a summary.
        try {
            const summaryResponse = await summaryGeneratorPrompt({ preferences, products: recommendedProducts });
            recommendation = summaryResponse.text || `Based on your request for "${preferences}", we think you'll like these choices.`;
        } catch(e) {
            console.error("AI summary generation failed, using fallback summary.", e);
            // If summary fails, provide a generic one.
            recommendation = `Based on your request for "${preferences}", we think you'll like these choices.`;
        }
    }

    // Return the final result. It will always be valid.
    return {
      recommendation,
      products: recommendedProducts,
    };
  }
);
