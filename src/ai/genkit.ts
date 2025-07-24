
/**
 * @fileoverview This file initializes the Genkit AI instance with the Google AI plugin.
 * It sets up the core AI functionality for the application.
 */
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

// Initialize Genkit with the Google AI plugin.
// This single `ai` instance will be used across the application
// to define and run AI flows, prompts, and other Genkit features.
export const ai = genkit({
  plugins: [
    googleAI(),
  ],
});
