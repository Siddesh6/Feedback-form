'use client';

import { useEffect, useState, useTransition } from 'react';
import { Bot, ThumbsDown, ThumbsUp, Meh, Lightbulb } from 'lucide-react';
import { analyzeAllFeedback, getImprovementSuggestions } from '@/app/actions/feedback';
import type { Form } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

type SentimentResult = {
  feedbackText: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  score: number;
};

const sentimentIcons = {
  positive: <ThumbsUp className="h-5 w-5 text-green-500" />,
  negative: <ThumbsDown className="h-5 w-5 text-red-500" />,
  neutral: <Meh className="h-5 w-5 text-yellow-500" />,
};

const sentimentColors = {
  positive: 'bg-green-100 text-green-800 border-green-200',
  negative: 'bg-red-100 text-red-800 border-red-200',
  neutral: 'bg-yellow-100 text-yellow-800 border-yellow-200',
};


export function AiInsights({ form }: { form: Form }) {
  const [isPending, startTransition] = useTransition();
  const [sentiments, setSentiments] = useState<SentimentResult[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateInsights = () => {
    startTransition(async () => {
      setError(null);
      const sentimentResults = await analyzeAllFeedback(form.id);
      if (sentimentResults) {
        setSentiments(sentimentResults);
      } else {
        setError('Failed to analyze sentiment.');
      }
      
      const suggestionResults = await getImprovementSuggestions(form.id, form.category);
      if (suggestionResults) {
        setSuggestions(suggestionResults);
      } else {
        setError((prev) => (prev ? `${prev} Failed to generate suggestions.` : 'Failed to generate suggestions.'));
      }
    });
  };

  const overallSentimentScore = sentiments.length > 0
    ? (sentiments.reduce((acc, s) => acc + s.score, 0) / sentiments.length * 100).toFixed(0)
    : 0;

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline">
            <Bot className="h-6 w-6" />
            AI-Powered Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Click the button to analyze text feedback for sentiment and generate actionable improvement suggestions.
          </p>
          <Button onClick={handleGenerateInsights} disabled={isPending}>
            {isPending ? 'Generating...' : 'Generate AI Insights'}
          </Button>
        </CardContent>
      </Card>

      {isPending && (
        <div className="grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </CardContent>
            </Card>
            <Card>
                <CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                </CardContent>
            </Card>
        </div>
      )}

      {error && <p className="text-red-500">{error}</p>}

      {!isPending && (sentiments.length > 0 || suggestions.length > 0) && (
        <div className="grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Sentiment Analysis</CardTitle>
                    <p className="text-sm text-muted-foreground">Overall Sentiment Score: {overallSentimentScore}</p>
                </CardHeader>
                <CardContent className="space-y-3 max-h-[400px] overflow-y-auto">
                    {sentiments.map((result, index) => (
                        <div key={index} className={`flex items-start gap-3 p-3 rounded-lg border ${sentimentColors[result.sentiment]}`}>
                            <div className="flex-shrink-0 pt-1">{sentimentIcons[result.sentiment]}</div>
                            <p className="flex-1 text-sm">{result.feedbackText}</p>
                            <Badge variant="outline" className="text-xs">{result.sentiment}</Badge>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Improvement Suggestions</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-3">
                        {suggestions.map((suggestion, index) => (
                            <li key={index} className="flex items-start gap-3">
                                <Lightbulb className="h-5 w-5 text-accent flex-shrink-0 mt-1" />
                                <span className="text-sm">{suggestion}</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>
      )}
    </div>
  );
}
