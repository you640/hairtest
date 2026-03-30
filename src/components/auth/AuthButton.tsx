import { useState, useEffect } from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/src/firebase';

export const AuthButton = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">{user.email}</span>
        <button className="px-3 py-1 text-xs border rounded-md hover:bg-muted" onClick={handleLogout}>Logout</button>
      </div>
    );
  }

  return <button className="px-3 py-1 text-xs bg-primary text-primary-foreground rounded-md hover:bg-primary/90" onClick={handleLogin}>Login</button>;
};
