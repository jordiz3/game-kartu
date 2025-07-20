'use server';

/**
 * @fileOverview Server action untuk fitur parafrase.
 * Berisi semua logika untuk berkomunikasi dengan Genkit dan Gemini AI,
 * termasuk definisi schema dan tipe data.
 */
import {ai} from '@/ai/genkit';
import {z} from 'zod';

// Skema Zod untuk input, digunakan untuk validasi.
export const ParaphraseInputSchema = z.object({
  text: z.string().min(10, {message: 'Teks harus minimal 10 karakter.'}),
});

// Tipe didefinisikan di sini untuk digunakan oleh server action dan client.
export type ParaphraseInput = z.infer<typeof ParaphraseInputSchema>;

// Skema Zod untuk output, digunakan untuk memastikan AI mengembalikan format yang benar.
export const ParaphraseOutputSchema = z.object({
  model1: z
    .string()
    .describe('Versi parafrase pertama dengan gaya formal khas mahasiswa.'),
  model2: z
    .string()
    .describe(
      'Versi parafrase kedua yang sedikit berbeda, juga dengan gaya formal khas mahasiswa.'
    ),
  model3: z
    .string()
    .describe(
      'Versi parafrase ketiga yang unik, juga dengan gaya formal khas mahasiswa.'
    ),
});

export type ParaphraseOutput = z.infer<typeof ParaphraseOutputSchema>;

/**
 * Fungsi utama yang dipanggil oleh client untuk memparafrasekan paragraf.
 * @param input Objek yang berisi teks untuk diparafrase.
 * @returns Sebuah promise yang resolve menjadi objek dengan tiga model parafrase.
 */
export async function paraphraseParagraph(
  input: ParaphraseInput
): Promise<ParaphraseOutput> {
  const {output} = await ai.generate({
    model: 'googleai/gemini-1.5-flash',
    prompt: `
      Anda adalah seorang ahli bahasa Indonesia yang sangat pandai membantu mahasiswa mengerjakan skripsi.
      Tugas Anda adalah memparafrasekan teks yang diberikan ke dalam gaya bahasa formal, namun tidak terlalu kaku atau ilmiah. Gunakan gaya bahasa yang umum dipakai mahasiswa dalam penulisan tugas akhir: terstruktur, baku, tetapi tetap mudah dibaca.

      Teks Asli:
      "${input.text}"

      Instruksi:
      Buatlah TIGA model atau versi parafrase yang berbeda dari teks asli tersebut. Setiap model harus memiliki pilihan kata dan struktur kalimat yang sedikit berbeda satu sama lain, namun tetap mempertahankan makna asli dan gaya formal khas mahasiswa.

      PENTING: Anda harus memberikan output akhir sebagai objek JSON yang valid dan mematuhi skema output yang telah ditentukan, dengan kunci "model1", "model2", dan "model3".
    `,
    output: {
      schema: ParaphraseOutputSchema,
    },
    config: {
      temperature: 0.8,
    },
  });

  if (!output) {
    throw new Error(
      'AI tidak mengembalikan hasil yang valid. Output bernilai null.'
    );
  }

  return output;
}
