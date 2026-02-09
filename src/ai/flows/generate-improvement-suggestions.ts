'use server';

/**
 * @fileOverview A flow for generating smart improvement suggestions based on analyzed feedback.
 *
 * - generateImprovementSuggestions - A function that generates improvement suggestions.
 * - GenerateImprovementSuggestionsInput - The input type for the generateImprovementSuggestions function.
 * - GenerateImprovementSuggestionsOutput - The return type for the generateImprovementSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateImprovementSuggestionsInputSchema = z.object({
  feedbackData: z.string().describe('Analyzed feedback data, including sentiment analysis results.'),
  category: z.enum(['Event', 'Course', 'Faculty', 'Workshop']).describe('The category of the feedback.'),
});
export type GenerateImprovementSuggestionsInput = z.infer<typeof GenerateImprovementSuggestionsInputSchema>;

const GenerateImprovementSuggestionsOutputSchema = z.object({
  suggestions: z.array(z.string()).describe('A list of smart improvement suggestions.'),
});
export type GenerateImprovementSuggestionsOutput = z.infer<typeof GenerateImprovementSuggestionsOutputSchema>;

export async function generateImprovementSuggestions(
  input: GenerateImprovementSuggestionsInput
): Promise<GenerateImprovementSuggestionsOutput> {
  return generateImprovementSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateImprovementSuggestionsPrompt',
  input: {schema: GenerateImprovementSuggestionsInputSchema},
  output: {schema: GenerateImprovementSuggestionsOutputSchema},
  prompt: `You are an AI assistant helping admins improve their {{category}} based on feedback.

  Analyze the following feedback data and generate a list of actionable improvement suggestions.

  Feedback Data: {{{feedbackData}}}

  Provide the suggestions as a list of strings.
  Focus on providing clear, specific, and actionable suggestions that the admin can implement to improve the {{category}}.
`,
});

const generateImprovementSuggestionsFlow = ai.defineFlow(
  {
    name: 'generateImprovementSuggestionsFlow',
    inputSchema: GenerateImprovementSuggestionsInputSchema,
    outputSchema: GenerateImprovementSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
