
'use server';

/**
 * @fileOverview Server action untuk fitur parafrase.
 * Berisi semua logika untuk berkomunikasi dengan Genkit dan Gemini AI.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Skema Zod didefinisikan di sini untuk digunakan oleh server action, tetapi tidak diekspor.
const ParaphraseInputSchema = z.object({
  text: z.string().describe('Teks asli yang akan diparafrase.'),
});
type ParaphraseInput = z.infer<typeof ParaphraseInputSchema>;

const ParaphraseOutputSchema = z.object({
  formal: z.string().describe('Sebuah versi paragraf yang ditulis ulang dengan gaya formal dan ilmiah, cocok untuk skripsi.'),
  simple: z.string().describe('Sebuah versi paragraf yang ditulis ulang dengan gaya yang sederhana dan mudah dipahami.'),
  creative: z.string().describe('Sebuah versi paragraf yang ditulis ulang dengan gaya yang lebih kreatif, imajinatif, dan ekspresif.'),
});
type ParaphraseOutput = z.infer<typeof ParaphraseOutputSchema>;


/**
 * Fungsi utama yang dipanggil oleh client untuk memparafrasekan paragraf.
 * @param input Objek yang berisi teks untuk diparafrase.
 * @returns Sebuah promise yang resolve menjadi objek dengan tiga versi parafrase.
 */
export async function paraphraseParagraph(input: ParaphraseInput): Promise<ParaphraseOutput> {
  // Panggil model AI dengan prompt dan skema yang telah ditentukan.
  const { output } = await ai.generate({
    model: 'googleai/gemini-1.5-flash',
    prompt: `
      Anda adalah seorang ahli bahasa dan penulis akademik profesional berbahasa Indonesia.
      Tugas Anda adalah memparafrasekan teks yang diberikan ke dalam tiga gaya berbeda dalam Bahasa Indonesia.
      Pastikan setiap versi memiliki makna yang sama dengan teks asli tetapi dengan pilihan kata, struktur kalimat, dan nuansa yang berbeda.

      Teks Asli:
      "${input.text}"

      Instruksi:
      1.  **Gaya Formal (Ilmiah)**: Tulis ulang teks menggunakan bahasa baku dan terstruktur yang cocok untuk konteks akademik atau skripsi. Hindari bahasa gaul dan gunakan kosakata yang lebih kaya.
      2.  **Gaya Sederhana**: Tulis ulang teks menggunakan bahasa yang lugas dan jelas agar mudah dipahami semua orang. Gunakan kalimat pendek dan langsung ke intinya.
      3.  **Gaya Kreatif**: Tulis ulang teks dengan cara yang lebih imajinatif dan ekspresif. Gunakan metafora, analogi, atau gaya bercerita untuk menyampaikan pesan dengan cara yang unik dan menarik.

      PENTING: Anda harus memberikan output akhir sebagai objek JSON yang valid dan mematuhi skema output yang telah ditentukan.
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
    throw new Error('AI tidak mengembalikan hasil yang valid. Output bernilai null.');
  }

  return output;
}
