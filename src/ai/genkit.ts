/**
 * @fileoverview Initializes and exports the Genkit AI instance.
 * This file uses conditional initialization to prevent build errors
 * related to secret access. During build, a mock AI object is used.
 * In production, the real Genkit instance is initialized.
 */
import {genkit, type Genkit as GenkitType} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

let ai: GenkitType;

// Initialize Genkit conditionally to avoid secret access issues during build.
// Genkit will only be initialized when the app is running in a server environment (runtime).
if (process.env.NODE_ENV === 'production') {
  ai = genkit({
    plugins: [googleAI()],
  });
} else {
  // Provide a mock/dummy ai object during build or in non-production environments
  // to prevent the application from crashing when trying to access `ai`.
  ai = {
    generate: async () => {
      console.log('AI called in non-production environment. Returning mock data.');
      return {
        output: () => ({
          model1: 'Contoh hasil parafrase model 1 dari mode pengembangan.',
          model2: 'Contoh hasil parafrase model 2 dari mode pengembangan.',
          model3: 'Contoh hasil parafrase model 3 dari mode pengembangan.',
        }),
      };
    },
  } as any;
}

export {ai};
