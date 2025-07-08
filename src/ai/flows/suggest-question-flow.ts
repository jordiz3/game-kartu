'use server';
/**
 * @fileOverview Flow untuk menyarankan pertanyaan menggunakan AI.
 *
 * - suggestQuestion - Fungsi yang menghasilkan pertanyaan.
 * - SuggestQuestionInput - Tipe input untuk fungsi suggestQuestion.
 * - SuggestQuestionOutput - Tipe output untuk fungsi suggestQuestion.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const SuggestQuestionInputSchema = z.object({
  currentUser: z.string().describe('Pengguna yang saat ini aktif, "cipa" atau "jojo".'),
  recipient: z.string().describe('Penerima pertanyaan, "cipa" atau "jojo".'),
});
export type SuggestQuestionInput = z.infer<typeof SuggestQuestionInputSchema>;

const SuggestQuestionOutputSchema = z.object({
  suggestedQuestion: z
    .string()
    .describe('Satu pertanyaan yang disarankan dalam Bahasa Indonesia.'),
});
export type SuggestQuestionOutput = z.infer<typeof SuggestQuestionOutputSchema>;

export async function suggestQuestion(input: SuggestQuestionInput): Promise<SuggestQuestionOutput> {
  return suggestQuestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestQuestionPrompt',
  input: { schema: SuggestQuestionInputSchema },
  output: { schema: SuggestQuestionOutputSchema },
  prompt: `You are a creative and playful assistant helping a couple, Cipa and Jojo, find fun questions to ask each other. The current user is {{currentUser}}. They want to ask a question to {{recipient}}.

Generate one single, creative, and slightly romantic question in Indonesian.

The question should be something that sparks a fun conversation. Do not add any preamble, explanation, or quotation marks. Just output the question text.
`,
});

const suggestQuestionFlow = ai.defineFlow(
  {
    name: 'suggestQuestionFlow',
    inputSchema: SuggestQuestionInputSchema,
    outputSchema: SuggestQuestionOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
