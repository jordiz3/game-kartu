/**
 * @fileoverview Initializes and exports the Genkit AI instance.
 * This file uses conditional initialization to prevent build errors
 * related to secret access. During build, a mock AI object is used.
 * In production, the real Genkit instance is initialized.
 */
import {genkit, type Genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

let ai: Genkit;

// Conditionally initialize Genkit to avoid secret access issues during build
// and ensure a valid AI object is available in all environments.
if (process.env.NODE_ENV === 'production') {
  // In production, initialize Genkit with the real plugin and API key.
  ai = genkit({
    plugins: [googleAI()],
  });
} else {
  // During build or in non-production environments, provide a mock 'ai' object
  // to prevent build errors and allow for local testing without secrets.
  ai = {
    generate: async (options: any) => {
      console.log('AI called in non-production environment. Returning mock data.');
      // This mock response matches the ParaphraseOutputSchema structure.
      const mockOutput = {
        model1: 'Contoh hasil parafrase model 1 dari mode pengembangan.',
        model2: 'Contoh hasil parafrase model 2 dari mode pengembangan.',
        model3: 'Contoh hasil parafrase model 3 dari mode pengembangan.',
      };
      
      return {
        output: () => mockOutput,
        text: () => JSON.stringify(mockOutput),
      };
    },
    // Add mock implementations for other ai functions if they are used elsewhere.
  } as any;
}

export {ai};
