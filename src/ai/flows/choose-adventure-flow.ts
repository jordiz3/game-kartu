'use server';
/**
 * @fileOverview Flow AI untuk game petualangan interaktif "Pilih Sendiri Jalanmu".
 *
 * - continueAdventure - Fungsi yang melanjutkan cerita berdasarkan pilihan pengguna.
 * - AdventureInput - Tipe input untuk fungsi continueAdventure.
 * - AdventureOutput - Tipe output untuk fungsi continueAdventure.
 */

import { ai } from '../genkit';
import { z } from 'zod';
import { googleAI } from '@genkit-ai/googleai';

const AdventureInputSchema = z.object({
  previousStory: z.string().describe('Bagian cerita sebelumnya. Untuk memulai, gunakan "Mulai Petualangan".'),
  choice: z.string().describe('Pilihan yang dibuat oleh pemain dari bagian cerita sebelumnya. Untuk memulai, gunakan "Mulai".'),
});
export type AdventureInput = z.infer<typeof AdventureInputSchema>;

const AdventureOutputSchema = z.object({
  storySegment: z.string().describe('Paragraf kelanjutan cerita yang menarik, ditulis dalam Bahasa Indonesia.'),
  choiceA: z.string().describe('Pilihan pertama yang tersedia untuk pemain.'),
  choiceB: z.string().describe('Pilihan kedua yang tersedia untuk pemain.'),
});
export type AdventureOutput = z.infer<typeof AdventureOutputSchema>;

export async function continueAdventure(input: AdventureInput): Promise<AdventureOutput> {
  return adventureFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chooseAdventurePrompt',
  model: googleAI.model('gemini-2.0-flash'),
  input: { schema: AdventureInputSchema },
  output: { schema: AdventureOutputSchema },
  prompt: `You are a creative and imaginative storyteller crafting a romantic fantasy adventure for a couple, Cipa and Jojo. They are the main characters of this story.

The story continues from this point:
"{{previousStory}}"

They have just made this choice: "{{choice}}"

Your task is to write the next chapter of their adventure in Indonesian.
- The tone should be magical, slightly romantic, and exciting.
- The story segment should be a single, engaging paragraph.
- Crucially, you must end by presenting two new, distinct, and compelling choices for Cipa and Jojo to make. These choices will determine the next part of the story.
- If the previous story is "Mulai Petualangan" and the choice is "Mulai", you must create the very beginning of the story, where Cipa and Jojo find themselves at the start of an adventure.

Example Output Structure:
storySegment: "Kalian berdua melangkah hati-hati ke dalam gua. Cahaya dari kristal ajaib di tanganmu menari di dinding yang lembap, menampakkan ukiran-ukiran kuno yang bercerita tentang naga dan bintang. Di ujung lorong, kalian melihat sebuah peti kayu tua dan sebuah lentera yang tergantung."
choiceA: "Buka peti kayu"
choiceB: "Ambil lentera"

Do not add any preamble or explanation. Just provide the JSON output with the story segment and the two choices.`,
});

const adventureFlow = ai.defineFlow(
  {
    name: 'adventureFlow',
    inputSchema: AdventureInputSchema,
    outputSchema: AdventureOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
