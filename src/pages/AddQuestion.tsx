import React, { useState } from 'react';
import { useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonSelect, IonSelectOption, IonTextarea, IonButton, IonButtons, IonBackButton, IonToast } from '@ionic/react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { saveQuestion, getQuestionById, updateQuestion, Question } from '../services/questionService';
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
  const { id } = useParams<{ id: string }>(); // Get ID from URL (if editing)
  const history = useHistory();
  const { register, handleSubmit, watch, reset, setValue } = useForm<Question>();
  const [showToast, setShowToast] = useState(false);

  const questionText = watch("text");

  // Load data if we are Editing
  useEffect(() => {
    if (id) {
      const loadData = async () => {
        const question = await getQuestionById(id);
        if (question) {
          // FIX: We define the object and cast the types right here
          const formattedQuestion = {
            ...question,
            marks: String(question.marks),
            subject: question.subject,
            // MAGIC FIX: Tell TypeScript "I promise this string is valid"
            difficulty: question.difficulty as 'Easy' | 'Medium' | 'Hard'
          };
          
          // Now reset the form with this formatted data
          reset(question); 
        }
      };
      loadData();
    }
  }, [id, reset]);

  const onSubmit = async (data: Question) => {
    if (!user) return;

    let success = false;

    if (id) {
      // UPDATE existing question
      success = await updateQuestion(id, {
        ...data,
        marks: Number(data.marks)
      });
    } else {
      // CREATE new question
      success = await saveQuestion({
        ...data,
        userId: user.uid,
        marks: Number(data.marks),
        createdAt: new Date()
      });
    }

    if (success) {
      setShowToast(true);
      if (!id) reset(); // Only clear form if adding new. If editing, keep it.
      
      // Optional: Go back to list after edit
      if (id) {
        setTimeout(() => history.replace('/question-bank'), 1000);
      }
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/dashboard" />
          </IonButtons>
          {/* Update Title */}
          <IonTitle>{id ? 'Edit Question' : 'Add Question'}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <form onSubmit={handleSubmit(onSubmit, (errors) => console.log("Validation Errors:", errors))}>
          
          {/* Subject Selection */}
          <IonItem className='ion-item'>
            <IonSelect 
              interface="popover" /* <--- CHANGE THIS */
              placeholder="Select Subject" 
              {...register("subject", { required: true })}
            >
              {/* === GROUP L: LANGUAGES === */}
              <IonSelectOption value="" disabled className="group-header">
                Languages (Group-L)
              </IonSelectOption>
              <IonSelectOption value="English">English</IonSelectOption>
              <IonSelectOption value="English Core">English CORE (301)</IonSelectOption>
              <IonSelectOption value="English Language and Literature">English Language and Literature (184)</IonSelectOption>
              <IonSelectOption value="Hindi">Hindi</IonSelectOption>
              <IonSelectOption value="Hindi Core">Hindi CORE (302)</IonSelectOption>
              <IonSelectOption value="Hindi Course-A">Hindi Course-A (002)</IonSelectOption>
              <IonSelectOption value="Hindi Course-B">Hindi Course-B (085)</IonSelectOption>
              <IonSelectOption value="Sanskrit">Sanskrit</IonSelectOption>

              {/* === GROUP A1: MAIN SUBJECTS === */}
              <IonSelectOption value="" disabled className="group-header">
                Main Subjects
              </IonSelectOption>
              <IonSelectOption value="Mathematics">Mathematics (041)</IonSelectOption>
              <IonSelectOption value="Applied Mathematics">Applied Mathematics (241)</IonSelectOption>
              <IonSelectOption value="Mathematics Standard">Mathematics Standard (041)</IonSelectOption>
              <IonSelectOption value="Mathematics Basic">Mathematics Basic (241)</IonSelectOption>

              {/* === SCIENCES === */}
              <IonSelectOption value="" disabled className="group-header">
                &nbsp;&nbsp;↳ Sciences
              </IonSelectOption>
              <IonSelectOption value="Science">Science (086)</IonSelectOption>
              <IonSelectOption value="Physics">Physics (042)</IonSelectOption>
              <IonSelectOption value="Chemistry">Chemistry (043)</IonSelectOption>
              <IonSelectOption value="Biology">Biology (044)</IonSelectOption>
              <IonSelectOption value="CS">Computer Science (083)</IonSelectOption>
              <IonSelectOption value="IP">Informatics Practices (065)</IonSelectOption>

            </IonSelect>
          </IonItem>

          {/* Chapter */}
          <IonItem>
            <IonLabel position="floating">Chapter / Unit</IonLabel>
            <IonInput {...register("chapter", { required: true })} />
          </IonItem>

          {/* Difficulty & Marks (Side by Side) */}
          <div className= 'marksDifficulty' >
            <IonItem style={{ width: '50%' }}>
              <IonSelect placeholder="Marks" {...register("marks", { required: true })}>
                <IonSelectOption value="1">1 Mark</IonSelectOption>
                <IonSelectOption value="2">2 Marks</IonSelectOption>
                <IonSelectOption value="3">3 Marks</IonSelectOption>
                <IonSelectOption value="3">4 Marks</IonSelectOption>
                <IonSelectOption value="5">5 Marks</IonSelectOption>
                <IonSelectOption value="5">Custom Marks</IonSelectOption>
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

          {/* Update Save Button */}
          <IonButton expand="block" type="submit" className="ion-margin-top">
            {id ? 'Update Question' : 'Save to Bank'}
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