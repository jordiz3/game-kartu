
'use server';

/**
 * @fileOverview A Genkit flow for paraphrasing text in different styles.
 * This file defines the core AI logic and is only meant to be called from server-side code.
 *
 * - callParaphraseFlow - The exported function to call the Genkit flow.
 * - ParaphraseInput - The input type for the flow.
 * - ParaphraseOutput - The return type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Define the input schema using Zod
export const ParaphraseInputSchema = z.object({
  text: z.string().describe('The original text or paragraph to be paraphrased.'),
});
export type ParaphraseInput = z.infer<typeof ParaphraseInputSchema>;

// Define the output schema using Zod
export const ParaphraseOutputSchema = z.object({
  formal: z.string().describe('A version of the paragraph rewritten in a formal and professional style.'),
  simple: z.string().describe('A version of the paragraph rewritten in a simple and easy-to-understand style.'),
  creative: z.string().describe('A version of the paragraph rewritten in a more creative, imaginative, and expressive style.'),
});
export type ParaphraseOutput = z.infer<typeof ParaphraseOutputSchema>;


// Define the prompt with structured input and output using Zod schemas.
const paraphrasePrompt = ai.definePrompt({
  name: 'paraphrasePrompt',
  input: { schema: ParaphraseInputSchema },
  output: { schema: ParaphraseOutputSchema },
  prompt: `
    You are an expert linguist and professional writer.
    Your task is to paraphrase the given text into three different styles.
    Ensure each version has the same meaning as the original text but with different word choices, sentence structures, and nuances.

    Original Text:
    "{{{text}}}"

    Instructions:
    1.  **Formal Style**: Rewrite the text using standard, structured language suitable for academic or business contexts. Avoid slang and use a richer vocabulary.
    2.  **Simple Style**: Rewrite the text using straightforward, clear language that is easy for everyone to understand. Use short sentences and get straight to the point.
    3.  **Creative Style**: Rewrite the text in a more imaginative and expressive way. Use metaphors, analogies, or a storytelling style to convey the message in a unique and engaging manner.

    IMPORTANT: You must provide the final output as a valid JSON object that adheres to the defined output schema.
  `,
});

// Define the Genkit flow that orchestrates the AI call.
const paraphraseFlow = ai.defineFlow(
  {
    name: 'paraphraseFlow',
    inputSchema: ParaphraseInputSchema,
    outputSchema: ParaphraseOutputSchema,
  },
  async (input) => {
    const { output } = await paraphrasePrompt(input);
    if (!output) {
      throw new Error('Failed to generate paraphrase. The model did not provide an output.');
    }
    return output;
  }
);

// Exported wrapper function to be called by server actions.
export async function callParaphraseFlow(input: ParaphraseInput): Promise<ParaphraseOutput> {
    return paraphraseFlow(input);
}
