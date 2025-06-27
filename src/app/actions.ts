'use server';

import { generateRecommendation, GenerateRecommendationOutput } from '@/ai/flows/generate-recommendation';

export type RecommendationResult = GenerateRecommendationOutput | { error: string };

export async function getAiRecommendation(vibe: string): Promise<RecommendationResult> {
  if (!vibe) {
    return { error: 'Please provide a vibe.' };
  }

  try {
    const recommendation = await generateRecommendation({ vibe });
    
    return recommendation;
  } catch (error) {
    console.error('Error getting AI recommendation:', error);
    return {
      error: 'Sorry, I had a little trouble finding a recommendation. Please try a different vibe.',
    };
  }
}
