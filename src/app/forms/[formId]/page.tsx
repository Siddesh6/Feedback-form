'use client';

import { useState, useEffect } from 'react';
import { notFound, useParams } from 'next/navigation';
import { getFormById } from '@/lib/firestore-data';
import { useFirestore } from '@/firebase';
import { FeedbackForm } from '@/components/forms/feedback-form';
import { Form } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function FormPage() {
  const params = useParams<{ formId: string }>();
  const firestore = useFirestore();
  const [form, setForm] = useState<Form | null | undefined>(undefined);
  
  useEffect(() => {
    if (firestore && params.formId) {
      getFormById(firestore, params.formId).then(formData => {
        setForm(formData);
      });
    }
  }, [firestore, params.formId]);

  if (form === undefined) { // Loading state
    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-secondary p-4">
            <div className="w-full max-w-2xl space-y-4">
                <Skeleton className="h-4 w-full" />
                <div className="bg-card p-6 sm:p-8 rounded-xl shadow-lg space-y-4">
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-1/2" />
                    <div className="pt-8 space-y-4">
                        <Skeleton className="h-6 w-1/3" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t">
                        <Skeleton className="h-10 w-24" />
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-10 w-24" />
                    </div>
                </div>
            </div>
        </div>
    );
  }

  if (form === null) { // Not found state
    notFound();
  }

  return <FeedbackForm form={form} />;
}
