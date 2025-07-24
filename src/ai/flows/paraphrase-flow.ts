
'use server';
/**
 * @fileOverview A flow for paraphrasing text for academic writing.
 *
 * - paraphrase - A function that handles the paraphrasing process.
 * - ParaphraseInput - The input type for the paraphrase function.
 * - ParaphraseOutput - The return type for the paraphrase function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ParaphraseInputSchema = z.object({
  text: z.string().min(10, { message: 'Teks harus minimal 10 karakter.' }),
});
type ParaphraseInput = z.infer<typeof ParaphraseInputSchema>;

const ParaphraseOutputSchema = z.object({
  model1: z.string().describe('The first paraphrased version.'),
  model2: z.string().describe('The second paraphrased version.'),
  model3: z.string().describe('The third paraphrased version.'),
});
type ParaphraseOutput = z.infer<typeof ParaphraseOutputSchema>;

export async function paraphrase(input: ParaphraseInput): Promise<ParaphraseOutput> {
  return paraphraseFlow(input);
}

const paraphrasePrompt = ai.definePrompt({
  name: 'paraphrasePrompt',
  input: { schema: ParaphraseInputSchema },
  output: { schema: ParaphraseOutputSchema },
  prompt: `You are an expert in the Indonesian language, specializing in helping university students with their theses.
Your task is to paraphrase the given text into a formal style, but not too stiff or overly scientific. Use a style commonly found in final papers: structured, standard, yet still easy to read.

Original Text:
"{{{text}}}"

Instructions:
Create THREE different models or versions of the paraphrase from the original text. Each model should have slightly different word choices and sentence structures, while maintaining the original meaning and the formal style typical for students.
`,
});

const paraphraseFlow = ai.defineFlow(
  {
    name: 'paraphraseFlow',
    inputSchema: ParaphraseInputSchema,
    outputSchema: ParaphraseOutputSchema,
  },
  async (input) => {
    const { output } = await paraphrasePrompt(input);
    if (!output) {
      throw new Error('The AI did not return a valid output.');
    }
    return output;
  }
);
