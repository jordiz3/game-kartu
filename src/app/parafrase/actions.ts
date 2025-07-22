'use server';

import {
  ParaphraseInputSchema,
  type ParaphraseInput,
  type ParaphraseOutput,
} from '../../lib/schemas';
import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Paraphrases a given text using the Google Generative AI.
 * This is a server action and should only be called from the client.
 *
 * @param input - The input object containing the text to be paraphrased.
 * @returns A promise that resolves to the paraphrased output.
 */
export async function paraphraseParagraph(
  input: ParaphraseInput
): Promise<ParaphraseOutput> {
  // Validate the input using Zod schema
  const validationResult = ParaphraseInputSchema.safeParse(input);
  if (!validationResult.success) {
    throw new Error(validationResult.error.issues.map((issue) => issue.message).join(', '));
  }

  const { text } = validationResult.data;

  // IMPORTANT: Using a hardcoded key is NOT recommended for production.
  // This is a workaround for a local development environment where process.env is not being populated correctly.
  // The deployed version uses the secure secret from apphosting.yaml.
  const apiKey = "AIzaSyC8UNkIKzaBesTpyGwbz-BOJk-24qSEB8";

  if (!apiKey) {
    // This error will be caught by the client and displayed as a toast.
    throw new Error('Kunci API Google tidak dikonfigurasi di server.');
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
      Anda adalah seorang ahli bahasa Indonesia yang sangat pandai membantu mahasiswa mengerjakan skripsi.
      Tugas Anda adalah memparafrasekan teks yang diberikan ke dalam gaya bahasa formal, namun tidak terlalu kaku atau ilmiah. Gunakan gaya bahasa yang umum dipakai mahasiswa dalam penulisan tugas akhir: terstruktur, baku, tetapi tetap mudah dibaca.

      Teks Asli:
      "${text}"

      Instruksi:
      Buatlah TIGA model atau versi parafrase yang berbeda dari teks asli tersebut. Setiap model harus memiliki pilihan kata dan struktur kalimat yang sedikit berbeda satu sama lain, namun tetap mempertahankan makna asli dan gaya formal khas mahasiswa.

      PENTING: Berikan output HANYA sebagai objek JSON yang valid dengan kunci "model1", "model2", dan "model3". Jangan tambahkan markdown atau teks lain di luar JSON. Contoh: {"model1": "...", "model2": "...", "model3": "..."}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();
    
    // Clean the response text to ensure it's a valid JSON string
    const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsedJson = JSON.parse(cleanedText);

    return parsedJson as ParaphraseOutput;
  } catch (error) {
    console.error('Error calling Google Generative AI:', error);
    // Rethrow a more generic error to the client
    throw new Error('Gagal menghubungi AI. Mungkin ada masalah dengan jaringan atau layanan AI sedang sibuk.');
  }
}
