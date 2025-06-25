
'use server';

/**
 * @fileOverview An AI-powered strain recommender flow.
 * This file implements a flow that asks the AI to select product IDs and generate a recommendation message.
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
  stock: z.coerce.number().optional(),
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

// Define a schema for the AI's structured response.
const AIResponseSchema = z.object({
    productIds: z.array(z.string()).describe("An array of up to 4 relevant product IDs from the list."),
    recommendation: z.string().describe("A friendly and helpful recommendation message for the user, explaining why these products were chosen based on their preferences.")
});

// Prompt for the AI to select products and generate a recommendation.
const productSelectorPrompt = ai.definePrompt({
    name: 'productSelectorPrompt',
    input: { schema: z.object({ preferences: z.string(), products: z.string() }) },
    output: { schema: AIResponseSchema }, // Use the new structured output schema
    config: {
        safetySettings: [ { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' } ],
    },
    prompt: `You are a friendly and knowledgeable cannabis expert at GreenLeaf Guide. A user will provide their preferences, and you will recommend up to 4 products from the provided list.

Your response MUST be a valid JSON object matching this schema: { "productIds": ["id1", "id2"], "recommendation": "Your message here." }

- productIds: Select up to 4 of the most relevant product IDs from the provided list based on the user's preferences.
- recommendation: Write a brief, friendly, and helpful message to the user explaining why you chose these products for them based on their request.

USER PREFERENCES:
"{{{preferences}}}"

AVAILABLE PRODUCTS (JSON format, one per line):
{{{products}}}
`,
});

// The main flow to handle the new structured AI response.
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
        const { output } = await productSelectorPrompt({ preferences, products: productListForPrompt });
        
        if (output && output.productIds && output.productIds.length > 0) {
            const productIds = output.productIds;
            
            // Create a map for efficient lookup and preserving order.
            const productMap = new Map(allProductsFlat.map(p => [p.id, p]));
            const orderedProducts = productIds.map(id => productMap.get(id)).filter((p): p is Product => !!p);

            if (orderedProducts.length > 0) {
                recommendedProducts = orderedProducts;
                // Use the AI-generated recommendation text
                recommendation = output.recommendation;
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
