/**
 * @fileoverview This file initializes and a aiconfigures the Genkit AI toolkit.
 *
 * It sets up the necessary plugins, in this case, the Google AI plugin for
 * integrating with Google's generative AI models (like Gemini). This centralized
 * setup allows other parts of the application to import and use the configured
 * `ai` object for defining and running AI flows.
 */
import { genkit, type Genkit as GenkitType } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

let ai: GenkitType;

// Conditionally initialize Genkit only in a server environment, not during build.
// The build process in App Hosting may not have access to secrets, causing errors.
// By checking for NODE_ENV, we ensure Genkit and its plugins (which need the API key)
// are only set up when the application is actually running.
if (process.env.NODE_ENV === 'production') {
  ai = genkit({
    plugins: [
      googleAI(),
    ],
  });
} else {
  // Provide a mock/dummy ai object during build or in non-production environments
  // to prevent the application from crashing when trying to access `ai`.
  ai = {} as GenkitType;
}


export { ai };
