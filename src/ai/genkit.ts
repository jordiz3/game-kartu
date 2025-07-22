
/**
 * @fileoverview This file initializes the Genkit AI instance with the Google AI plugin.
 * It sets up the core AI functionality for the application.
 */
import {genkit, ai} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Initialize Genkit with the Google AI plugin.
// This single `ai` instance will be used across the application
// to define and run AI flows, prompts, and other Genkit features.
ai.init({
  plugins: [
    googleAI(),
  ],
  // Log events to the console for debugging.
  // Set to 'warn' or 'error' in production.
  logLevel: 'debug',
  // Prevent Genkit from reporting telemetry data.
  // Set to `false` if you want to help improve Genkit.
  enableTelemetry: false,
});
