
'use server';

import { callParaphraseFlow, type ParaphraseInput, type ParaphraseOutput } from '../../ai/flows/paraphrase-flow';

export async function paraphraseParagraph(input: ParaphraseInput): Promise<ParaphraseOutput> {
  const result = await callParaphraseFlow(input);
  if (!result) {
    throw new Error('The AI flow did not return a result.');
  }
  return result;
}
