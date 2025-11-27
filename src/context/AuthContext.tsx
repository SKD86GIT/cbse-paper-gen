import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, googleProvider } from '../firebase/config';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

// 1. Define what data we want to share
interface AuthContextType {
  user: any;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

// 2. Create the "Box" (Context)
const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// 3. Create a Hook to easily open the box
export const useAuth = () => useContext(AuthContext);

// 4. Create the "Broadcaster" (Provider)
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Listen for login/logout events automatically
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login Error:", error);
      alert("Login failed! Check the console.");
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};