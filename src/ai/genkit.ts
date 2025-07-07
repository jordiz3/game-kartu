// This file is not used in the "Kotak Rahasia" app.
// It can be removed or kept for future Genkit features.
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.0-flash',
});
