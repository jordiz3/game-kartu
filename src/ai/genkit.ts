/**
 * @fileoverview This file initializes and configures the Genkit AI toolkit.
 *
 * It sets up the necessary plugins, in this case, the Google AI plugin for
 * integrating with Google's generative AI models (like Gemini). This centralized
 * setup allows other parts of the application to import and use the configured
 * `ai` object for defining and running AI flows.
 */
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Initialize the Genkit AI toolkit with the Google AI plugin.
// This makes Google's AI models available for use in flows.
// The GENKIT_ENV environment variable is used to determine the environment.
// For development (`dev`), it enables features like the Flow Inspector.
// For production, it optimizes for performance and stability.
export const ai = genkit({
  plugins: [
    googleAI({
      // The API key is automatically sourced from the GOOGLE_API_KEY
      // environment variable if required.
    }),
  ],
  // Log level for Genkit's internal operations.
  // 'debug' is useful for development to see detailed logs.
  // 'info' or 'warn' is recommended for production.
  logLevel: 'debug',
  // Enable OpenTelemetry for tracing and metrics. This is crucial for
  // monitoring and debugging AI flows in production.
  enableTraceStore: true,
});
