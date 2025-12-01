import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonButton,
  IonButtons,
  IonBackButton,
  IonToast,
} from '@ionic/react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { saveQuestion, getQuestionById, updateQuestion } from '../services/questionService';
import type { Question } from '../services/questionService';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import '../assets/StyleSheets/AddQuestion.css';

// ========== Helper to render inline math ==========
const renderTextWithMath = (text: string) => {
  if (!text) return null;
  const parts = text.split('$');

  return (
    <span>
      {parts.map((part, index) =>
        index % 2 === 1 ? (
          <InlineMath key={index}>{part}</InlineMath>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </span>
  );
};

// ========== Form types ==========
type Difficulty = Question['difficulty']; // 'Easy' | 'Medium' | 'Hard'
type QuestionType = Question['type'];    // 'MCQ' | 'Short' | 'Long'

type QuestionFormValues = {
  subject: string;
  chapter: string;
  text: string;
  marks: string;       // form uses string
  type: QuestionType;
  difficulty: Difficulty;
};

const defaultValues: QuestionFormValues = {
  subject: '',
  chapter: '',
  text: '',
  marks: '',
  type: 'Short',
  difficulty: 'Easy',
};

type QuestionUpdatePayload = Partial<Omit<Question, 'id' | 'userId' | 'createdAt'>>;

const AddQuestion: React.FC = () => {
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();
  const history = useHistory();

  const { register, handleSubmit, watch, reset } = useForm<QuestionFormValues>({
    defaultValues,
  });

  const [showToast, setShowToast] = useState(false);
  const questionText = watch('text');

  // ========== Load data when editing ==========
  useEffect(() => {
    if (!id) {
      reset(defaultValues);
      return;
    }

    const loadData = async () => {
      const question = await getQuestionById(id);
      if (!question) return;

      const allowedDifficulties: Difficulty[] = ['Easy', 'Medium', 'Hard'];
      const allowedTypes: QuestionType[] = ['MCQ', 'Short', 'Long'];

      const safeDifficulty: Difficulty =
        allowedDifficulties.includes(question.difficulty) ? question.difficulty : 'Easy';

      const safeType: QuestionType =
        allowedTypes.includes(question.type) ? question.type : 'Short';

      const formatted: QuestionFormValues = {
        subject: question.subject ?? '',
        chapter: question.chapter ?? '',
        text: question.text ?? '',
        marks:
          question.marks !== undefined && question.marks !== null
            ? String(question.marks)
            : '',
        type: safeType,
        difficulty: safeDifficulty,
      };

      reset(formatted);
    };

    loadData();
  }, [id, reset]);

  // ========== Submit handler ==========
  const onSubmit = async (data: QuestionFormValues) => {
    if (!user) return;

    const basePayload: QuestionUpdatePayload = {
      subject: data.subject,
      chapter: data.chapter,
      text: data.text,
      type: data.type,
      difficulty: data.difficulty,
      marks: Number(data.marks),
    };

    let success = false;

    if (id) {
      // UPDATE existing question
      success = await updateQuestion(id, basePayload);
    } else {
      // CREATE new question
      const createPayload: Question = {
        ...(basePayload as Omit<Question, 'id' | 'userId' | 'createdAt'>),
        userId: user.uid,
        // createdAt is set in saveQuestion via serverTimestamp()
      };

      success = await saveQuestion(createPayload);
    }

    if (success) {
      setShowToast(true);

      if (!id) {
        reset(defaultValues);
      } else {
        setTimeout(() => history.replace('/question-bank'), 1000);
      }
    }
  };

  // ========== JSX ==========
  return (
    <IonPage>
      <IonHeader>
        {/* Glassy toolbar, like dashboard */}
        <IonToolbar className="glass-toolbar">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/dashboard" />
          </IonButtons>
          <IonTitle>{id ? 'Edit Question' : 'Add Question'}</IonTitle>
        </IonToolbar>
      </IonHeader>

      {/* Premium background & centered card */}
      <IonContent fullscreen className="inner-page-bg">
        <div className="page-shell">
          <div className="glass-card form-card">
            <div className="page-header">
              <h2 className="page-title">
                {id ? 'Edit Question' : 'Create New Question'}
              </h2>
              <p className="page-subtitle">
                Add curated questions to your personal CBSE question bank.
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit, (errors) =>
                console.log('Validation Errors:', errors)
              )}
            >
              {/* Row 1: Subject */}
              <div className="form-section">
                <div className="section-label">Basics</div>

                <IonItem className="form-item">
                  <IonLabel position="stacked">Subject</IonLabel>
                  <IonSelect
                    interface="popover"
                    placeholder="Select Subject"
                    {...register('subject', { required: true })}
                  >
                    {/* same subject options as before */}
                    <IonSelectOption value="" disabled className="group-header">
                      Languages (Group-L)
                    </IonSelectOption>
                    <IonSelectOption value="English">English</IonSelectOption>
                    <IonSelectOption value="English Core">English CORE (301)</IonSelectOption>
                    <IonSelectOption value="English Language and Literature">
                      English Language and Literature (184)
                    </IonSelectOption>
                    <IonSelectOption value="Hindi">Hindi</IonSelectOption>
                    <IonSelectOption value="Hindi Core">Hindi CORE (302)</IonSelectOption>
                    <IonSelectOption value="Hindi Course-A">Hindi Course-A (002)</IonSelectOption>
                    <IonSelectOption value="Hindi Course-B">Hindi Course-B (085)</IonSelectOption>
                    <IonSelectOption value="Sanskrit">Sanskrit</IonSelectOption>

                    <IonSelectOption value="" disabled className="group-header">
                      Main Subjects
                    </IonSelectOption>
                    <IonSelectOption value="Mathematics">Mathematics (041)</IonSelectOption>
                    <IonSelectOption value="Applied Mathematics">
                      Applied Mathematics (241)
                    </IonSelectOption>
                    <IonSelectOption value="Mathematics Standard">
                      Mathematics Standard (041)
                    </IonSelectOption>
                    <IonSelectOption value="Mathematics Basic">
                      Mathematics Basic (241)
                    </IonSelectOption>

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
                <IonItem className="form-item">
                  <IonLabel position="stacked">Chapter / Unit</IonLabel>
                  <IonInput {...register('chapter', { required: true })} />
                </IonItem>
              </div>

              {/* Row 2: Type / Marks / Difficulty */}
              <div className="form-section">
                <div className="section-label">Question type & weightage</div>

                <div className="form-row">
                  <IonItem className="form-item form-col">
                    <IonLabel position="stacked">Type</IonLabel>
                    <IonSelect
                      placeholder="Short"
                      {...register('type', { required: true })}
                    >
                      <IonSelectOption value="MCQ">MCQ</IonSelectOption>
                      <IonSelectOption value="Short">Short</IonSelectOption>
                      <IonSelectOption value="Long">Long</IonSelectOption>
                    </IonSelect>
                  </IonItem>

                  <IonItem className="form-item form-col">
                    <IonLabel position="stacked">Marks</IonLabel>
                    <IonSelect
                      placeholder="Marks"
                      {...register('marks', { required: true })}
                    >
                      <IonSelectOption value="1">1 Mark</IonSelectOption>
                      <IonSelectOption value="2">2 Marks</IonSelectOption>
                      <IonSelectOption value="3">3 Marks</IonSelectOption>
                      <IonSelectOption value="4">4 Marks</IonSelectOption>
                      <IonSelectOption value="5">5 Marks</IonSelectOption>
                    </IonSelect>
                  </IonItem>

                  <IonItem className="form-item form-col">
                    <IonLabel position="stacked">Difficulty</IonLabel>
                    <IonSelect
                      placeholder="Easy"
                      {...register('difficulty', { required: true })}
                    >
                      <IonSelectOption value="Easy">Easy</IonSelectOption>
                      <IonSelectOption value="Medium">Medium</IonSelectOption>
                      <IonSelectOption value="Hard">Hard</IonSelectOption>
                    </IonSelect>
                  </IonItem>
                </div>
              </div>

              {/* Row 3: Question text */}
              <div className="form-section">
                <div className="section-label">Question content</div>

                <IonItem className="form-item">
                  <IonLabel position="stacked">
                    Question <span className="helper-text">(Use $ for Math)</span>
                  </IonLabel>
                  <IonTextarea
                    rows={5}
                    autoGrow
                    {...register('text', { required: true })}
                    placeholder="Calculate force if $F = ma$"
                  />
                </IonItem>

                {questionText && (
                  <div className="math-preview-box">
                    <p className="preview-label">Preview</p>
                    <div className="preview-content">
                      {renderTextWithMath(questionText)}
                    </div>
                  </div>
                )}
              </div>

              {/* Save button */}
              <IonButton
                expand="block"
                type="submit"
                className="primary-btn submit-btn"
              >
                {id ? 'Update Question' : 'Save to Bank'}
              </IonButton>
            </form>
          </div>
        </div>

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
