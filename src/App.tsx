import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AddQuestion from './pages/AddQuestion';
import QuestionBank from './pages/QuestionBank';
import GeneratePaper from './pages/GeneratePaper';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
// import '@ionic/react/css/optional.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

// Guarded Route: If not logged in, go to Login
const PrivateRoute: React.FC<{ component: React.FC; path: string; exact?: boolean }> = ({ component: Component, ...rest }) => {
  const { user } = useAuth();
  return (
    <Route
      {...rest}
      render={(props) => user ? <Component /> : <Redirect to="/login" />}
    />
  );
};

const App: React.FC = () => (
  <IonApp>
    <AuthProvider>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/login">
            <Login />
          </Route>
          
          {/* Protected Area */}
          <PrivateRoute path="/dashboard" component={Dashboard} />
          {/* Add Question Route */}
          <PrivateRoute path="/add-question" component={AddQuestion} />
          {/* NEW: Edit Question Route (The :id part is a placeholder) */}
          <PrivateRoute path="/edit-question/:id" component={AddQuestion} />
          <PrivateRoute path="/question-bank" component={QuestionBank} />
          <PrivateRoute path="/generate" component={GeneratePaper} />

          <Route exact path="/">
            <Redirect to="/login" />
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </AuthProvider>
  </IonApp>
);

export default App;