export type Question = {
  id: string;
  text: string;
  type: 'short-text' | 'long-text' | 'multiple-choice' | 'checkbox' | 'rating' | 'yes-no' | 'likert';
  imageUrl?: string;
  options?: string[];
  scale?: 5 | 10;
  required: boolean;
};

export type Form = {
  id: string;
  title: string;
  description: string;
  category: 'Event' | 'Course' | 'Faculty' | 'Workshop';
  questions: Question[];
  anonymous: boolean;
  status: 'active' | 'expired';
  createdAt: string;
  responseCount: number;
  userId: string;
};

export type Answer = {
  questionId: string;
  value: string | string[];
};

export type FeedbackResponse = {
  id: string;
  formId: string;
  isAnonymous: boolean;
  submittedAt: string;
  answers: Answer[];
  sentiment?: 'positive' | 'negative' | 'neutral';
  sentimentScore?: number;
  textFeedback: string;
};

export type UserRole = 'admin' | 'user';

export type User = {
  uid: string;
  email: string | null;
  role: UserRole;
};
