'use client';

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  query,
  where,
  getCountFromServer,
  Timestamp,
  serverTimestamp,
  DocumentData,
  DocumentSnapshot,
  deleteDoc,
  writeBatch,
  setDoc,
} from 'firebase/firestore';
import type { Form, FeedbackResponse, User } from './types';
import { Firestore } from 'firebase/firestore';

// Helper to convert Firestore doc to Form object
const toForm = (docSnap: DocumentSnapshot<DocumentData>): Form => {
  const data = docSnap.data() as DocumentData;
  return {
    id: docSnap.id,
    title: data.title,
    description: data.description,
    category: data.category,
    questions: data.questions,
    anonymous: data.anonymous,
    status: data.status,
    createdAt: (data.createdAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
    responseCount: 0, // This will be populated separately by the getForms function
    userId: data.userId,
  };
};

export const getForms = async (db: Firestore, user: User | null): Promise<Form[]> => {
  if (!user) return [];

  const formsCollection = collection(db, 'forms');
  let formsQuery = query(formsCollection);

  // If the user is not an admin, they should only see their own forms
  if (user.role !== 'admin') {
    formsQuery = query(formsCollection, where('userId', '==', user.uid));
  }

  const formSnapshot = await getDocs(formsQuery);
  const formsList = formSnapshot.docs.map(toForm);

  // Get response counts for each form
  for (const form of formsList) {
    const responsesQuery = query(collection(db, 'responses'), where('formId', '==', form.id));
    const snapshot = await getCountFromServer(responsesQuery);
    form.responseCount = snapshot.data().count;
  }

  return formsList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const getFormById = async (db: Firestore, id: string): Promise<Form | undefined> => {
  if (!id) return undefined;
  try {
    const formDocRef = doc(db, 'forms', id);
    const formSnap = await getDoc(formDocRef);
    if (!formSnap.exists()) {
      return undefined;
    }
    return toForm(formSnap);
  } catch (error) {
    console.error("Error fetching form by ID:", error);
    return undefined;
  }
};

export const getResponsesByFormId = async (db: Firestore, formId: string): Promise<FeedbackResponse[]> => {
  if (!formId) return [];
  const responsesQuery = query(collection(db, 'responses'), where('formId', '==', formId));
  const responseSnapshot = await getDocs(responsesQuery);
  return responseSnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      formId: data.formId,
      isAnonymous: data.isAnonymous,
      submittedAt: (data.submittedAt as Timestamp).toDate().toISOString(),
      answers: data.answers,
      textFeedback: data.textFeedback,
    } as FeedbackResponse;
  });
};

export const addForm = async (db: Firestore, form: Omit<Form, 'id' | 'createdAt' | 'responseCount'>, userId: string): Promise<string> => {
  const formsCollection = collection(db, 'forms');
  const newFormRef = await addDoc(formsCollection, {
    ...form,
    userId,
    createdAt: serverTimestamp(),
  });
  return newFormRef.id;
};

export const deleteForm = async (db: Firestore, formId: string): Promise<void> => {
  if (!formId) return;

  const formDocRef = doc(db, 'forms', formId);

  // Also delete all responses associated with the form
  const responsesQuery = query(collection(db, 'responses'), where('formId', '==', formId));
  const responseSnapshot = await getDocs(responsesQuery);

  const batch = writeBatch(db);

  responseSnapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });

  batch.delete(formDocRef);

  await batch.commit();
};

export const createUserInDb = async (db: Firestore, user: User): Promise<void> => {
  const userDocRef = doc(db, 'users', user.uid);
  await setDoc(userDocRef, {
    email: user.email,
    role: user.role,
  });
};
