import React, { useEffect, useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonBadge, IonButtons, IonButton, IonBackButton, IonSpinner } from '@ionic/react';
import { db } from '../firebase/config';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import MathText from '../components/MathText'; // Importing our new component
import { Question } from '../services/questionService';
import '../assets/StyleSheets/QuestionBank.css';
import { createOutline, trashOutline } from 'ionicons/icons'; // Import Icons
import { deleteQuestion } from '../services/questionService'; // Import Delete Logic
import { IonAlert, IonIcon } from '@ionic/react'; // Import Alert and Icon components

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
        id: doc.id,    // <--- CAPTURE THE ID HERE  
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

  const [questionToDelete, setQuestionToDelete] = useState<string | null>(null);

  const handleDelete = async () => {
    if (questionToDelete) {
      const success = await deleteQuestion(questionToDelete);
      if (success) {
        // Remove it from the local list so it disappears instantly
        setQuestions(questions.filter(q => q.id !== questionToDelete));
      }
      setQuestionToDelete(null); // Close alert
    }
  };

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
                
                <IonButtons slot="end" style={{alignSelf: 'flex-start', marginTop: '10px', cursor: 'pointer', gap: '10px'}}>
                  
                  {/* Edit Button (We will wire this up next) */}
                  <IonButton color="medium" routerLink={`/edit-question/${q.id}`}>
                    <IonIcon icon={createOutline} />
                  </IonButton>

                  {/* Delete Button */}
                  <IonButton color="danger" onClick={() => setQuestionToDelete(q.id!)}>
                    <IonIcon icon={trashOutline} />
                  </IonButton>

                </IonButtons>
              
              </IonItem>
            ))}
          </IonList>
        )}
        <IonAlert
          isOpen={!!questionToDelete}
          onDidDismiss={() => setQuestionToDelete(null)}
          header="Confirm Delete"
          message="Are you sure you want to delete this question? This cannot be undone."
          buttons={[
            { text: 'Cancel', role: 'cancel', handler: () => setQuestionToDelete(null) },
            { text: 'Delete', role: 'destructive', handler: handleDelete }
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default QuestionBank;