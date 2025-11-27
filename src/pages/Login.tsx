import React, {useEffect} from 'react';
import { IonPage, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonIcon, IonText } from '@ionic/react';
import { logoGoogle } from 'ionicons/icons';
import { useAuth } from '../context/AuthContext';
import { useHistory } from 'react-router-dom';
import '../assets/StyleSheets/Login.css';

const Login: React.FC = () => {
  const { login, user } = useAuth();
  const history = useHistory();

  // FIX: Wrap the navigation in useEffect
  useEffect(() => {

    // If user is already logged in, kick them to the dashboard
    if (user) {
      history.replace('/dashboard');
    }
  }, [user, history]);
  return (
    <IonPage>
      <IonContent className="ion-padding" fullscreen>
        <div className="login-container">
          <IonText color="primary">
            <h1>CBSE Paper Gen</h1>
          </IonText>
          <p>For Teachers, By Teachers</p>

          <IonCard className="login-card">
            <IonCardHeader>
              <IonCardTitle className="ion-text-center">Teacher Login</IonCardTitle>
            </IonCardHeader>
            <IonCardContent className="ion-text-center">
              <p style={{ marginBottom: '20px' }}>Sign in to access your Question Bank</p>
              
              <IonButton expand="block" onClick={login} color="danger">
                <IonIcon slot="start" icon={logoGoogle} />
                Sign in with Google
              </IonButton>
            </IonCardContent>
          </IonCard>

        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;