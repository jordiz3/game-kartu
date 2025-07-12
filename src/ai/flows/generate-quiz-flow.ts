'use server';
/**
 * @fileOverview Flow AI untuk menghasilkan pertanyaan kuis pengetahuan umum.
 *
 * - generateQuizQuestion - Fungsi yang menghasilkan satu set pertanyaan kuis.
 * - QuizQuestionOutput - Tipe output untuk fungsi generateQuizQuestion.
 */

import { ai } from '../genkit';
import { z } from 'zod';
import { googleAI } from '@genkit-ai/googleai';

// Skema untuk output pertanyaan kuis
const QuizQuestionOutputSchema = z.object({
  question: z.string().describe('Satu pertanyaan pengetahuan umum yang menarik dalam Bahasa Indonesia.'),
  options: z.array(z.string()).length(4).describe('Array berisi empat pilihan jawaban yang masuk akal.'),
  correctAnswer: z.string().describe('Jawaban yang benar dari empat pilihan yang diberikan.'),
});
export type QuizQuestionOutput = z.infer<typeof QuizQuestionOutputSchema>;

// Fungsi yang akan dipanggil oleh frontend
export async function generateQuizQuestion(): Promise<QuizQuestionOutput> {
  return generateQuizFlow({});
}

// Prompt untuk AI
const prompt = ai.definePrompt({
  name: 'generateQuizPrompt',
  model: googleAI.model('gemini-1.5-flash-latest'),
  output: { schema: QuizQuestionOutputSchema },
  prompt: `You are a quiz master. Your task is to generate one interesting general knowledge question in Indonesian.

The question should be suitable for a general audience.
Provide four plausible multiple-choice options. One of the options must be the correct answer.
Ensure the 'correctAnswer' field in the output exactly matches one of the strings in the 'options' array.

Example:
question: "Siapakah penemu bola lampu?"
options: ["Thomas Edison", "Albert Einstein", "Isaac Newton", "Nikola Tesla"]
correctAnswer: "Thomas Edison"

Do not add any preamble or explanation. Just provide the JSON output.`,
});

// Flow Genkit
const generateQuizFlow = ai.defineFlow(
  {
    name: 'generateQuizFlow',
    inputSchema: z.object({}), // Input kosong
    outputSchema: QuizQuestionOutputSchema,
  },
  async () => {
    const { output } = await prompt({});
    
    // Defensive check to ensure output is not null or undefined
    if (!output) {
      throw new Error("AI failed to generate a response for the quiz question.");
    }

    // Acak urutan pilihan jawaban untuk variasi
    const shuffledOptions = output.options.sort(() => Math.random() - 0.5);
    
    return {
      ...output,
      options: shuffledOptions,
    };
  }
);