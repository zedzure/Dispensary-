
'use server';

/**
 * @fileOverview An AI-powered strain recommender flow that suggests specific products.
 *
 * - strainRecommender - A function that handles the strain recommendation process.
 * - StrainRecommenderOutput - The return type for the strainRecommender function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import { allProductsFlat } from '@/lib/products';
import type { Product } from '@/types/product';

// This schema defines the input that the Genkit flow will receive.
const StrainRecommenderFlowInputSchema = z.object({
  preferences: z.string().describe('A description of the user preferences and desired effects for cannabis strains.'),
  productsJSON: z.string().describe('A JSON string of available products with their key attributes.'),
});

// This is the schema for the LLM's direct output.
// We only ask for IDs to prevent hallucination of product details and reduce parsing errors.
const RecommendedProductIdSchema = z.object({
  id: z.string().describe('The ID of the recommended product.'),
});

const StrainRecommenderLLMOutputSchema = z.object({
  recommendation: z.string().describe('A summary of why these products are recommended based on the user preferences.'),
  products: z.array(RecommendedProductIdSchema).length(4).describe('An array of exactly 4 recommended product IDs from the provided list that best match the preferences.'),
});

// Zod schema for a single product, mirroring the Product type for the final output.
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

// This is the final output schema for the exported function, which the frontend expects.
const StrainRecommenderOutputSchema = z.object({
  recommendation: z.string(),
  products: z.array(ProductSchema),
});
export type StrainRecommenderOutput = z.infer<typeof StrainRecommenderOutputSchema>;

// Define the type for the input of our exported function.
export type StrainRecommenderInput = { preferences: string };

// This is the exported function that the frontend will call.
export async function strainRecommender(input: StrainRecommenderInput): Promise<StrainRecommenderOutput> {
  // Pass only the relevant product data to the model to save tokens and improve reliability.
  const productsForModel = allProductsFlat.map(({ id, name, category, type, thc }) => ({ id, name, category, type, thc }));
  
  return strainRecommenderFlow({
    preferences: input.preferences,
    productsJSON: JSON.stringify(productsForModel),
  });
}

const prompt = ai.definePrompt({
  name: 'strainRecommenderPrompt',
  input: {schema: StrainRecommenderFlowInputSchema},
  output: {schema: StrainRecommenderLLMOutputSchema},
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
    ],
  },
  prompt: `You are an expert cannabis sommelier for GreenLeaf Guide.
A user is looking for recommendations.
Their preferences are: "{{{preferences}}}"

Here is a list of all available products in JSON format. ONLY use products from this list.
{{{productsJSON}}}

Please analyze the user's preferences and the product list.
Your task is to:
1. Write a short, friendly, and insightful summary explaining your recommendation strategy.
2. Select exactly 4 product IDs from the list that best match the user's preferences.
3. Your response MUST be in the specified JSON format, containing the recommendation summary and an array of the 4 selected product objects. Each product object in the array should ONLY contain the 'id' field of the selected product.
`,
});

const strainRecommenderFlow = ai.defineFlow(
  {
    name: 'strainRecommenderFlow',
    inputSchema: StrainRecommenderFlowInputSchema,
    outputSchema: StrainRecommenderOutputSchema,
  },
  async (input) => {
    const { output: llmOutput } = await prompt(input);
    
    // Validate the LLM output.
    if (!llmOutput || llmOutput.products.length !== 4) {
      throw new Error('Failed to get a valid recommendation from the AI model.');
    }

    // Look up the full product details using the IDs returned by the model.
    // This is more robust than asking the model to return the full object.
    const recommendedProducts: Product[] = [];
    for (const p of llmOutput.products) {
        const product = allProductsFlat.find(
          (fullProduct) => fullProduct.id === p.id
        );
        if (product) {
            recommendedProducts.push(product);
        }
    }
    
    // Ensure we found all 4 products. If not, the model may have hallucinated an ID.
    if (recommendedProducts.length !== 4) {
        throw new Error(`AI recommended products with invalid IDs. Found ${recommendedProducts.length} valid products.`);
    }

    return {
      recommendation: llmOutput.recommendation,
      products: recommendedProducts,
    };
  }
);
    
