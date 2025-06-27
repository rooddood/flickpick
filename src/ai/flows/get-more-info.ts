'use server';

/**
 * @fileOverview A flow to get more detailed information about a specific movie or TV show.
 *
 * - getMoreInfo - A function that fetches additional details for a given title.
 * - GetMoreInfoInput - The input type for the getMoreInfo function.
 * - GetMoreInfoOutput - The return type for the getMoreInfo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetMoreInfoInputSchema = z.object({
  title: z.string().describe('The title of the movie or TV show.'),
  director: z.string().describe('The director of the movie or TV show to disambiguate.'),
});
export type GetMoreInfoInput = z.infer<typeof GetMoreInfoInputSchema>;

const GetMoreInfoOutputSchema = z.object({
  detailedSynopsis: z.string().describe("A detailed, multi-paragraph synopsis of the movie or TV show's plot."),
  trivia: z.array(z.string()).describe('A list of 2-3 interesting trivia facts about the production, casting, or reception of the movie/show.'),
});
export type GetMoreInfoOutput = z.infer<typeof GetMoreInfoOutputSchema>;

export async function getMoreInfo(input: GetMoreInfoInput): Promise<GetMoreInfoOutput> {
  return getMoreInfoFlow(input);
}

const getMoreInfoPrompt = ai.definePrompt({
  name: 'getMoreInfoPrompt',
  input: {schema: GetMoreInfoInputSchema},
  output: {schema: GetMoreInfoOutputSchema},
  prompt: `You are a film and television expert.
  A user wants to know more about a specific movie/show.

  Title: {{{title}}}
  Director: {{{director}}}

  Provide the following based on your knowledge:
  1. A detailed, multi-paragraph synopsis of the plot.
  2. A list of 2-3 interesting trivia facts about the film/show.
  `,
});

const getMoreInfoFlow = ai.defineFlow(
  {
    name: 'getMoreInfoFlow',
    inputSchema: GetMoreInfoInputSchema,
    outputSchema: GetMoreInfoOutputSchema,
  },
  async input => {
    const {output} = await getMoreInfoPrompt(input);
    return output!;
  }
);
