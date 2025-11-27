import React, { useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonSelect, IonSelectOption, IonTextarea, IonButton, IonButtons, IonBackButton, IonToast } from '@ionic/react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { saveQuestion, Question } from '../services/questionService';
import 'katex/dist/katex.min.css'; // Import Math CSS
import { BlockMath, InlineMath } from 'react-katex'; // Component to show Math
import '../assets/StyleSheets/AddQuestion.css';

// Helper to split text and math
const renderTextWithMath = (text: string) => {
  if (!text) return null;
  const parts = text.split('$');
  
  return (
    <span>
      {parts.map((part, index) => {
        // Odd numbers (1, 3, 5...) are inside $ signs -> Render as Math
        if (index % 2 === 1) {
          return <InlineMath key={index}>{part}</InlineMath>;
        }
        // Even numbers are normal text
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
};

const AddQuestion: React.FC = () => {
  const { user } = useAuth();
  const { register, handleSubmit, watch, reset } = useForm<Question>();
  const [showToast, setShowToast] = useState(false);

  // Watch the text input to show a live preview of the Math
  const questionText = watch("text"); 

  const onSubmit = async (data: Question) => {
    console.log("1. Button Clicked! Form Data:", data); // <--- Add this

    if (!user) {
        console.error("2. Error: User is not logged in!"); // <--- Add this
        return;
    }
    
    console.log("3. User ID is:", user.uid); // <--- Add this
    
    // Save to Firebase
    const success = await saveQuestion({
      ...data,
      userId: user.uid,
      marks: Number(data.marks), // Convert string "5" to number 5
      createdAt: new Date()
    });

    console.log("4. Save Question Success Status:", success); // <--- Add this

    if (success) {
      setShowToast(true);
      reset(); // Clear form so they can add another
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/dashboard" />
          </IonButtons>
          <IonTitle>Add Question</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <form onSubmit={handleSubmit(onSubmit, (errors) => console.log("Validation Errors:", errors))}>
          
          {/* Subject Selection */}
          <IonItem>
            <IonSelect placeholder="Select Subject" {...register("subject", { required: true })}>
              <IonSelectOption value="Physics">Physics</IonSelectOption>
              <IonSelectOption value="Chemistry">Chemistry</IonSelectOption>
              <IonSelectOption value="Maths">Maths</IonSelectOption>
            </IonSelect>
          </IonItem>

          {/* Chapter */}
          <IonItem>
            <IonLabel position="floating">Chapter / Unit</IonLabel>
            <IonInput {...register("chapter", { required: true })} />
          </IonItem>

          {/* Difficulty & Marks (Side by Side) */}
          <div style={{ display: 'flex' }}>
            <IonItem style={{ width: '50%' }}>
              <IonSelect placeholder="Marks" {...register("marks", { required: true })}>
                <IonSelectOption value="1">1 Mark</IonSelectOption>
                <IonSelectOption value="2">2 Marks</IonSelectOption>
                <IonSelectOption value="3">3 Marks</IonSelectOption>
                <IonSelectOption value="5">5 Marks</IonSelectOption>
              </IonSelect>
            </IonItem>
            <IonItem style={{ width: '50%' }}>
              <IonSelect placeholder="Difficulty" {...register("difficulty", { required: true })}>
                <IonSelectOption value="Easy">Easy</IonSelectOption>
                <IonSelectOption value="Medium">Medium</IonSelectOption>
                <IonSelectOption value="Hard">Hard</IonSelectOption>
              </IonSelect>
            </IonItem>
          </div>

          {/* Question Text Area */}
          <IonItem>
            <IonLabel position="stacked">Question (Use $ for Math)</IonLabel>
            <IonTextarea rows={5} {...register("text", { required: true })} placeholder="Calculate force if $F = ma$" />
          </IonItem>

          {/* Live Math Preview */}
          {questionText && (
            <div className="math-preview-box">
                <p className="preview-label">Preview:</p>
                <div className="preview-content">
      
                {renderTextWithMath(questionText)}
              </div>
            </div>
          )}

          <IonButton expand="block" type="submit" className="ion-margin-top">
            Save to Bank
          </IonButton>
        </form>

        {/* Success Popup */}
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message="Question Saved Successfully!"
          duration={2000}
          color="success"
          position="top"
        />
      </IonContent>
    </IonPage>
  );
};

export default AddQuestion;