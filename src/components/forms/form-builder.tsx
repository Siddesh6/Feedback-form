'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, GripVertical, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import type { Question } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

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
        <div className="flex items-center justify-between">
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
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const { toast } = useToast();
  const router = useRouter();

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

  const handleSave = () => {
    console.log({ title, description, questions });
    toast({
      title: 'Form Saved!',
      description: 'Redirecting to analytics and sharing page.',
    });
    // In a real app, this would use the ID of the form just saved.
    // For this demo, we redirect to a pre-added form's analytics page.
    router.push('/forms/user-created-form-1/analytics');
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
                        placeholder="Form Description..."
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
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="event">Event</SelectItem>
                                <SelectItem value="course">Course</SelectItem>
                                <SelectItem value="faculty">Faculty</SelectItem>
                                <SelectItem value="workshop">Workshop</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Switch id="anonymous-mode" />
                        <Label htmlFor="anonymous-mode">Allow Anonymous Submissions</Label>
                    </div>
                </CardContent>
            </Card>
            <div className="flex gap-2">
                <Button variant="outline" className="w-full" onClick={() => window.open('/forms/user-created-form-1', '_blank')}>Preview</Button>
                <Button className="w-full" onClick={handleSave}>Save Form</Button>
            </div>
        </div>
    </div>
  );
}
