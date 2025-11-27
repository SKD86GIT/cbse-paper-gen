import React, { useEffect, useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonBadge, IonButtons, IonBackButton, IonSpinner } from '@ionic/react';
import { db } from '../firebase/config';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import MathText from '../components/MathText'; // Importing our new component
import { Question } from '../services/questionService';
import '../assets/StyleSheets/QuestionBank.css';

const QuestionBank: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  // Function to load data
  const loadQuestions = async () => {
    try {
      setLoading(true);
      // Query: Get 'questions' collection, sorted by Newest first
      const q = query(collection(db, "questions"), orderBy("createdAt", "desc"));
      
      const querySnapshot = await getDocs(q);
      const loadedQuestions = querySnapshot.docs.map(doc => ({
          ...doc.data()
      })) as Question[];

      setQuestions(loadedQuestions);
    } catch (error) {
      console.error("Error loading questions:", error);
    } finally {
      setLoading(false);
    }
  };

  // Run this when the page loads
  useEffect(() => {
    loadQuestions();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/dashboard" />
          </IonButtons>
          <IonTitle>Question Bank</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {loading ? (
          <div className="ion-text-center ion-margin-top">
            <IonSpinner name="crescent" />
            <p>Fetching questions...</p>
          </div>
        ) : (
          <IonList>
            {questions.map((q, index) => (
              <IonItem key={index} lines="full" className="question-card">
                <IonLabel className="ion-text-wrap">
                  
                  {/* Tags Row */}
                  <div className="badge-row">
                    <IonBadge color="secondary" style={{ marginRight: '5px' }}>{q.subject}</IonBadge>
                    <IonBadge color="light">{q.marks} Marks</IonBadge>
                    {/* ... badges ... */}
                  </div>

                  {/* The Question Text */}
                  <div className="question-text">
                    <MathText text={q.text} />
                  </div>

                  <p className="unit-text">
                    Unit: {q.chapter}
                  </p>
                </IonLabel>
              </IonItem>
            ))}
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
};

export default QuestionBank;