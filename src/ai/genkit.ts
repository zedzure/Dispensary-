import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-1.5-flash-latest',
  telemetry: {
    // Disable OpenTelemetry instrumentation which can interfere with Next.js
    instrumentation: false,
  },
});
