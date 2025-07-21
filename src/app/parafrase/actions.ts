'use server';

/**
 * @fileOverview Server action untuk fitur parafrase menggunakan Google Generative AI SDK.
 */
import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';

// Skema Zod untuk input, digunakan untuk validasi.
export const ParaphraseInputSchema = z.object({
  text: z.string().min(10, { message: 'Teks harus minimal 10 karakter.' }),
});

// Tipe didefinisikan di sini untuk digunakan oleh server action dan client.
export type ParaphraseInput = z.infer<typeof ParaphraseInputSchema>;

// Skema Zod untuk output, digunakan untuk memastikan AI mengembalikan format yang benar.
// Kita tidak bisa memaksa model untuk menggunakan ini, tapi kita bisa menggunakannya untuk validasi.
export const ParaphraseOutputSchema = z.object({
  model1: z.string(),
  model2: z.string(),
  model3: z.string(),
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
  // Validasi input menggunakan Zod
  const validationResult = ParaphraseInputSchema.safeParse(input);
  if (!validationResult.success) {
    throw new Error(validationResult.error.issues[0].message);
  }

  // Menambahkan pemeriksaan untuk API key
  if (!process.env.GOOGLE_API_KEY) {
    throw new Error('Kunci API Google tidak dikonfigurasi di server.');
  }

  // Inisialisasi Google Generative AI
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `
      Anda adalah seorang ahli bahasa Indonesia yang sangat pandai membantu mahasiswa mengerjakan skripsi.
      Tugas Anda adalah memparafrasekan teks yang diberikan ke dalam gaya bahasa formal, namun tidak terlalu kaku atau ilmiah. Gunakan gaya bahasa yang umum dipakai mahasiswa dalam penulisan tugas akhir: terstruktur, baku, tetapi tetap mudah dibaca.

      Teks Asli:
      "${input.text}"

      Instruksi:
      Buatlah TIGA model atau versi parafrase yang berbeda dari teks asli tersebut. Setiap model harus memiliki pilihan kata dan struktur kalimat yang sedikit berbeda satu sama lain, namun tetap mempertahankan makna asli dan gaya formal khas mahasiswa.

      PENTING: Berikan output HANYA sebagai objek JSON yang valid dengan kunci "model1", "model2", dan "model3". Jangan tambahkan markdown atau teks lain di luar JSON. Contoh: {"model1": "...", "model2": "...", "model3": "..."}
    `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Membersihkan string respons dari markdown backticks jika ada
    const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();

    const parsedJson = JSON.parse(cleanedText);
    
    // Validasi output dari AI
    const validationOutput = ParaphraseOutputSchema.safeParse(parsedJson);
    if (!validationOutput.success) {
      console.error('AI response validation error:', validationOutput.error);
      throw new Error('AI memberikan respons dalam format yang tidak diharapkan.');
    }

    return validationOutput.data;
  } catch (error) {
    console.error('Error saat menghubungi Google Generative AI:', error);
    throw new Error('Gagal menghubungi AI. Mungkin ada masalah dengan API key atau permintaan.');
  }
}
