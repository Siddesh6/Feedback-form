'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Plus, GripVertical, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import type { Form, Question } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/firebase';
import { addForm } from '@/lib/firestore-data';

type QuestionType = Question['type'];

const questionTypeOptions: { value: QuestionType; label: string }[] = [
  { value: 'short-text', label: 'Short Text' },
  { value: 'long-text', label: 'Long Text' },
  { value: 'multiple-choice', label: 'Multiple Choice' },
  { value: 'checkbox', label: 'Checkboxes' },
  { value: 'rating', label: 'Rating Scale' },
  { value: 'yes-no', label: 'Yes/No' },
  { value: 'likert', label: 'Likert Scale' },
];

const isValidUrl = (urlString?: string): boolean => {
  if (!urlString) return false;
  try {
    new URL(urlString);
    return true;
  } catch (e) {
    return false;
  }
};

function QuestionEditor({
    question,
    onUpdate,
    onDelete,
    onMove,
    isFirst,
    isLast,
}: {
    question: Question;
    onUpdate: (updatedQuestion: Question) => void;
    onDelete: () => void;
    onMove: (direction: 'up' | 'down') => void;
    isFirst: boolean;
    isLast: boolean;
}) {
  return (
    <Card className="bg-secondary/50">
      <CardHeader className="flex flex-row items-center gap-4 space-y-0 p-4">
        <GripVertical className="h-5 w-5 text-muted-foreground" />
        <Input
          value={question.text}
          onChange={(e) => onUpdate({ ...question, text: e.target.value })}
          placeholder="Enter your question"
          className="flex-grow text-md font-semibold"
        />
        <Select
            value={question.type}
            onValueChange={(type: QuestionType) => {
                const updatedQuestion: Question = {
                    id: question.id,
                    text: question.text,
                    required: question.required,
                    type: type,
                };
                if (type === 'multiple-choice' || type === 'checkbox') {
                    updatedQuestion.options = ['Option 1'];
                } else if (type === 'likert') {
                    updatedQuestion.options = ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'];
                } else if (type === 'rating') {
                    updatedQuestion.scale = 5;
                }
                onUpdate(updatedQuestion);
            }}
        >
            <SelectTrigger className="w-[180px]">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {questionTypeOptions.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => onMove('up')} disabled={isFirst}>
                <ArrowUp className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onMove('down')} disabled={isLast}>
                <ArrowDown className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onDelete} className="text-destructive hover:text-destructive">
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-4">
        {(question.type === 'multiple-choice' || question.type === 'checkbox') && (
            <div>
                <Label>Options</Label>
                {question.options?.map((option, index) => (
                    <div key={index} className="flex items-center gap-2 mt-2">
                        <Input value={option} onChange={(e) => {
                            const newOptions = [...(question.options || [])];
                            newOptions[index] = e.target.value;
                            onUpdate({ ...question, options: newOptions });
                        }} />
                        <Button variant="ghost" size="icon" onClick={() => {
                             const newOptions = [...(question.options || [])];
                             newOptions.splice(index, 1);
                             onUpdate({ ...question, options: newOptions });
                        }}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                ))}
                 <Button variant="outline" size="sm" className="mt-2" onClick={() => onUpdate({ ...question, options: [...(question.options || []), `Option ${ (question.options?.length || 0) + 1}`] })}>Add Option</Button>
            </div>
        )}
        <div className="space-y-2">
            <Label>Question Image (Optional)</Label>
            <div className="flex items-center gap-2">
                <Input
                placeholder="Paste image URL..."
                value={question.imageUrl || ''}
                onChange={(e) => onUpdate({ ...question, imageUrl: e.target.value })}
                />
            </div>
            {isValidUrl(question.imageUrl) && (
                <div className="mt-2 relative aspect-video w-full max-w-sm rounded-md overflow-hidden border">
                <Image
                    src={question.imageUrl!}
                    alt="Question preview"
                    fill
                    className="object-cover"
                />
                <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-7 w-7 z-10"
                    onClick={() => onUpdate({ ...question, imageUrl: undefined })}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
                </div>
            )}
        </div>
        <div className="flex items-center justify-between border-t pt-4 mt-4">
            <div className="flex items-center space-x-2">
                <Switch id={`required-${question.id}`} checked={question.required} onCheckedChange={(checked) => onUpdate({ ...question, required: checked })} />
                <Label htmlFor={`required-${question.id}`}>Required</Label>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function FormBuilder() {
  const [title, setTitle] = useState('New Feedback Form');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'Event' | 'Course' | 'Faculty' | 'Workshop'>('Workshop');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [anonymous, setAnonymous] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const firestore = useFirestore();

  const addQuestion = (type: QuestionType) => {
    const newQuestion: Question = {
      id: `q-${Date.now()}`,
      text: '',
      type,
      required: false,
      ...( (type === 'multiple-choice' || type === 'checkbox') && { options: ['Option 1'] } ),
      ...( type === 'likert' && { options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'] } ),
      ...( type === 'rating' && { scale: 5 } ),
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (index: number, updatedQuestion: Question) => {
    const newQuestions = [...questions];
    newQuestions[index] = updatedQuestion;
    setQuestions(newQuestions);
  };
  
  const deleteQuestion = (index: number) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  }

  const moveQuestion = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === questions.length - 1) return;

    const newQuestions = [...questions];
    const questionToMove = newQuestions[index];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    newQuestions[index] = newQuestions[swapIndex];
    newQuestions[swapIndex] = questionToMove;
    setQuestions(newQuestions);
  }

  const handleSave = async () => {
    if (!title.trim()) {
        toast({
            variant: 'destructive',
            title: 'Title is required',
            description: 'Please provide a title for your form.'
        });
        return;
    }
    if (!firestore) {
        toast({
            variant: 'destructive',
            title: 'Database not available',
            description: 'Please try again later.'
        });
        return;
    }
    
    setIsSaving(true);
    toast({
      title: 'Saving Form...',
      description: 'Your new form is being created.',
    });

    const newForm: Omit<Form, 'id' | 'createdAt' | 'responseCount'> = {
        title,
        description,
        questions,
        category,
        anonymous,
        status: 'active',
    };

    try {
        const newFormId = await addForm(firestore, newForm);
        toast({
          title: 'Form Saved!',
          description: 'Redirecting to analytics and sharing page.',
        });
        router.push(`/forms/${newFormId}/analytics`);
    } catch (error) {
        console.error("Error saving form:", error);
        toast({
            variant: 'destructive',
            title: 'Failed to save form',
            description: 'There was an error saving your form to the database.'
        });
        setIsSaving(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
            <Card>
                <CardContent className="p-6 space-y-4">
                    <Input 
                        placeholder="Form Title" 
                        className="text-2xl font-bold h-auto p-2 border-0 shadow-none focus-visible:ring-0 font-headline"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <Textarea 
                        placeholder="Form Description (optional)..."
                        className="border-0 shadow-none focus-visible:ring-0"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </CardContent>
            </Card>

            <div className="space-y-4">
                {questions.map((q, index) => (
                    <QuestionEditor 
                        key={q.id} 
                        question={q} 
                        onUpdate={(updated) => updateQuestion(index, updated)}
                        onDelete={() => deleteQuestion(index)}
                        onMove={(dir) => moveQuestion(index, dir)}
                        isFirst={index === 0}
                        isLast={index === questions.length - 1}
                    />
                ))}
            </div>

            <Button
                onClick={() => addQuestion('short-text')}
                variant="outline"
                className="w-full"
            >
                <Plus className="mr-2 h-4 w-4" />
                Add Question
            </Button>

        </div>
        <div className="lg:col-span-1 space-y-6">
            <Card>
                <CardHeader>
                    <h3 className="font-semibold font-headline">Form Settings</h3>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Category</Label>
                        <Select value={category} onValueChange={(value: any) => setCategory(value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Event">Event</SelectItem>
                                <SelectItem value="Course">Course</SelectItem>
                                <SelectItem value="Faculty">Faculty</SelectItem>
                                <SelectItem value="Workshop">Workshop</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Switch id="anonymous-mode" checked={anonymous} onCheckedChange={setAnonymous}/>
                        <Label htmlFor="anonymous-mode">Allow Anonymous Submissions</Label>
                    </div>
                </CardContent>
            </Card>
            <div className="flex flex-col gap-2">
                <Button className="w-full" onClick={handleSave} disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save and Publish'}
                </Button>
                 <Button variant="outline" className="w-full" disabled>Preview</Button>
                 <p className="text-xs text-muted-foreground text-center">You can preview after saving.</p>
            </div>
        </div>
    </div>
  );
}
