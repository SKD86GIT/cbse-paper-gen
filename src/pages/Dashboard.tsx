import React from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton
} from '@ionic/react';
import { useAuth } from '../context/AuthContext';
import '../theme/Dashboard.css'; // ⬅️ add this

const Dashboard: React.FC = () => {
  const { logout, user } = useAuth();

  return (
    <IonPage>
      <IonHeader>
        {/* glassy toolbar */}
        <IonToolbar className="glass-toolbar">
          <IonTitle>Dashboard</IonTitle>
        </IonToolbar>
      </IonHeader>

      {/* gradient background + center content */}
      <IonContent fullscreen className="dashboard-bg">
        <div className="dashboard-center">
          <div className="glass-card">
            <h2 className="dash-title">Welcome, {user?.displayName}</h2>
            <p className="dash-subtitle">{user?.email}</p>

            <div className="dashboard-actions">
              <IonButton
                routerLink="/add-question"
                expand="block"
                className="primary-btn"
              >
                + Create New Question
              </IonButton>

              <IonButton
                routerLink="/question-bank"
                expand="block"
                fill="outline"
                className="secondary-btn"
              >
                View Question Bank
              </IonButton>

              <IonButton
                routerLink="/generate"
                expand="block"
                color="warning"
                className="accent-btn"
              >
                ⚡ Generate Question Paper
              </IonButton>
              <div className="glass-divider" />
              <IonButton
                onClick={logout}
                expand="block"
                color="medium"
                fill="clear"
              >
                Logout
              </IonButton>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Dashboard;
