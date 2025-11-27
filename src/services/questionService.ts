import { db } from '../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export interface Question {
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