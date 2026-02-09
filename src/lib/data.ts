import type { Form, FeedbackResponse } from './types';

export const forms: Form[] = [
  {
    id: 'course-feedback-spring-2024',
    title: 'CS101 Course Feedback - Spring 2024',
    description: 'Please provide your feedback on the CS101 course offered this semester. Your honest opinions are highly valued.',
    category: 'Course',
    questions: [
      { id: 'q1', text: 'How would you rate the overall quality of this course?', type: 'rating', scale: 5, required: true },
      { id: 'q2', text: 'Were the course objectives clearly defined?', type: 'yes-no', required: true },
      { id: 'q3', text: 'The course materials were helpful and relevant.', type: 'likert', options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'], required: true },
      { id: 'q4', text: 'What did you like most about the course?', type: 'long-text', required: false },
      { id: 'q5', text: 'What aspects of the course could be improved?', type: 'long-text', required: true },
      { id: 'q6', text: 'Which topics did you find most interesting?', type: 'checkbox', options: ['Introduction to Programming', 'Data Structures', 'Algorithms', 'Object-Oriented Programming'], required: false },
    ],
    anonymous: true,
    status: 'active',
    createdAt: '2024-05-15T10:00:00Z',
    responseCount: 124,
  },
  {
    id: 'workshop-on-ai-ethics',
    title: 'Workshop on AI Ethics',
    description: 'Thank you for attending our workshop. Please share your thoughts to help us improve future events.',
    category: 'Workshop',
    questions: [
      { id: 'w1', text: 'Overall satisfaction with the workshop:', type: 'rating', scale: 10, required: true },
      { id: 'w2', text: 'How relevant was the content to your work/interests?', type: 'rating', scale: 5, required: true },
      { id: 'w3', text: 'The workshop was well-organized.', type: 'likert', options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'], required: true },
      { id: 'w4', text: 'Any suggestions for future workshop topics?', type: 'short-text', required: false },
    ],
    anonymous: false,
    status: 'active',
    createdAt: '2024-06-20T14:00:00Z',
    responseCount: 38,
  },
  {
    id: 'annual-tech-conference-2023',
    title: 'Annual Tech Conference 2023 Feedback',
    description: 'Your feedback is crucial for making next year\'s conference even better.',
    category: 'Event',
    questions: [
      { id: 'e1', text: 'How would you rate the event overall?', type: 'rating', scale: 10, required: true },
    ],
    anonymous: true,
    status: 'expired',
    createdAt: '2023-11-01T09:00:00Z',
    responseCount: 890,
  },
  {
    id: 'prof-jane-doe-evaluation',
    title: 'Faculty Evaluation: Prof. Jane Doe',
    description: 'Please evaluate Prof. Jane Doe\'s teaching performance for the course "Advanced Astrophysics".',
    category: 'Faculty',
    questions: [],
    anonymous: true,
    status: 'active',
    createdAt: '2024-05-10T00:00:00Z',
    responseCount: 56,
  },
  {
    id: 'user-created-form-1',
    title: 'My Custom Form',
    description: 'This is a form created from the form builder, ready for preview and sharing.',
    category: 'Workshop',
    questions: [
        { id: 'q1-new', text: 'What is your name?', type: 'short-text', required: true },
        { id: 'q2-new', text: 'What did you think of the event?', type: 'long-text', required: false, imageUrl: 'https://picsum.photos/seed/event/400/200' },
        { id: 'q3-new', text: 'Would you recommend this to a friend?', type: 'yes-no', required: true },
    ],
    anonymous: true,
    status: 'active',
    createdAt: '2024-07-26T10:00:00Z',
    responseCount: 1,
  },
];

export const responses: FeedbackResponse[] = [
    {
        id: 'resp1',
        formId: 'course-feedback-spring-2024',
        isAnonymous: true,
        submittedAt: '2024-05-20T11:30:00Z',
        answers: [
            { questionId: 'q1', value: '5' },
            { questionId: 'q2', value: 'Yes' },
            { questionId: 'q3', value: 'Strongly Agree' },
            { questionId: 'q4', value: 'The hands-on coding assignments were fantastic!' },
            { questionId: 'q5', value: 'The pace was a bit too fast in the last two weeks.' },
            { questionId: 'q6', value: ['Data Structures', 'Algorithms'] },
        ],
        textFeedback: 'The hands-on coding assignments were fantastic! The pace was a bit too fast in the last two weeks.',
    },
    {
        id: 'resp2',
        formId: 'course-feedback-spring-2024',
        isAnonymous: true,
        submittedAt: '2024-05-21T09:05:00Z',
        answers: [
            { questionId: 'q1', value: '3' },
            { questionId: 'q2', value: 'No' },
            { questionId: 'q3', value: 'Disagree' },
            { questionId: 'q4', value: '' },
            { questionId: 'q5', value: 'The lectures were very theoretical and hard to connect with practical applications. More real-world examples would be great.' },
            { questionId: 'q6', value: ['Introduction to Programming'] },
        ],
        textFeedback: 'The lectures were very theoretical and hard to connect with practical applications. More real-world examples would be great.',
    },
    {
        id: 'resp3',
        formId: 'workshop-on-ai-ethics',
        isAnonymous: false,
        submittedAt: '2024-06-21T16:45:00Z',
        answers: [
            { questionId: 'w1', value: '9' },
            { questionId: 'w2', value: '5' },
            { questionId: 'w3', value: 'Agree' },
            { questionId: 'w4', value: 'AI in healthcare' },
        ],
        textFeedback: 'AI in healthcare',
    },
    {
        id: 'resp-new-1',
        formId: 'user-created-form-1',
        isAnonymous: true,
        submittedAt: '2024-07-26T11:00:00Z',
        answers: [
            { questionId: 'q1-new', value: 'Jane Doe' },
            { questionId: 'q2-new', value: 'The event was very insightful, thank you!' },
            { questionId: 'q3-new', value: 'Yes' },
        ],
        textFeedback: 'The event was very insightful, thank you!',
    }
];

export const getFormById = (id: string): Form | undefined => forms.find(form => form.id === id);
export const getResponsesByFormId = (formId: string): FeedbackResponse[] => responses.filter(res => res.formId === formId);
