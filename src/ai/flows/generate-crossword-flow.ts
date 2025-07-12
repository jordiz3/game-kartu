'use server';
/**
 * @fileOverview Flow AI untuk menghasilkan teka-teki silang (TTS) secara dinamis.
 *
 * - generateCrossword - Fungsi yang mengambil daftar pertanyaan dan jawaban, lalu menghasilkan layout papan TTS.
 */

import { ai } from '../genkit';
import { z } from 'zod';
import { googleAI } from '@genkit-ai/googleai';

// Definisikan skema input dan output
const WordInputSchema = z.object({
  question: z.string().describe('Pertanyaan untuk teka-teki silang.'),
  answer: z.string().describe('Jawaban untuk teka-teki silang (satu kata).'),
});

const GenerateCrosswordInputSchema = z.array(WordInputSchema);

const WordPositionSchema = z.object({
  num: z.number().describe('Nomor urut pertanyaan di papan TTS.'),
  question: z.string().describe('Teks pertanyaan.'),
  answer: z.string().describe('Teks jawaban.'),
  direction: z.enum(['across', 'down']).describe('Arah kata (mendatar atau menurun).'),
  row: z.number().describe('Posisi baris (dimulai dari 0) dari huruf pertama.'),
  col: z.number().describe('Posisi kolom (dimulai dari 0) dari huruf pertama.'),
});

const GenerateCrosswordOutputSchema = z.object({
  grid: z.array(z.array(z.string())).describe("Layout papan TTS sebagai 2D array. Gunakan ' ' untuk sel kosong dan huruf untuk sel terisi."),
  words: z.array(WordPositionSchema).describe('Informasi detail untuk setiap kata dalam TTS.'),
});

export type GenerateCrosswordOutput = z.infer<typeof GenerateCrosswordOutputSchema>;

// Fungsi yang diekspor untuk dipanggil dari UI
export async function generateCrossword(input: z.infer<typeof GenerateCrosswordInputSchema>): Promise<GenerateCrosswordOutput> {
  return generateCrosswordFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCrosswordPrompt',
  model: googleAI.model('gemini-1.5-pro-latest'),
  input: { schema: GenerateCrosswordInputSchema },
  output: { schema: GenerateCrosswordOutputSchema },
  prompt: `You are an expert crossword puzzle generator. Your task is to take a list of questions and answers and create a valid, compact, and interlocking crossword puzzle grid.

RULES:
1.  All provided answers must be included in the grid.
2.  The grid should be as compact as possible.
3.  The output must be a valid JSON object matching the provided schema.
4.  The grid must be a 2D array of strings, where each string is a single character (a letter or a space for blank cells).
5.  The 'words' array must contain the placement information for every single answer.
6.  Number the words sequentially, starting from 1, based on their position from top-to-bottom, left-to-right.

Here is the list of questions and answers:
{{#each this}}
- Question: "{{question}}", Answer: "{{answer}}"
{{/each}}

Generate the crossword puzzle now.`,
});

const generateCrosswordFlow = ai.defineFlow(
  {
    name: 'generateCrosswordFlow',
    inputSchema: GenerateCrosswordInputSchema,
    outputSchema: GenerateCrosswordOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('AI failed to generate a crossword puzzle.');
    }
    return output;
  }
);
