'use client';

import { Bar, BarChart, CartesianGrid, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

const responseData = [
  { name: 'CS101', responses: 124, fill: 'var(--color-cs101)' },
  { name: 'AI Ethics W.', responses: 38, fill: 'var(--color-ai-ethics)' },
  { name: 'Tech Conf', responses: 890, fill: 'var(--color-tech-conf)' },
  { name: 'Prof. Doe', responses: 56, fill: 'var(--color-prof-doe)' },
];

const chartConfig: ChartConfig = {
    responses: {
      label: 'Responses',
    },
    cs101: {
      label: 'CS101',
      color: 'hsl(var(--chart-1))',
    },
    'ai-ethics': {
      label: 'AI Ethics',
      color: 'hsl(var(--chart-2))',
    },
    'tech-conf': {
      label: 'Tech Conf',
      color: 'hsl(var(--chart-3))',
    },
    'prof-doe': {
      label: 'Prof. Doe',
      color: 'hsl(var(--chart-4))',
    },
};

const categoryData = [
    { category: 'Course', count: 180, fill: 'var(--color-course)'},
    { category: 'Workshop', count: 38, fill: 'var(--color-workshop)'},
    { category: 'Event', count: 890, fill: 'var(--color-event)'},
    { category: 'Faculty', count: 56, fill: 'var(--color-faculty)'},
]

const categoryChartConfig: ChartConfig = {
    count: {
        label: "Responses"
    },
    course: {
        label: "Course",
        color: "hsl(var(--chart-1))"
    },
    workshop: {
        label: "Workshop",
        color: "hsl(var(--chart-2))"
    },
    event: {
        label: "Event",
        color: "hsl(var(--chart-3))"
    },
    faculty: {
        label: "Faculty",
        color: "hsl(var(--chart-4))"
    }
}


export function DashboardCharts() {
  return (
    <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Responses per Form</CardTitle>
        </CardHeader>
        <CardContent>
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
              <Bar dataKey="responses" radius={8} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Responses by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={categoryChartConfig} className="min-h-[300px] w-full">
            <PieChart>
              <Tooltip content={<ChartTooltipContent nameKey="count" hideLabel />} />
              <Pie data={categoryData} dataKey="count" nameKey="category" innerRadius={60} />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
