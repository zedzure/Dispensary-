
'use server';

/**
 * @fileOverview An AI-powered strain recommender flow.
 * This file implements a more robust, two-step recommendation process.
 * 1. The AI first generates ideal criteria based on user preferences.
 * 2. The code then programmatically filters the product list based on these criteria.
 * This approach is more reliable than asking the AI to select from a large list directly.
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

// Step 1: AI generates criteria
const IdealCriteriaSchema = z.object({
  type: z.preprocess(
    (val) => (typeof val === 'string' ? val : 'Any'),
    z.enum(['Sativa', 'Indica', 'Hybrid', 'Any'])
  ).describe("The ideal cannabis type. Must be one of: Sativa, Indica, Hybrid, Any."),
  thc_level: z.preprocess(
    (val) => (typeof val === 'string' ? val.toLowerCase() : 'any'),
    z.enum(['low', 'moderate', 'high', 'any'])
  ).describe("The user's preferred THC level. Must be one of: low, moderate, high, any."),
  keywords: z.array(z.string()).describe('A list of 2-3 keywords from the user preferences to help find matching products (e.g., "anxiety", "sleep", "fruity").')
});

const criteriaGeneratorPrompt = ai.definePrompt({
    name: 'criteriaGeneratorPrompt',
    input: { schema: z.object({ preferences: z.string() }) },
    output: { schema: IdealCriteriaSchema },
    config: {
        safetySettings: [ { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' } ],
    },
    prompt: `Analyze the user's request for a cannabis product and determine the ideal criteria for a recommendation.
User Request: "{{{preferences}}}"
- For the type, choose one of: Sativa, Indica, Hybrid, or Any.
- For the thc_level, choose one of: low, moderate, high, or any (use lowercase).
- For keywords, extract 2-3 relevant keywords from the request.
Default to 'Any' or 'any' if a specific preference is not mentioned.`,
});

// Step 2: Code scores products
function scoreProduct(product: Product, criteria: z.infer<typeof IdealCriteriaSchema>): number {
    let score = 0;
    const productText = `${product.name} ${product.description} ${product.type}`.toLowerCase();

    if (criteria.type !== 'Any' && product.type?.toLowerCase() === criteria.type.toLowerCase()) {
        score += 5;
    }

    const thc = product.thc ?? 0;
    if (criteria.thc_level !== 'any') {
        if (criteria.thc_level === 'low' && thc < 18) score += 3;
        if (criteria.thc_level === 'moderate' && thc >= 18 && thc <= 25) score += 3;
        if (criteria.thc_level === 'high' && thc > 25) score += 3;
    }

    criteria.keywords.forEach(keyword => {
        if (productText.includes(keyword.toLowerCase())) {
            score += 2;
        }
    });

    return score;
}

// Step 3: AI generates summary
const summaryGeneratorPrompt = ai.definePrompt({
    name: 'summaryGeneratorPrompt',
    input: { schema: z.object({ preferences: z.string(), products: z.array(ProductSchema) }) },
    output: { schema: z.object({ recommendation: z.string() }) },
    config: {
        safetySettings: [ { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' } ],
    },
    prompt: `You are a helpful cannabis expert. A user described what they want, and you have selected the following products.
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
    // Step 1: Generate criteria from the user's preferences.
    const { output: criteria } = await criteriaGeneratorPrompt({ preferences });
    if (!criteria) {
      throw new Error('AI failed to determine criteria. Please try rephrasing your request.');
    }

    // Step 2: Score products based on the AI-generated criteria.
    const scoredProducts = allProductsFlat.map(p => ({ product: p, score: scoreProduct(p, criteria) }));
    const sortedProducts = scoredProducts.filter(p => p.score > 0).sort((a, b) => b.score - a.score);
    const recommendedProducts = sortedProducts.slice(0, 4).map(p => p.product);

    // Step 3: Handle the case where no products match.
    if (recommendedProducts.length === 0) {
      // If no products get a positive score, return a helpful message instead of erroring.
      return {
        recommendation: "We couldn't find any products that currently match your preferences. Please try being more specific or using different keywords.",
        products: [],
      };
    }
    
    // Step 4: Generate a friendly summary for the recommended products.
    const { output: summary } = await summaryGeneratorPrompt({ preferences, products: recommendedProducts });
    if (!summary) {
      throw new Error('AI failed to generate a recommendation summary.');
    }

    // Return the final result.
    return {
      recommendation: summary.recommendation,
      products: recommendedProducts,
    };
  }
);
