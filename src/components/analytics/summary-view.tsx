'use client';

import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, PieChart, Pie, Cell } from 'recharts';
import type { Form } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

const ratingData = [
    { rating: 1, count: 5 },
    { rating: 2, count: 10 },
    { rating: 3, count: 25 },
    { rating: 4, count: 50 },
    { rating: 5, count: 34 },
];

const ratingChartConfig: ChartConfig = {
    count: {
        label: "Responses"
    }
}

const yesNoData = [
    { name: 'Yes', value: 102 },
    { name: 'No', value: 22 },
];

const likertData = [
    { name: 'Strongly Disagree', value: 5 },
    { name: 'Disagree', value: 12 },
    { name: 'Neutral', value: 20 },
    { name: 'Agree', value: 60 },
    { name: 'Strongly Agree', value: 27 },
]

export function SummaryView({ form }: { form: Form }) {
  return (
    <div className="grid gap-6">
        {form.questions.map((question) => {
            if (question.type === 'rating') {
                return (
                    <Card key={question.id}>
                        <CardHeader>
                            <CardTitle className="font-headline text-lg">{question.text}</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <ChartContainer config={ratingChartConfig} className="h-[250px] w-full">
                                <BarChart data={ratingData}>
                                    <CartesianGrid vertical={false} />
                                    <XAxis dataKey="rating" tickLine={false} axisLine={false} />
                                    <YAxis width={30} />
                                    <Tooltip cursor={false} content={<ChartTooltipContent />} />
                                    <Bar dataKey="count" fill="var(--color-primary)" radius={4} />
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                )
            }
             if (question.type === 'yes-no') {
                return (
                    <Card key={question.id}>
                        <CardHeader>
                            <CardTitle className="font-headline text-lg">{question.text}</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <ChartContainer config={{}} className="h-[250px] w-full">
                                <PieChart>
                                <Tooltip content={<ChartTooltipContent hideLabel />} />
                                <Pie data={yesNoData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                    {yesNoData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                </PieChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                )
            }
             if (question.type === 'likert' || question.type === 'multiple-choice') {
                return (
                    <Card key={question.id}>
                        <CardHeader>
                            <CardTitle className="font-headline text-lg">{question.text}</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <ChartContainer config={{}} className="h-[250px] w-full">
                                <BarChart data={likertData} layout="vertical">
                                    <CartesianGrid horizontal={false} />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" width={120} tickLine={false} axisLine={false}/>
                                    <Tooltip cursor={false} content={<ChartTooltipContent />} />
                                    <Bar dataKey="value" fill="var(--color-primary)" radius={4} />
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
