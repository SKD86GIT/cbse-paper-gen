import { db } from '../firebase/config';
import { collection, addDoc, deleteDoc, doc, updateDoc, getDoc, serverTimestamp } from 'firebase/firestore';

export interface Question {
  id?: string;
  text: string;
  subject: string;
  chapter: string;
  marks: number;
  type: 'MCQ' | 'Short' | 'Long';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  userId: string;
  createdAt?: any;
}

export const saveQuestion = async (data: Question) => {
  try {
    const docRef = await addDoc(collection(db, "questions"), {
      ...data,
      createdAt: serverTimestamp()
    });
    console.log("Document written with ID: ", docRef.id);
    return true;
  } catch (e) {
    console.error("Error adding document: ", e);
    return false;
  }
};

// 2. NEW: Function to Delete a Question
export const deleteQuestion = async (id: string) => {
  try {
    await deleteDoc(doc(db, "questions", id));
    return true;
  } catch (e) {
    console.error("Error deleting: ", e);
    return false;
  }
};

// 3. NEW: Function to Get a Single Question (For Editing later)
export const getQuestionById = async (id: string) => {
  try {
    const docRef = await getDoc(doc(db, "questions", id));
    if (docRef.exists()) {
      return { id: docRef.id, ...docRef.data() } as Question;
    }
    return null;
  } catch (e) {
    return null;
  }
};

// 4. NEW: Function to Update a Question
export const updateQuestion = async (id: string, data: Partial<Question>) => {
  try {
    const docRef = doc(db, "questions", id);
    await updateDoc(docRef, data);
    return true;
  } catch (e) {
    return false;
  }
};