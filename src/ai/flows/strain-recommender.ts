'use server';

/**
 * @fileOverview An AI-powered strain recommender flow.
 *
 * - strainRecommender - A function that handles the strain recommendation process.
 * - StrainRecommenderInput - The input type for the strainRecommender function.
 * - StrainRecommenderOutput - The return type for the strainRecommender function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StrainRecommenderInputSchema = z.object({
  preferences: z
    .string()
    .describe(
      'A description of the user preferences and desired effects for cannabis strains.'
    ),
});
export type StrainRecommenderInput = z.infer<typeof StrainRecommenderInputSchema>;

const StrainRecommenderOutputSchema = z.object({
  strainSuggestions: z
    .array(z.string())
    .describe('A list of cannabis strain suggestions based on the user preferences.'),
  reasons: z
    .array(z.string())
    .describe('Reasons for suggesting each strain, based on the user preferences.'),
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

  Based on the user's preferences and desired effects, suggest a list of cannabis strains that the user might prefer.
  Include reasons for each suggestion.

  User Preferences: {{{preferences}}}

  Format your response as a JSON object that contains two lists:
  - strainSuggestions: A list of strain names
  - reasons: A list of reasons for each strain recommendation.
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
