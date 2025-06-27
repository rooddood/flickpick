
'use server';

/**
 * @fileOverview A movie/TV show recommendation AI agent that generates personalized recommendations by searching a movie database.
 *
 * - generateRecommendation - A function that handles the recommendation generation process.
 * - GenerateRecommendationInput - The input type for the generateRecommendation function.
 * - GenerateRecommendationOutput - The return type for the generateRecommendation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { searchMovies } from '@/services/movie-service';

const searchMovieDatabase = ai.defineTool(
  {
    name: 'searchMovieDatabase',
    description: 'Search the movie database to find movies that match a user query or vibe. Returns a list of movies with their details.',
    inputSchema: z.object({
      query: z.string().describe('The search query, like a genre, theme, actor, or a general vibe.'),
    }),
    outputSchema: z.array(z.object({
      id: z.number(),
      title: z.string(),
      description: z.string(),
      themes: z.array(z.string()),
      streamingAvailability: z.string(),
      imageUrl: z.string(),
      aiHint: z.string(),
    })),
  },
  async ({ query }) => {
    return searchMovies(query);
  }
);


const GenerateRecommendationInputSchema = z.object({
  vibe: z.string().describe('The desired vibe, mood, genre, or theme of the movie/TV show.'),
});

export type GenerateRecommendationInput = z.infer<typeof GenerateRecommendationInputSchema>;

const SingleRecommendationSchema = z.object({
  title: z.string().describe('The title of the recommended movie or TV show.'),
  themes: z.array(z.string()).describe('A list of 2-3 main themes or keywords for the movie/TV show.'),
  description: z.string().describe('A brief description of the recommended movie or TV show.'),
  streamingAvailability: z.string().describe('Where the movie/TV show is available for streaming.'),
  imageUrl: z.string().url().describe('The URL for the movie poster image.'),
  aiHint: z.string().describe('A hint for AI to generate a relevant placeholder image.'),
});

const GenerateRecommendationOutputSchema = z.array(SingleRecommendationSchema).max(6).describe("A list of exactly 6 movie or TV show recommendations based on the tool's output.");


export type GenerateRecommendationOutput = z.infer<typeof GenerateRecommendationOutputSchema>;

export async function generateRecommendation(input: GenerateRecommendationInput): Promise<GenerateRecommendationOutput> {
  return generateRecommendationFlow(input);
}

const generateRecommendationPrompt = ai.definePrompt({
  name: 'generateRecommendationPrompt',
  tools: [searchMovieDatabase],
  input: {schema: GenerateRecommendationInputSchema},
  output: {schema: GenerateRecommendationOutputSchema},
  prompt: `You are a movie and TV show recommendation expert. Your goal is to provide 6 recommendations based on the user's desired vibe.

  1.  First, analyze the user's desired vibe: {{{vibe}}}
  2.  Use the 'searchMovieDatabase' tool with a query derived from the user's vibe to find a list of potentially relevant movies. You must use this tool to get the movie data. Do not use your own knowledge.
  3.  From the search results provided by the tool, select the 6 best matches for the user's vibe.
  4.  Format your response as a list of 6 recommendations, ensuring all fields (title, themes, description, streamingAvailability, imageUrl, aiHint) are populated directly from the tool's output for the movies you selected. Do not make up any information.
  `, 
});

const generateRecommendationFlow = ai.defineFlow(
  {
    name: 'generateRecommendationFlow',
    inputSchema: GenerateRecommendationInputSchema,
    outputSchema: GenerateRecommendationOutputSchema,
  },
  async input => {
    const {output} = await generateRecommendationPrompt(input);
    return output!;
  }
);
