
'use server';

/**
 * @fileOverview A movie/TV show recommendation AI agent that generates personalized recommendations.
 *
 * - generateRecommendation - A function that handles the recommendation generation process.
 * - GenerateRecommendationInput - The input type for the generateRecommendation function.
 * - GenerateRecommendationOutput - The return type for the generateRecommendation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRecommendationInputSchema = z.object({
  vibe: z.string().describe('The desired vibe, mood, genre, or theme of the movie/TV show.'),
});

export type GenerateRecommendationInput = z.infer<typeof GenerateRecommendationInputSchema>;

const SingleRecommendationSchema = z.object({
  title: z.string().describe('The title of the recommended movie or TV show.'),
  type: z.enum(['Movie', 'TV Show']).describe('Whether the recommendation is a "Movie" or a "TV Show".'),
  themes: z.array(z.string()).describe('A list of 2-3 main themes or keywords for the movie/TV show. These should be concise phrases like "sci-fi heist" or "dark comedy", not sentences.'),
  description: z.string().describe('A brief, one-sentence description of the recommended movie or TV show.'),
  streamingAvailability: z.string().describe('Where the movie/TV show can be watched. Specify if it is available for streaming (e.g., "Stream on Netflix"), or if it needs to be rented or purchased (e.g., "Rent/Buy on Amazon Prime"). If unknown, state "Not specified".'),
  streamingUrl: z.string().url().optional().describe("A direct URL to the movie/show on the specified streaming service. Omit if it's for rent/buy or if a direct link isn't available."),
  themeColor: z.string().describe('A theme color in HSL format (e.g., "220 80% 50%") that represents the mood of the movie.'),
  mainActors: z.array(z.string()).describe('A list of 2-3 main actors in the movie/TV show.'),
});

const GenerateRecommendationOutputSchema = z.array(SingleRecommendationSchema).max(6).describe("A list of up to 6 movie or TV show recommendations based on the user's vibe.");

export type GenerateRecommendationOutput = z.infer<typeof GenerateRecommendationOutputSchema>;


export async function generateRecommendation(input: GenerateRecommendationInput): Promise<GenerateRecommendationOutput> {
  return generateRecommendationFlow(input);
}

const generateRecommendationPrompt = ai.definePrompt({
  name: 'generateRecommendationPrompt',
  input: {schema: GenerateRecommendationInputSchema},
  output: {schema: GenerateRecommendationOutputSchema},
  prompt: `You are a movie and TV show recommendation expert. Your goal is to provide exactly 6 recommendations based on the user's desired vibe.

  Analyze the user's desired vibe: {{{vibe}}}

  For each recommendation, you MUST provide:
  - A title.
  - The type of content: either "Movie" or "TV Show".
  - A list of 2-3 short, descriptive themes (e.g., "dystopian sci-fi", "courtroom drama").
  - A concise, one-sentence description.
  - Where the movie/TV show can be watched. Specify if it is available for streaming (e.g., "Stream on Netflix"), or if it needs to be rented or purchased (e.g., "Rent/Buy on Amazon Prime"). Use your training data to provide a likely source. If you cannot determine one, use "Not specified".
  - A direct URL to the streaming service page for the movie/show, if one is known to exist ('streamingUrl'). If a direct link isn't available, or it's for rent/buy, you can omit the 'streamingUrl' field.
  - A representative theme color in HSL format (e.g., "30 95% 50%").
  - A list of 2-3 main actors.
  
  Generate exactly 6 recommendations based on your general training data.
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
    return output || [];
  }
);
