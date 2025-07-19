
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

// Mendefinisikan skema input menggunakan Zod
const ParaphraseInputSchema = z.object({
  text: z.string().describe('Teks atau paragraf asli yang akan diparafrase.'),
});
export type ParaphraseInput = z.infer<typeof ParaphraseInputSchema>;

// Mendefinisikan skema output menggunakan Zod
const ParaphraseOutputSchema = z.object({
  formal: z.string().describe('Versi paragraf yang ditulis ulang dengan gaya formal dan profesional.'),
  simple: z.string().describe('Versi paragraf yang ditulis ulang dengan gaya yang sederhana dan mudah dimengerti.'),
  creative: z.string().describe('Versi paragraf yang ditulis ulang dengan gaya yang lebih kreatif, imajinatif, dan ekspresif.'),
});
export type ParaphraseOutput = z.infer<typeof ParaphraseOutputSchema>;

// Fungsi wrapper yang akan dipanggil dari frontend
export async function paraphraseParagraph(input: ParaphraseInput): Promise<ParaphraseOutput> {
  return paraphraseFlow(input);
}

// Mendefinisikan prompt untuk model AI
const paraphrasePrompt = ai.definePrompt({
  name: 'paraphrasePrompt',
  input: { schema: ParaphraseInputSchema },
  output: { schema: ParaphraseOutputSchema },
  prompt: `
    Anda adalah seorang ahli bahasa dan penulis profesional.
    Tugas Anda adalah memparafrasekan teks yang diberikan ke dalam tiga gaya yang berbeda.
    Pastikan setiap versi memiliki makna yang sama dengan teks asli tetapi dengan pilihan kata, struktur kalimat, dan nuansa yang berbeda.

    Teks Asli:
    {{{text}}}

    Instruksi:
    1.  **Gaya Formal**: Tulis ulang teks dengan bahasa yang baku, terstruktur, dan cocok untuk konteks akademis atau bisnis. Hindari bahasa gaul dan gunakan kosa kata yang lebih kaya.
    2.  **Gaya Sederhana**: Tulis ulang teks dengan bahasa yang lugas, jelas, dan mudah dipahami oleh semua kalangan. Gunakan kalimat-kalimat pendek dan langsung ke intinya.
    3.  **Gaya Kreatif**: Tulis ulang teks dengan cara yang lebih imajinatif dan ekspresif. Gunakan metafora, analogi, atau gaya bercerita untuk menyampaikan pesan dengan cara yang unik dan menarik.

    Pastikan Anda menghasilkan output dalam format JSON yang sesuai dengan skema yang diminta.
  `,
});

// Mendefinisikan flow Genkit
const paraphraseFlow = ai.defineFlow(
  {
    name: 'paraphraseFlow',
    inputSchema: ParaphraseInputSchema,
    outputSchema: ParaphraseOutputSchema,
  },
  async (input) => {
    // Memanggil prompt dan menunggu respons dari model AI
    const { output } = await paraphrasePrompt(input);

    // Mengembalikan output jika ada, atau melempar error jika tidak ada output
    if (!output) {
      throw new Error('Gagal menghasilkan parafrase. Model tidak memberikan output.');
    }
    
    return output;
  }
);
