'use server';
import { analyzeFeedbackSentiment } from '@/ai/flows/analyze-feedback-sentiment';
import { generateImprovementSuggestions as generateSuggestionsFlow } from '@/ai/flows/generate-improvement-suggestions';

type SentimentResult = {
  feedbackText: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  score: number;
};

export async function analyzeAllFeedback(feedbackTexts: string[]): Promise<SentimentResult[]> {
  try {
    if (feedbackTexts.length === 0) return [];

    const sentimentPromises = feedbackTexts.map(async (feedbackText) => {
      const result = await analyzeFeedbackSentiment({ feedbackText });
      return { feedbackText, ...result };
    });

    const results = await Promise.all(sentimentPromises);
    return results;

  } catch (error) {
    console.error('Error analyzing feedback sentiment:', error);
    // Re-throw the error to be handled by the client
    throw new Error("Failed to analyze feedback sentiment.");
  }
}

export async function getImprovementSuggestions(
  feedbackData: string,
  category: 'Event' | 'Course' | 'Faculty' | 'Workshop'
): Promise<string[]> {
  try {
    if (!feedbackData) return ["Not enough text feedback to generate suggestions."];
    
    const result = await generateSuggestionsFlow({ feedbackData, category });
    return result.suggestions;
  } catch(error) {
    console.error('Error generating improvement suggestions:', error);
    throw new Error("Failed to generate suggestions due to an internal error.");
  }
}
