
'use server';

import {genkit, type Genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

/**
 * This file is server-only.
 * It initializes the Genkit AI instance with the Google AI plugin.
 * The 'use server' directive ensures this module is never included in the client-side bundle.
 */

const ai = genkit({
  plugins: [googleAI()],
  model: process.env.GENKIT_MODEL || 'googleai/gemini-2.5-flash-preview',
});

export {ai};
