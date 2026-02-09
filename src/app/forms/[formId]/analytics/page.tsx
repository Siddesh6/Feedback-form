import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { BarChart, Bot, MessageSquare, QrCode } from 'lucide-react';
import { format, parseISO } from 'date-fns';

import { getFormById, getResponsesByFormId } from '@/lib/data';
import { AdminLayout } from '@/components/layout/admin-layout';
import { AiInsights } from '@/components/analytics/ai-insights';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SummaryView } from '@/components/analytics/summary-view';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

type AnalyticsPageProps = {
  params: {
    formId: string;
  };
};

export default function AnalyticsPage({ params }: AnalyticsPageProps) {
  const form = getFormById(params.formId);
  if (!form) {
    notFound();
  }
  const responses = getResponsesByFormId(form.id);

  const formUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/forms/${form.id}` 
    : `https://example.com/forms/${form.id}`;

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    formUrl
  )}`;

  return (
    <AdminLayout>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight font-headline">{form.title}</h1>
          <p className="text-muted-foreground">
            Created on {format(parseISO(form.createdAt), 'MMMM d, yyyy')}
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline"><QrCode className="mr-2 h-4 w-4"/> Share Form</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Share Form</DialogTitle>
              <DialogDescription>
                Anyone with the link or QR code can submit feedback.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center gap-4">
              <Image src={qrCodeUrl} alt="QR Code" width={200} height={200} data-ai-hint="qr code"/>
              <p className="text-sm text-muted-foreground">Or share this link:</p>
              <input readOnly value={formUrl} className="w-full rounded-md border bg-muted px-3 py-2 text-sm" />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="summary">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="summary">
            <BarChart className="mr-2 h-4 w-4" /> Summary
          </TabsTrigger>
          <TabsTrigger value="responses">
            <MessageSquare className="mr-2 h-4 w-4" /> Individual Responses
          </TabsTrigger>
          <TabsTrigger value="ai-insights">
            <Bot className="mr-2 h-4 w-4" /> AI Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="mt-4">
          <SummaryView form={form} />
        </TabsContent>
        <TabsContent value="responses" className="mt-4">
          <Carousel className="w-full max-w-2xl mx-auto">
            <CarouselContent>
              {responses.map((response) => (
                <CarouselItem key={response.id}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Response #{response.id}</CardTitle>
                            <CardDescription>
                                Submitted on {format(parseISO(response.submittedAt), 'PPpp')}
                                {response.isAnonymous && <Badge variant="secondary" className="ml-2">Anonymous</Badge>}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {response.answers.map((answer, index) => {
                                const question = form.questions.find(q => q.id === answer.questionId);
                                return (
                                <div key={index}>
                                    <p className="font-semibold">{question?.text}</p>
                                    <p className="text-muted-foreground pl-4 border-l-2 ml-2">
                                        {Array.isArray(answer.value) ? answer.value.join(', ') : answer.value}
                                    </p>
                                </div>
                                )
                            })}
                        </CardContent>
                    </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </TabsContent>
        <TabsContent value="ai-insights" className="mt-4">
          <AiInsights form={form} />
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}
