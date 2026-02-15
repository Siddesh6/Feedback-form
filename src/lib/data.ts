import type { Form, FeedbackResponse } from './types';

// NOTE: This file's mock data has been removed. The application now uses live data
// from Firebase Firestore. See `src/lib/firestore-data.ts` for data-fetching functions.

export const forms: Form[] = [];
export const responses: FeedbackResponse[] = [];

// These functions are deprecated and will be removed in a future update.
export const getFormById = (id: string): Form | undefined => {
    console.warn("Using deprecated mock function getFormById. Switch to a Firestore-based implementation.");
    return undefined;
};
export const getResponsesByFormId = (formId: string): FeedbackResponse[] => {
    console.warn("Using deprecated mock function getResponsesByFormId. Switch to a Firestore-based implementation.");
    return [];
};
