'use server';

/**
 * @fileOverview AI-powered sentiment analysis for text-based feedback.
 *
 * - analyzeFeedbackSentiment - Analyzes the sentiment of a given text feedback.
 * - AnalyzeFeedbackSentimentInput - The input type for the analyzeFeedbackSentiment function.
 * - AnalyzeFeedbackSentimentOutput - The return type for the analyzeFeedbackSentiment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeFeedbackSentimentInputSchema = z.object({
  feedbackText: z
    .string()
    .describe('The text of the feedback to analyze.'),
});
export type AnalyzeFeedbackSentimentInput = z.infer<
  typeof AnalyzeFeedbackSentimentInputSchema
>;

const AnalyzeFeedbackSentimentOutputSchema = z.object({
  sentiment: z
    .enum(['positive', 'negative', 'neutral'])
    .describe('The sentiment of the feedback.'),
  score: z
    .number()
    .min(-1)
    .max(1)
    .describe(
      'A numerical score representing the sentiment, from -1 (negative) to 1 (positive).'
    ),
});
export type AnalyzeFeedbackSentimentOutput = z.infer<
  typeof AnalyzeFeedbackSentimentOutputSchema
>;

export async function analyzeFeedbackSentiment(
  input: AnalyzeFeedbackSentimentInput
): Promise<AnalyzeFeedbackSentimentOutput> {
  return analyzeFeedbackSentimentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeFeedbackSentimentPrompt',
  input: {schema: AnalyzeFeedbackSentimentInputSchema},
  output: {schema: AnalyzeFeedbackSentimentOutputSchema},
  prompt: `Analyze the sentiment of the following feedback text and provide a sentiment and a score.

Feedback Text: {{{feedbackText}}}

Respond in JSON format:
{
  "sentiment": "positive | negative | neutral",
  "score": -1 to 1
}

Consider the following:
*   A positive sentiment indicates satisfaction or agreement.
*   A negative sentiment indicates dissatisfaction or disagreement.
*   A neutral sentiment indicates a lack of strong emotion or opinion.
*   The score should reflect the intensity of the sentiment.
`,
});

const analyzeFeedbackSentimentFlow = ai.defineFlow(
  {
    name: 'analyzeFeedbackSentimentFlow',
    inputSchema: AnalyzeFeedbackSentimentInputSchema,
    outputSchema: AnalyzeFeedbackSentimentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
