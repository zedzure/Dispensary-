'use server';

/**
 * @fileOverview An AI-powered strain recommender flow.
 *
 * - strainRecommender - A function that handles the strain recommendation process.
 * - StrainRecommenderInput - The input type for the strainRecommender function.
 * - StrainRecommenderOutput - The return type for the strainRecommender function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const StrainRecommenderInputSchema = z.object({
  preferences: z
    .string()
    .describe(
      'A description of the user preferences and desired effects for cannabis strains.'
    ),
});
export type StrainRecommenderInput = z.infer<typeof StrainRecommenderInputSchema>;

const StrainRecommenderOutputSchema = z.object({
  recommendations: z.array(
    z.object({
      strain: z.string().describe('The name of the recommended cannabis strain.'),
      reason: z.string().describe('The reason for recommending this specific strain.'),
    })
  ).describe('A list of strain recommendations, each with a strain name and a reason.'),
});
export type StrainRecommenderOutput = z.infer<typeof StrainRecommenderOutputSchema>;

export async function strainRecommender(input: StrainRecommenderInput): Promise<StrainRecommenderOutput> {
  return strainRecommenderFlow(input);
}

const prompt = ai.definePrompt({
  name: 'strainRecommenderPrompt',
  input: {schema: StrainRecommenderInputSchema},
  output: {schema: StrainRecommenderOutputSchema},
  prompt: `You are an expert cannabis strain recommender.

  Based on the user's preferences and desired effects, suggest a list of cannabis strains that the user might prefer. For each suggestion, provide the strain name and a reason for the recommendation.

  User Preferences: {{{preferences}}}

  Format your response as a JSON object containing a list of recommendations. Each recommendation should be an object with "strain" and "reason" fields.
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
