
import {genkit, type Genkit} from 'genkit';
import {googleAI, type GoogleAIPlugin} from '@genkit-ai/googleai';

let ai: Genkit<[GoogleAIPlugin]>;

if (typeof process === 'undefined') {
  ai = genkit({
    model: process.env.GENKIT_MODEL || 'googleai/gemini-2.5-flash-preview',
  });
} else {
  ai = genkit({
    plugins: [googleAI()],
    model: process.env.GENKIT_MODEL || 'googleai/gemini-2.5-flash-preview',
  });
}

export {ai};
