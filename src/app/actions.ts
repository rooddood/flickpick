'use server';

import { generateRecommendation, GenerateRecommendationOutput } from '@/ai/flows/generate-recommendation';
import { retrieveRecommendations } from '@/ai/flows/retrieve-recommendations';

export type RecommendationResult = GenerateRecommendationOutput | { error: string };

export async function getAiRecommendation(vibe: string): Promise<RecommendationResult> {
  if (!vibe) {
    return { error: 'Please provide a vibe.' };
  }

  try {
    const retrieveResult = await retrieveRecommendations({ preferences: vibe });
    const movieData = retrieveResult.recommendation;

    if (!movieData) {
      return { error: "I couldn't find any movies or shows that match that vibe. Please try something else!" };
    }
    
    const recommendation = await generateRecommendation({ vibe, movieData });
    
    return recommendation;
  } catch (error) {
    console.error('Error getting AI recommendation:', error);
    return {
      error: 'Sorry, I had a little trouble finding a recommendation. Please try a different vibe.',
    };
  }
}
