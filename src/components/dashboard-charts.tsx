'use client';

import { Bar, BarChart, CartesianGrid, Pie, PieChart, Cell, Tooltip, XAxis, YAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import type { Form } from '@/lib/types';
import { useMemo } from 'react';

const chartColors = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

export function DashboardCharts({ forms }: { forms: Form[] }) {

  const responseData = useMemo(() => {
    return forms.map(form => ({
        name: form.title.length > 15 ? form.title.substring(0, 12) + '...' : form.title,
        responses: form.responseCount
    }));
  }, [forms]);

  const chartConfig: ChartConfig = {
      responses: {
        label: 'Responses',
        color: 'hsl(var(--primary))'
      },
  };

  const categoryData = useMemo(() => {
    if (forms.length === 0) return [];
    const categories = forms.reduce((acc, form) => {
        const categoryName = form.category || 'Uncategorized';
        if (!acc[categoryName]) {
            acc[categoryName] = 0;
        }
        acc[categoryName] += form.responseCount;
        return acc;
    }, {} as Record<string, number>);

    return Object.entries(categories).map(([category, count]) => ({
        category,
        count
    }));
  }, [forms]);

  const categoryChartConfig: ChartConfig = useMemo(() => {
    const config: ChartConfig = {
        count: { label: "Responses" }
    };
    categoryData.forEach((data, index) => {
        config[data.category.toLowerCase().replace(' ', '-')] = {
            label: data.category,
            color: chartColors[index % chartColors.length]
        };
    });
    return config;
  }, [categoryData]);

  const noData = <div className="flex h-full w-full items-center justify-center text-muted-foreground">No data to display</div>;

  return (
    <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Responses per Form</CardTitle>
        </CardHeader>
        <CardContent>
          {responseData.length > 0 ? (
            <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
              <BarChart accessibilityLayer data={responseData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <YAxis />
                <Tooltip cursor={false} content={<ChartTooltipContent />} />
                <Bar dataKey="responses" fill="var(--color-responses)" radius={8} />
              </BarChart>
            </ChartContainer>
          ) : noData }
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Responses by Category</CardTitle>
        </CardHeader>
        <CardContent>
          {categoryData.length > 0 ? (
            <ChartContainer config={categoryChartConfig} className="min-h-[300px] w-full">
              <PieChart>
                <Tooltip content={<ChartTooltipContent nameKey="count" hideLabel />} />
                <Pie data={categoryData} dataKey="count" nameKey="category" innerRadius={60}>
                  {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          ) : noData }
        </CardContent>
      </Card>
    </div>
  );
}
