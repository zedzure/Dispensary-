
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
        const idSelectionResponse = await productSelectorPrompt({ preferences, products: productListForPrompt });
        const idString = idSelectionResponse.text?.trim();
        
        if (idString) {
            // Get non-empty IDs from the AI's response
            const productIds = idString.split(',').map(id => id.trim()).filter(id => id);
            
            // Create a map for efficient lookup and preserving order.
            const productMap = new Map(allProductsFlat.map(p => [p.id, p]));
            const orderedProducts = productIds.map(id => productMap.get(id)).filter((p): p is Product => !!p);

            if (orderedProducts.length > 0) {
                recommendedProducts = orderedProducts;
                recommendation = `Based on your request for "${preferences}", we think you'll like these choices.`;
            }
        }
    } catch (e) {
        console.error("AI recommendation step failed, proceeding to fallback. Full error:", e);
        // The catch block is intentionally empty.
        // We will fall through to the fallback logic below.
    }

    // Fallback logic: if the try block fails or finds no products, this will run.
    if (recommendedProducts.length === 0) {
        recommendation = "We had some trouble finding a specific match for your request. In the meantime, here are some of our most popular products for you to check out!";
        // Provide a sensible fallback, e.g., the first 4 flower products.
        recommendedProducts = allProductsFlat.filter(p => p.category === 'Flower').slice(0, 4);
    }
    
    // Final check to ensure we always return a valid response.
    if (!recommendedProducts || recommendedProducts.length === 0) {
      // This should be nearly impossible to reach, but it's a safeguard.
      console.error("CRITICAL: Fallback logic failed to produce products.");
      return {
        recommendation: "An unexpected error occurred and we could not retrieve any products. Please try again later.",
        products: [],
      };
    }

    // Return the final result. It will always be valid and should not throw an error.
    return {
      recommendation,
      products: recommendedProducts,
    };
  }
);
