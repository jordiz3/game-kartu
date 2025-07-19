/**
 * @fileoverview This file initializes and a aiconfigures the Genkit AI toolkit.
 *
 * It sets up the necessary plugins, in this case, the Google AI plugin for
 * integrating with Google's generative AI models (like Gemini). This centralized
 * setup allows other parts of the application to import and use the configured
 * `ai` object for defining and running AI flows.
 */
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

// Initialize the Genkit AI toolkit with the Google AI plugin.
// This makes Google's AI models available for use in flows.
export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GOOGLE_API_KEY,
    }),
  ],
  // Disable tracing to avoid issues with Jaeger exporter in build environments

});
