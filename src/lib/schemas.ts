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
