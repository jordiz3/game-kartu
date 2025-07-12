'use server';
/**
 * @fileOverview Flow AI untuk menghasilkan puisi romantis berdasarkan kata kunci.
 *
 * - generatePoem - Fungsi yang menghasilkan puisi.
 * - GeneratePoemInput - Tipe input untuk fungsi generatePoem.
 * - GeneratePoemOutput - Tipe output untuk fungsi generatePoem.
 */

import { ai } from '../genkit';
import { z } from 'zod';
import { googleAI } from '@genkit-ai/googleai';

const GeneratePoemInputSchema = z.object({
  keywords: z.array(z.string()).describe('Array kata kunci untuk inspirasi puisi.'),
  coupleNames: z.object({
    person1: z.string().describe('Nama orang pertama.'),
    person2: z.string().describe('Nama orang kedua.'),
  }).describe('Nama pasangan yang akan dimasukkan dalam puisi.'),
});
export type GeneratePoemInput = z.infer<typeof GeneratePoemInputSchema>;

const GeneratePoemOutputSchema = z.object({
  title: z.string().describe('Judul puisi yang puitis dan singkat.'),
  poem: z.string().describe('Isi puisi dalam beberapa bait (minimal 2 bait).'),
});
export type GeneratePoemOutput = z.infer<typeof GeneratePoemOutputSchema>;

export async function generatePoem(input: GeneratePoemInput): Promise<GeneratePoemOutput> {
  return generatePoemFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePoemPrompt',
  model: googleAI.model('gemini-1.5-flash-latest'),
  input: { schema: GeneratePoemInputSchema },
  output: { schema: GeneratePoemOutputSchema },
  prompt: `You are a romantic Indonesian poet. Your task is to write a beautiful, short, and romantic poem for a couple named {{coupleNames.person1}} and {{coupleNames.person2}}.

Use the following keywords as inspiration for the poem's theme and imagery:
{{#each keywords}}
- {{this}}
{{/each}}

The poem must:
- Be written in Indonesian.
- Have a creative and romantic title.
- Consist of at least two stanzas (bait).
- Be touching and heartfelt, suitable for a loving couple.
- Weave the provided keywords naturally into the poem.

Do not add any preamble or explanation. Just provide the JSON output with a title and the poem.`,
});

const generatePoemFlow = ai.defineFlow(
  {
    name: 'generatePoemFlow',
    inputSchema: GeneratePoemInputSchema,
    outputSchema: GeneratePoemOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
