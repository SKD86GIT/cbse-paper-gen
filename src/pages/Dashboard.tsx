import React from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/react';
import { useAuth } from '../context/AuthContext';

const Dashboard: React.FC = () => {
  const { logout, user } = useAuth();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Dashboard</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <h2>Welcome, {user?.displayName}</h2>
        <p>Email: {user?.email}</p>
        {/* NEW BUTTON */}
        <IonButton routerLink="/add-question" expand="block" className="ion-margin-top">
          + Create New Question
        </IonButton>
        <IonButton routerLink="/question-bank" expand="block" color="tertiary" className="ion-margin-top">
          View Question Bank
        </IonButton>
        <IonButton routerLink="/generate" expand="block" color="warning" className="ion-margin-top">
          ⚡ Generate Question Paper
        </IonButton>
        <IonButton onClick={logout} color="medium">Logout</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Dashboard;