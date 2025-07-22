'use server';

/**
 * @fileOverview Server action untuk fitur parafrase.
 * NOTE: This file is currently not used for debugging purposes.
 * The logic has been temporarily moved to the client-side component.
 */
import {
  ParaphraseInput,
  ParaphraseOutput,
} from '../../lib/schemas';

export async function paraphraseParagraph(
  input: ParaphraseInput
): Promise<ParaphraseOutput> {
  // This server action is temporarily disabled for local debugging.
  // The client is making the API call directly.
  throw new Error('Server action is disabled. Client-side fallback should be used.');
}
