
'use server';

/**
 * @fileOverview Server action untuk fitur parafrase.
 * Berisi semua logika untuk berkomunikasi dengan Genkit dan Gemini AI.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Skema input yang divalidasi oleh Zod
export const ParaphraseInputSchema = z.object({
  text: z.string().describe('The original text or paragraph to be paraphrased.'),
});
export type ParaphraseInput = z.infer<typeof ParaphraseInputSchema>;

// Skema output yang diharapkan dari AI
export const ParaphraseOutputSchema = z.object({
  formal: z.string().describe('A version of the paragraph rewritten in a formal and professional style.'),
  simple: z.string().describe('A version of the paragraph rewritten in a simple and easy-to-understand style.'),
  creative: z.string().describe('A version of the paragraph rewritten in a more creative, imaginative, and expressive style.'),
});
export type ParaphraseOutput = z.infer<typeof ParaphraseOutputSchema>;


/**
 * Fungsi utama yang dipanggil oleh client untuk memparafrasekan paragraf.
 * @param input Objek yang berisi teks untuk diparafrase.
 * @returns Sebuah promise yang resolve menjadi objek dengan tiga versi parafrase.
 */
export async function paraphraseParagraph(input: ParaphraseInput): Promise<ParaphraseOutput> {
  // Validasi input menggunakan Zod.
  const validatedInput = ParaphraseInputSchema.parse(input);

  // Panggil model AI dengan prompt dan skema yang telah ditentukan.
  const { output } = await ai.generate({
    model: 'googleai/gemini-1.5-flash',
    prompt: `
      You are an expert linguist and professional writer.
      Your task is to paraphrase the given text into three different styles.
      Ensure each version has the same meaning as the original text but with different word choices, sentence structures, and nuances.

      Original Text:
      "${validatedInput.text}"

      Instructions:
      1.  **Formal Style**: Rewrite the text using standard, structured language suitable for academic or business contexts. Avoid slang and use a richer vocabulary.
      2.  **Simple Style**: Rewrite the text using straightforward, clear language that is easy for everyone to understand. Use short sentences and get straight to the point.
      3.  **Creative Style**: Rewrite the text in a more imaginative and expressive way. Use metaphors, analogies, or a storytelling style to convey the message in a unique and engaging manner.

      IMPORTANT: You must provide the final output as a valid JSON object that adheres to the defined output schema.
    `,
    output: {
      schema: ParaphraseOutputSchema,
    },
    config: {
        // Menggunakan temperatur yang sedikit lebih tinggi untuk hasil yang lebih kreatif.
        temperature: 0.8
    }
  });


  if (!output) {
    throw new Error('AI did not return a valid result. The output was null.');
  }

  return output;
}
