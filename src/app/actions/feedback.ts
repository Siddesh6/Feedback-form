'use server';
import { analyzeFeedbackSentiment } from '@/ai/flows/analyze-feedback-sentiment';
import { generateImprovementSuggestions } from '@/ai/flows/generate-improvement-suggestions';
import { getResponsesByFormId } from '@/lib/data';

type SentimentResult = {
  feedbackText: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  score: number;
};

export async function analyzeAllFeedback(formId: string): Promise<SentimentResult[]> {
  try {
    const responses = getResponsesByFormId(formId);
    const textFeedbacks = responses
      .map((r) => r.textFeedback)
      .filter((text) => text && text.trim() !== '');

    if (textFeedbacks.length === 0) return [];

    const sentimentPromises = textFeedbacks.map(async (feedbackText) => {
      const result = await analyzeFeedbackSentiment({ feedbackText });
      return { feedbackText, ...result };
    });

    const results = await Promise.all(sentimentPromises);
    return results;

  } catch (error) {
    console.error('Error analyzing feedback sentiment:', error);
    // In a real app, you'd want more robust error handling.
    // For now, we return an empty array on failure.
    return [];
  }
}

export async function getImprovementSuggestions(
  formId: string,
  category: 'Event' | 'Course' | 'Faculty' | 'Workshop'
): Promise<string[]> {
  try {
    const responses = getResponsesByFormId(formId);
    const feedbackData = responses
      .map((r) => r.textFeedback)
      .filter(Boolean)
      .join('\n---\n');

    if (!feedbackData) return ["Not enough text feedback to generate suggestions."];
    
    const result = await generateImprovementSuggestions({ feedbackData, category });
    return result.suggestions;
  } catch(error) {
    console.error('Error generating improvement suggestions:', error);
    return ["Failed to generate suggestions due to an internal error."];
  }
}
