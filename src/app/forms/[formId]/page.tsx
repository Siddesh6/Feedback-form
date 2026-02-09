import { notFound } from 'next/navigation';
import { getFormById } from '@/lib/data';
import { FeedbackForm } from '@/components/forms/feedback-form';

type FormPageProps = {
  params: {
    formId: string;
  };
};

export default function FormPage({ params }: FormPageProps) {
  const form = getFormById(params.formId);

  if (!form) {
    notFound();
  }

  return <FeedbackForm form={form} />;
}
