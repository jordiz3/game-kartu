'use server';

/**
 * @fileOverview Server action untuk fitur parafrase menggunakan Google Generative AI SDK.
 * File ini menggunakan pola "function factory" untuk memastikan API key dimuat dengan andal
 * saat server dimulai, menghindari masalah dengan process.env saat runtime.
 */
import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  ParaphraseInput,
  ParaphraseInputSchema,
  ParaphraseOutput,
  ParaphraseOutputSchema,
} from '../../lib/schemas';

// Fungsi pabrik yang membuat dan mengkonfigurasi server action.
function createParaphraseAction() {
  // Ambil API key SEKALI saat modul dimuat.
  const apiKey = process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    // Jika API key tidak ada saat server start, lempar error yang jelas.
    // Ini akan menghentikan server saat build/startup jika env var tidak ada.
    throw new Error('FATAL: Kunci API Google tidak ditemukan di environment variables.');
  }

  // Inisialisasi Google Generative AI di sini.
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  /**
   * Fungsi server action yang sebenarnya, yang akan diekspor.
   * @param input Objek yang berisi teks untuk diparafrase.
   * @returns Sebuah promise yang resolve menjadi objek dengan tiga model parafrase.
   */
  async function paraphraseParagraphAction(
    input: ParaphraseInput
  ): Promise<ParaphraseOutput> {
    // Validasi input menggunakan Zod
    const validationResult = ParaphraseInputSchema.safeParse(input);
    if (!validationResult.success) {
      throw new Error(validationResult.error.issues[0].message);
    }

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
      
      const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsedJson = JSON.parse(cleanedText);
      
      const validationOutput = ParaphraseOutputSchema.safeParse(parsedJson);
      if (!validationOutput.success) {
        console.error('AI response validation error:', validationOutput.error);
        throw new Error('AI memberikan respons dalam format yang tidak diharapkan.');
      }

      return validationOutput.data;
    } catch (error) {
      console.error('Error saat menghubungi Google Generative AI:', error);
      // Buat pesan error yang lebih spesifik untuk klien
      if (error instanceof Error && error.message.includes('API key not valid')) {
         throw new Error('Kunci API tidak valid. Periksa konfigurasi di server.');
      }
      throw new Error('Gagal menghubungi AI. Mungkin ada masalah dengan jaringan atau layanan AI sedang sibuk.');
    }
  }

  // Kembalikan server action yang sudah dikonfigurasi.
  return paraphraseParagraphAction;
}

// Panggil pabrik untuk membuat dan mengekspor server action.
export const paraphraseParagraph = createParaphraseAction();
