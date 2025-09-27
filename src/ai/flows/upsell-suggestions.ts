
'use server';

/**
 * @fileOverview An AI-powered upsell suggestion flow.
 * This file implements a flow that suggests additional products based on items currently in a cart.
 *
 * - upsellSuggestions - The main function that handles the suggestion process.
 * - UpsellSuggestionsInput - The input type for the upsellSuggestions function.
 * - UpsellSuggestionsOutput - The return type for the upsellSuggestions function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { allProductsFlat } from '@/lib/products';

// Input/Output schemas for the exported function
const UpsellSuggestionsInputSchema = z.object({
  productNames: z.array(z.string()).describe("A list of product names currently in the user's cart."),
});
export type UpsellSuggestionsInput = z.infer<typeof UpsellSuggestionsInputSchema>;

export const UpsellSuggestionsOutputSchema = z.object({
  reasoning: z.string().describe("A brief, friendly explanation for why the suggested products are a good fit."),
  suggestions: z.array(z.string()).describe("An array of 1 to 3 product names to suggest as an upsell."),
});
export type UpsellSuggestionsOutput = z.infer<typeof UpsellSuggestionsOutputSchema>;

// Exported function calls the flow
export async function upsellSuggestions(input: UpsellSuggestionsInput): Promise<UpsellSuggestionsOutput> {
  return upsellSuggestionsFlow(input);
}


// --- AI and Flow Logic ---

// Prepare a string of all products for the AI prompt.
const productListForPrompt = allProductsFlat.map(p => p.name).join(', ');

// Prompt for the AI to select products and generate a recommendation.
const upsellPrompt = ai.definePrompt({
    name: 'upsellPrompt',
    input: { schema: z.object({ productNames: z.array(z.string()), products: z.string() }) },
    output: { schema: UpsellSuggestionsOutputSchema },
    config: {
        safetySettings: [ { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' } ],
    },
    prompt: `You are an expert cannabis budtender. A customer has the following items in their cart: {{{productNames}}}.

Based on these items, provide a helpful and brief "reasoning" text and suggest 1 to 3 additional products (by name only) from the available product list that would complement their purchase. For example, if they have flower, suggest a grinder or papers. If they have a vape, suggest another cartridge.

Your response MUST be a valid JSON object matching this schema: { "reasoning": "Your friendly message here.", "suggestions": ["Product Name 1", "Product Name 2"] }

AVAILABLE PRODUCTS:
{{{products}}}
`,
});

// The main flow to handle the AI response.
const upsellSuggestionsFlow = ai.defineFlow(
  {
    name: 'upsellSuggestionsFlow',
    inputSchema: UpsellSuggestionsInputSchema,
    outputSchema: UpsellSuggestionsOutputSchema,
  },
  async ({ productNames }: UpsellSuggestionsInput) => {
    
    // Do not run if cart is empty
    if (productNames.length === 0) {
        return {
            reasoning: "",
            suggestions: [],
        }
    }

    const { output } = await upsellPrompt({ productNames, products: productListForPrompt });
    
    if (!output) {
      throw new Error("AI failed to return an output for upsell suggestions.");
    }
    
    return output;
  }
);
