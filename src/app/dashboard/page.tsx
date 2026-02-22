'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Activity,
  ArrowUpRight,
  ClipboardList,
  MessageSquare,
  PlusCircle,
  Trash2,
  Users,
} from 'lucide-react';
import { getForms, deleteForm } from '@/lib/firestore-data';
import { useFirestore } from '@/firebase';
import { useUser } from '@/firebase/auth/use-user';
import { AdminLayout } from '@/components/layout/admin-layout';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DashboardCharts } from '@/components/dashboard-charts';
import { format, parseISO } from 'date-fns';
import { Form } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function DashboardPage() {
  const firestore = useFirestore();
  const { user, loading: userLoading } = useUser();
  const { toast } = useToast();
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [formToDelete, setFormToDelete] = useState<Form | null>(null);

  useEffect(() => {
    if (firestore && user) {
      setLoading(true);
      getForms(firestore, user).then(data => {
        setForms(data);
        setLoading(false);
      }).catch(err => {
        console.error("Failed to fetch forms:", err);
        setLoading(false);
      });
    }
  }, [firestore, user]);

  const handleDeleteForm = async () => {
    if (!formToDelete || !firestore) return;

    try {
        await deleteForm(firestore, formToDelete.id);
        setForms(forms.filter(form => form.id !== formToDelete.id));
        toast({
            title: "Form deleted",
            description: `"${formToDelete.title}" and all its responses have been deleted.`,
        });
    } catch (error) {
        console.error("Failed to delete form:", error);
        toast({
            variant: "destructive",
            title: "Deletion failed",
            description: "There was a problem deleting the form.",
        });
    } finally {
        setFormToDelete(null);
    }
  };
  
  const totalResponses = forms.reduce((acc, form) => acc + form.responseCount, 0);
  const activeForms = forms.filter((form) => form.status === 'active').length;
  const avgResponses = forms.length > 0 ? Math.round(totalResponses / forms.length) : 0;

  const renderContent = () => {
    if (loading || userLoading) {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight font-headline">Dashboard</h1>
            <Button disabled>
                <PlusCircle className="mr-2 h-4 w-4"/>
                Create Form
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
          </div>
          <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
              <Skeleton className="h-80" />
              <Skeleton className="h-80" />
          </div>
          <Card>
            <CardHeader><Skeleton className="h-8 w-48" /></CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
            </CardContent>
          </Card>
        </div>
      )
    }

    return (
      <>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight font-headline">Dashboard</h1>
          <Button asChild>
              <Link href="/forms/builder">
                  <PlusCircle className="mr-2 h-4 w-4"/>
                  Create Form
              </Link>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Forms</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{forms.length}</div>
              <p className="text-xs text-muted-foreground">
                All feedback forms created
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Responses
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalResponses.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Across all forms
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Forms</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeForms}</div>
              <p className="text-xs text-muted-foreground">
                Currently collecting feedback
              </p>
            </CardContent>
          </Card>
          <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg. Responses</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold">{avgResponses}</div>
                  <p className="text-xs text-muted-foreground">
                      Per form on average
                  </p>
              </CardContent>
          </Card>
        </div>
        
        <DashboardCharts forms={forms} />

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Recent Forms</CardTitle>
          </CardHeader>
          <CardContent>
            {forms.length === 0 ? (
                <div className="text-center text-muted-foreground py-12">
                    <p>No forms created yet.</p>
                    <Button variant="link" asChild><Link href="/forms/builder">Create your first form</Link></Button>
                </div>
            ) : (
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Form Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Responses</TableHead>
                        <TableHead className="hidden md:table-cell">Created</TableHead>
                        <TableHead className="text-right">
                            Actions
                        </TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {forms.slice(0, 5).map((form) => (
                        <TableRow key={form.id}>
                        <TableCell className="font-medium">{form.title}</TableCell>
                        <TableCell>
                            <Badge variant="outline">{form.category}</Badge>
                        </TableCell>
                        <TableCell>
                            <Badge variant={form.status === 'active' ? 'default' : 'secondary'}>
                            {form.status}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right">{form.responseCount}</TableCell>
                        <TableCell className="hidden md:table-cell">{format(parseISO(form.createdAt), 'MMM d, yyyy')}</TableCell>
                        <TableCell className="text-right">
                            <Button asChild variant="ghost" size="icon">
                            <Link href={`/forms/${form.id}/analytics`}>
                                <ArrowUpRight className="h-4 w-4" />
                            </Link>
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => setFormToDelete(form)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            )}
          </CardContent>
        </Card>
      </>
    )
  }
  
  return (
    <AdminLayout>
      {renderContent()}
       <AlertDialog open={formToDelete !== null} onOpenChange={(isOpen) => !isOpen && setFormToDelete(null)}>
          <AlertDialogContent>
              <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                      This will permanently delete the form "{formToDelete?.title}" and all of its responses. This action cannot be undone.
                  </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setFormToDelete(null)}>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteForm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
