
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
import { movies, type Movie } from '@/data/movies';

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
      themeColor: z.string(),
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
  themeColor: z.string().describe('The HSL theme color for the movie card.'),
});

const GenerateRecommendationOutputSchema = z.array(SingleRecommendationSchema).max(6).describe("A list of up to 6 movie or TV show recommendations based on the tool's output.");

export type GenerateRecommendationOutput = z.infer<typeof GenerateRecommendationOutputSchema>;

const LLMSelectionSchema = z.array(z.object({
    id: z.number().describe("The numeric ID of the movie selected from the tool's search results."),
})).max(6).describe("An array of up to 6 movie selections, identified only by their ID.");


export async function generateRecommendation(input: GenerateRecommendationInput): Promise<GenerateRecommendationOutput> {
  return generateRecommendationFlow(input);
}

const generateRecommendationPrompt = ai.definePrompt({
  name: 'generateRecommendationPrompt',
  tools: [searchMovieDatabase],
  input: {schema: GenerateRecommendationInputSchema},
  output: {schema: LLMSelectionSchema},
  prompt: `You are a movie and TV show recommendation expert. Your goal is to provide up to 6 recommendations based on the user's desired vibe.

  1.  First, analyze the user's desired vibe: {{{vibe}}}
  2.  Use the 'searchMovieDatabase' tool with a query derived from the user's vibe to find a list of potentially relevant movies. You must use this tool to get the movie data. Do not use your own knowledge.
  3.  From the search results provided by the tool, select the 6 best matches for the user's vibe.
  4.  Format your response as a list of selections, using only the 'id' field for each movie. Do not include any other fields like title, description, or themeColor in your response.
  `, 
});

const generateRecommendationFlow = ai.defineFlow(
  {
    name: 'generateRecommendationFlow',
    inputSchema: GenerateRecommendationInputSchema,
    outputSchema: GenerateRecommendationOutputSchema,
  },
  async input => {
    const {output: llmOutput} = await generateRecommendationPrompt(input);
    
    if (!llmOutput) {
      return [];
    }
    
    const recommendedMovies = llmOutput.map(selection => {
      return movies.find(movie => movie.id === selection.id);
    }).filter((movie): movie is Movie => movie !== undefined);
    
    return recommendedMovies.map(movie => ({
      id: movie.id,
      title: movie.title,
      description: movie.description,
      themes: movie.themes,
      streamingAvailability: movie.streamingAvailability,
      themeColor: movie.themeColor,
    }));
  }
);
