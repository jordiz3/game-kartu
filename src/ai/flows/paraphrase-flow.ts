
'use server';

/**
 * @fileOverview A Genkit flow for paraphrasing text in different styles.
 *
 * - paraphraseParagraph - A function that takes a paragraph and returns three variations.
 * - ParaphraseInput - The input type for the flow.
 * - ParaphraseOutput - The return type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Define the input schema using Zod
const ParaphraseInputSchema = z.object({
  text: z.string().describe('The original text or paragraph to be paraphrased.'),
});
export type ParaphraseInput = z.infer<typeof ParaphraseInputSchema>;

// Define the output schema using Zod
const ParaphraseOutputSchema = z.object({
  formal: z.string().describe('A version of the paragraph rewritten in a formal and professional style.'),
  simple: z.string().describe('A version of the paragraph rewritten in a simple and easy-to-understand style.'),
  creative: z.string().describe('A version of the paragraph rewritten in a more creative, imaginative, and expressive style.'),
});
export type ParaphraseOutput = z.infer<typeof ParaphraseOutputSchema>;

// Wrapper function to be called from the frontend
export async function paraphraseParagraph(input: ParaphraseInput): Promise<ParaphraseOutput> {
  return paraphraseFlow(input);
}

// Define the prompt for the AI model
const paraphrasePrompt = ai.definePrompt({
  name: 'paraphrasePrompt',
  input: { schema: ParaphraseInputSchema },
  output: { schema: ParaphraseOutputSchema },
  prompt: `
    You are an expert linguist and professional writer.
    Your task is to paraphrase the given text into three different styles.
    Ensure each version has the same meaning as the original text but with different word choices, sentence structures, and nuances.

    Original Text:
    {{{text}}}

    Instructions:
    1.  **Formal Style**: Rewrite the text using standard, structured language suitable for academic or business contexts. Avoid slang and use a richer vocabulary.
    2.  **Simple Style**: Rewrite the text using straightforward, clear language that is easy for everyone to understand. Use short sentences and get straight to the point.
    3.  **Creative Style**: Rewrite the text in a more imaginative and expressive way. Use metaphors, analogies, or a storytelling style to convey the message in a unique and engaging manner.

    Make sure you produce the output in a JSON format that matches the requested schema.
  `,
});

// Define the Genkit flow
const paraphraseFlow = ai.defineFlow(
  {
    name: 'paraphraseFlow',
    inputSchema: ParaphraseInputSchema,
    outputSchema: ParaphraseOutputSchema,
  },
  async (input) => {
    // Call the prompt and wait for the AI model's response
    const { output } = await paraphrasePrompt(input);

    // Return the output if it exists, or throw an error if not
    if (!output) {
      throw new Error('Failed to generate paraphrase. The model did not provide an output.');
    }
    
    return output;
  }
);
