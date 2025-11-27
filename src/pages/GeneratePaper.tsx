import React, { useState, useEffect } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonSelect, IonSelectOption, IonButton, IonButtons, IonBackButton, IonRange, IonList, IonListHeader, IonText } from '@ionic/react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import MathText from '../components/MathText';
import { Question } from '../services/questionService';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import '../assets/StyleSheets/GeneratePaper.css'; // <--- IMPORT THE CSS

const GeneratePaper: React.FC = () => {
  // State for the form
  const [subject, setSubject] = useState('Physics');
  const [totalMarks, setTotalMarks] = useState(20);
  
  // State for the result
  const [generatedPaper, setGeneratedPaper] = useState<Question[]>([]);
  const [isGenerated, setIsGenerated] = useState(false);

  // THE BRAIN: Logic to pick random questions
  const generate = async () => {
    setIsGenerated(false);
    
    // 1. Fetch ALL questions for this subject
    // (In a real app, you'd filter more precisely, but this is fine for now)
    const q = query(collection(db, "questions"), where("subject", "==", subject));
    const snapshot = await getDocs(q);
    const allQuestions = snapshot.docs.map(doc => doc.data()) as Question[];

    // 2. Randomize (Shuffle the array)
    const shuffled = allQuestions.sort(() => 0.5 - Math.random());

    // 3. Select questions until we hit the Total Marks
    let currentMarks = 0;
    const selected: Question[] = [];

    for (const question of shuffled) {
      if (currentMarks + question.marks <= totalMarks) {
        selected.push(question);
        currentMarks += question.marks;
      }
      if (currentMarks === totalMarks) break;
    }

    setGeneratedPaper(selected);
    setIsGenerated(true);
  };

  const downloadPDF = async () => {
    const element = document.getElementById('paper-view'); // Target the white paper div
    if (!element) return;

    try {
      // 1. Take a high-quality screenshot of the div
      const canvas = await html2canvas(element, { 
        scale: 2, // Higher scale = sharper text
        useCORS: true // Helps with loading images/fonts
      });

      // 2. Calculate PDF dimensions (A4 paper)
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      // 3. Save
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Physics_Paper_${new Date().toISOString().slice(0,10)}.pdf`);
      
    } catch (err) {
      console.error("PDF Error:", err);
      alert("Could not generate PDF. Please try again.");
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="tertiary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/dashboard" />
          </IonButtons>
          <IonTitle>Paper Generator</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        
        {/* CONFIG SECTION */}
        {!isGenerated && (
          <div className="config-section">
            <h2>Step 1: Define Blueprint</h2>
            {/* ... inputs remain the same ... */}
            <IonItem>
              <IonLabel>Subject</IonLabel>
              <IonSelect value={subject} onIonChange={e => setSubject(e.detail.value)}>
                <IonSelectOption value="Physics">Physics</IonSelectOption>
                <IonSelectOption value="Chemistry">Chemistry</IonSelectOption>
                <IonSelectOption value="Maths">Maths</IonSelectOption>
              </IonSelect>
            </IonItem>

            <IonItem lines="none">
              <IonLabel>Total Marks: {totalMarks}</IonLabel>
              <IonRange min={10} max={100} step={5} value={totalMarks} onIonChange={e => setTotalMarks(e.detail.value as number)} />
            </IonItem>

            <IonButton expand="block" onClick={generate} className="ion-margin-top">
              ⚡ Auto-Generate Paper
            </IonButton>
          </div>
        )}

        {/* RESULT SECTION */}
        {isGenerated && (
          <div>
            <div className="paper-preview-header">
              <h2>Preview</h2>
              <IonButton fill="clear" onClick={() => setIsGenerated(false)}>Edit Blueprint</IonButton>
            </div>

            {/* THE PAPER VIEW (Cleaned up!) */}
            <div id="paper-view" className="paper-view">
              
              <div className="school-header">
                <h1>CARMEL SCHOOL, KARGALI</h1>
                <h3>{subject.toUpperCase()} - EXAMINATION</h3>
                <div className="exam-meta">
                  <span>Time: 1 Hr</span>
                  <span>Max Marks: {generatedPaper.reduce((sum, q) => sum + q.marks, 0)}</span>
                </div>
              </div>

              {generatedPaper.length === 0 ? (
                <p style={{ color: 'red', textAlign: 'center' }}>Not enough questions in bank!</p>
              ) : (
                <div>
                  {generatedPaper.map((q, index) => (
                    <div key={index} className="question-row">
                      <div className="question-content">
                        <span style={{ fontWeight: 'bold', marginRight: '10px' }}>Q{index + 1}.</span>
                        <MathText text={q.text} />
                      </div>
                      <div className="question-marks">
                        [{q.marks}]
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <IonButton expand="block" color="success" className="ion-margin-top" onClick={downloadPDF}>
              🖨️ Print / Save as PDF
            </IonButton>
          </div>
        )}

      </IonContent>
    </IonPage>
  );
};

export default GeneratePaper;