'use client';

import { useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import { BarChart, Bot, MessageSquare, QrCode, Download, Printer } from 'lucide-react';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SummaryView } from '@/components/analytics/summary-view';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';

export default function AnalyticsPage() {
  const params = useParams<{ formId: string }>();
  const form = getFormById(params.formId);

  if (!form) {
    notFound();
  }
  const responses = getResponsesByFormId(form.id);

  const [formUrl, setFormUrl] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/forms/${form.id}`;
      setFormUrl(url);
      setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`);
    }
  }, [form.id]);

  const handleDownloadCsv = () => {
    if (!form || !responses) return;

    const escapeCsvCell = (cell: any) => {
        const str = String(cell ?? '').replace(/"/g, '""');
        return `"${str}"`;
    };

    const headers = ['Response ID', 'Submitted At', 'Is Anonymous', ...form.questions.map(q => q.text)];
    const csvHeader = headers.map(escapeCsvCell).join(',');

    const csvRows = responses.map(response => {
      const answerMap = new Map(response.answers.map(a => [a.questionId, Array.isArray(a.value) ? a.value.join(', ') : a.value]));
      const rowData = [
        response.id,
        response.submittedAt,
        response.isAnonymous.toString(),
        ...form.questions.map(q => answerMap.get(q.id) || ''),
      ];
      return rowData.map(escapeCsvCell).join(',');
    });

    const csvContent = [csvHeader, ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${form.id}_responses.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight font-headline">{form.title}</h1>
          <p className="text-muted-foreground">
            Created on {format(parseISO(form.createdAt), 'MMMM d, yyyy')}
          </p>
        </div>
        <div className="flex items-center gap-2 print-hide">
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
                {qrCodeUrl ? (
                    <Image src={qrCodeUrl} alt="QR Code" width={200} height={200} data-ai-hint="qr code"/>
                ) : (
                    <Skeleton className="h-[200px] w-[200px]" />
                )}
                <p className="text-sm text-muted-foreground">Or share this link:</p>
                {formUrl ? (
                    <Input readOnly value={formUrl} className="w-full rounded-md border bg-muted px-3 py-2 text-sm" />
                ) : (
                    <Skeleton className="h-10 w-full" />
                )}
                </div>
            </DialogContent>
            </Dialog>
            <Button variant="outline" onClick={handleDownloadCsv}><Download className="mr-2 h-4 w-4"/> Download CSV</Button>
            <Button variant="outline" onClick={handlePrint}><Printer className="mr-2 h-4 w-4"/> Print</Button>
        </div>
      </div>

      <Tabs defaultValue="summary">
        <TabsList className="grid w-full grid-cols-3 print-hide">
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
            <Card>
                <CardHeader>
                    <CardTitle>All Responses ({responses.length})</CardTitle>
                    <CardDescription>
                        Browse through all submissions for this form.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Response ID</TableHead>
                                <TableHead>Submission Date</TableHead>
                                <TableHead>Anonymous</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {responses.map((response) => (
                                <TableRow key={response.id}>
                                    <TableCell className="font-mono text-xs">{response.id}</TableCell>
                                    <TableCell>{format(parseISO(response.submittedAt), 'PPpp')}</TableCell>
                                    <TableCell>
                                        {response.isAnonymous ? <Badge variant="secondary">Yes</Badge> : <Badge variant="outline">No</Badge>}
                                    </TableCell>
                                    <TableCell className="text-right">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" size="sm">View</Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-2xl">
                                            <DialogHeader>
                                                <DialogTitle>Response #{response.id}</DialogTitle>
                                                <DialogDescription>
                                                    Submitted on {format(parseISO(response.submittedAt), 'PPpp')}
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-6">
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
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="ai-insights" className="mt-4">
          <AiInsights form={form} />
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}
