'use server';

import { generateRecommendation, GenerateRecommendationOutput } from '@/ai/flows/generate-recommendation';
import { getMoreInfo, GetMoreInfoInput, GetMoreInfoOutput } from '@/ai/flows/get-more-info';

export type RecommendationResult = GenerateRecommendationOutput | { error: string };
export type MoreInfoResult = GetMoreInfoOutput | { error: string };

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

export async function getMoreMovieInfo(input: GetMoreInfoInput): Promise<MoreInfoResult> {
  try {
    const moreInfo = await getMoreInfo(input);
    return moreInfo;
  } catch (error) {
    console.error('Error getting more movie info:', error);
    return {
      error: 'Sorry, I couldn\'t find more information about that title.',
    };
  }
}
