'use client';

import { useMemo } from 'react';
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, PieChart, Pie, Cell } from 'recharts';
import type { Form, FeedbackResponse, Question } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

function processChartData(question: Question, responses: FeedbackResponse[]) {
    const answerCounts: { [key: string]: number } = {};

    responses.forEach(response => {
        const answer = response.answers.find(a => a.questionId === question.id);
        if (answer) {
            if (Array.isArray(answer.value)) { // Checkboxes
                answer.value.forEach(val => {
                    answerCounts[val] = (answerCounts[val] || 0) + 1;
                });
            } else { // Other types
                const valueStr = String(answer.value);
                answerCounts[valueStr] = (answerCounts[valueStr] || 0) + 1;
            }
        }
    });

    if (question.type === 'rating' || question.type === 'likert' || question.type === 'multiple-choice' || question.type === 'checkbox') {
        const options = question.options || (question.type === 'rating' ? Array.from({length: question.scale || 5}, (_, i) => String(i+1)) : []);
        return options.map(option => ({
            name: option,
            value: answerCounts[option] || 0,
        }));
    }

    if (question.type === 'yes-no') {
        return [
            { name: 'Yes', value: answerCounts['Yes'] || 0 },
            { name: 'No', value: answerCounts['No'] || 0 },
        ];
    }
    
    return [];
}


export function SummaryView({ form, responses }: { form: Form; responses: FeedbackResponse[] }) {
    
  const chartData = useMemo(() => {
    const data: { [key: string]: any[] } = {};
    form.questions.forEach(q => {
        data[q.id] = processChartData(q, responses);
    });
    return data;
  }, [form, responses]);
    
  if (responses.length === 0) {
    return (
        <Card className="flex items-center justify-center h-96">
            <CardContent>
                <p className="text-muted-foreground">No responses yet. Share your form to start collecting feedback!</p>
            </CardContent>
        </Card>
    );
  }

  return (
    <div className="grid gap-6">
        {form.questions.map((question) => {
            const data = chartData[question.id];
            if (!data || data.length === 0) return null;

            if (question.type === 'rating') {
                const chartConfig: ChartConfig = { value: { label: "Responses" } };
                return (
                    <Card key={question.id}>
                        <CardHeader><CardTitle className="font-headline text-lg">{question.text}</CardTitle></CardHeader>
                        <CardContent>
                             <ChartContainer config={chartConfig} className="h-[250px] w-full">
                                <BarChart data={data}>
                                    <CartesianGrid vertical={false} />
                                    <XAxis dataKey="name" tickLine={false} axisLine={false} />
                                    <YAxis width={30} />
                                    <Tooltip cursor={false} content={<ChartTooltipContent />} />
                                    <Bar dataKey="value" name="Responses" fill="var(--color-primary)" radius={4} />
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                )
            }
             if (question.type === 'yes-no') {
                return (
                    <Card key={question.id}>
                        <CardHeader><CardTitle className="font-headline text-lg">{question.text}</CardTitle></CardHeader>
                        <CardContent>
                             <ChartContainer config={{}} className="h-[250px] w-full">
                                <PieChart>
                                <Tooltip content={<ChartTooltipContent hideLabel />} />
                                <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                </PieChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                )
            }
             if (question.type === 'likert' || question.type === 'multiple-choice' || question.type === 'checkbox') {
                const chartConfig: ChartConfig = { value: { label: "Responses" } };
                return (
                    <Card key={question.id}>
                        <CardHeader><CardTitle className="font-headline text-lg">{question.text}</CardTitle></CardHeader>
                        <CardContent>
                             <ChartContainer config={chartConfig} className="h-[250px] w-full">
                                <BarChart data={data} layout="vertical">
                                    <CartesianGrid horizontal={false} />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" width={120} tickLine={false} axisLine={false}/>
                                    <Tooltip cursor={false} content={<ChartTooltipContent />} />
                                    <Bar dataKey="value" name="Responses" fill="var(--color-primary)" radius={4} />
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                )
            }
            return null;
        })}
    </div>
  );
}
