'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Send } from 'lucide-react';
import type { Form, Question } from '@/lib/types';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

function QuestionRenderer({ question }: { question: Question }) {
  const { id, type, text, required, options, scale, imageUrl } = question;

  const imageDisplay = imageUrl ? (
    <div className="mb-4 relative h-64 w-full rounded-md overflow-hidden">
        <Image src={imageUrl} alt={text} fill className="object-contain" />
    </div>
  ) : null;

  switch (type) {
    case 'short-text':
      return (
        <div className="space-y-2">
          {imageDisplay}
          <Label htmlFor={id}>{text}</Label>
          <Input id={id} required={required} />
        </div>
      );
    case 'long-text':
      return (
        <div className="space-y-2">
          {imageDisplay}
          <Label htmlFor={id}>{text}</Label>
          <Textarea id={id} required={required} />
        </div>
      );
    case 'yes-no':
      return (
        <div className="space-y-2">
          {imageDisplay}
          <Label>{text}</Label>
          <RadioGroup className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Yes" id={`${id}-yes`} />
              <Label htmlFor={`${id}-yes`}>Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="No" id={`${id}-no`} />
              <Label htmlFor={`${id}-no`}>No</Label>
            </div>
          </RadioGroup>
        </div>
      );
    case 'multiple-choice':
      return (
        <div className="space-y-2">
          {imageDisplay}
          <Label>{text}</Label>
          <RadioGroup>
            {options?.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${id}-${option}`} />
                <Label htmlFor={`${id}-${option}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      );
    case 'checkbox':
        return (
            <div className="space-y-2">
                {imageDisplay}
                <Label>{text}</Label>
                <div className="space-y-2">
                {options?.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                        <Checkbox id={`${id}-${option}`} />
                        <Label htmlFor={`${id}-${option}`}>{option}</Label>
                    </div>
                ))}
                </div>
            </div>
        );
    case 'rating':
        return (
            <div className="space-y-2">
                {imageDisplay}
                <Label>{text}</Label>
                <RadioGroup className="flex flex-wrap gap-2">
                {Array.from({ length: scale || 5 }, (_, i) => i + 1).map((val) => (
                    <div key={val} className="flex items-center space-x-2">
                    <RadioGroupItem value={String(val)} id={`${id}-${val}`} />
                    <Label htmlFor={`${id}-${val}`}>{val}</Label>
                    </div>
                ))}
                </RadioGroup>
            </div>
        );
    case 'likert':
        return (
            <div className="space-y-2">
                {imageDisplay}
                <Label className="block mb-2">{text}</Label>
                <RadioGroup className="flex flex-col sm:flex-row justify-between gap-4">
                    {options?.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`${id}-${option}`} />
                        <Label htmlFor={`${id}-${option}`}>{option}</Label>
                    </div>
                    ))}
                </RadioGroup>
            </div>
        )
    default:
      return null;
  }
}

export function FeedbackForm({ form }: { form: Form }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isAnonymous, setIsAnonymous] = useState(form.anonymous);
  const totalSteps = form.questions.length;
  const [currentStep, setCurrentStep] = useState(0);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentStep < totalSteps - 1) {
        setCurrentStep(currentStep + 1);
    } else {
        toast({
            title: "Submitting feedback...",
            description: "Please wait.",
        });
        setTimeout(() => {
            router.push(`/forms/${form.id}/thank-you`);
        }, 1500);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
        setCurrentStep(currentStep - 1);
    }
  }

  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-secondary p-4">
        <div className="w-full max-w-2xl">
            <Progress value={progress} className="mb-4" />
            <div className="bg-card p-6 sm:p-8 rounded-xl shadow-lg">
                <h1 className="text-2xl font-bold mb-2 font-headline">{form.title}</h1>
                <p className="text-muted-foreground mb-6">{form.description}</p>
                
                {form.anonymous && (
                    <div className="flex items-center space-x-2 rounded-md border p-4 mb-6 bg-secondary/50">
                        <Switch id="anonymous-mode" checked={isAnonymous} onCheckedChange={setIsAnonymous}/>
                        <Label htmlFor="anonymous-mode">Submit Anonymously</Label>
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-8">
                    <QuestionRenderer question={form.questions[currentStep]} />
                    <div className="flex justify-between items-center pt-4 border-t">
                        <Button type="button" variant="outline" onClick={handleBack} disabled={currentStep === 0}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back
                        </Button>
                        <p className="text-sm text-muted-foreground">
                            Step {currentStep + 1} of {totalSteps}
                        </p>
                        <Button type="submit">
                            {currentStep < totalSteps - 1 ? 'Next' : 'Submit'}
                            <Send className="h-4 w-4 ml-2" />
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  );
}
