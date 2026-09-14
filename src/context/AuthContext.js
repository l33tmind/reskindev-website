"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { 
  onAuthStateChanged, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  getAdditionalUserInfo
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeSnapshot = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        
        // Listen to realtime updates on the user document
        unsubscribeSnapshot = onSnapshot(userRef, async (userSnap) => {
          if (userSnap.exists()) {
            setDbUser(userSnap.data());
            setLoading(false);
          } else {
            // New user logic (fallback if not created by login/signup functions directly)
              const baseUsername = currentUser.email ? currentUser.email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '') : 'user';
              const newUserData = {
                uid: currentUser.uid,
                email: currentUser.email,
                displayName: currentUser.displayName,
                photoURL: currentUser.photoURL,
                role: "buyer", // Default role fallback
                username: `${baseUsername}_${Math.floor(Math.random() * 10000)}`,
                createdAt: serverTimestamp(),
                lastLogin: serverTimestamp(),
              };
              await setDoc(userRef, newUserData);
              setDbUser(newUserData);
              setLoading(false);
            }
          });
        } else {
          setDbUser(null);
          setLoading(false);
          if (unsubscribeSnapshot) unsubscribeSnapshot();
        }
      });
  
      return () => {
        unsubscribeAuth();
        if (unsubscribeSnapshot) unsubscribeSnapshot();
      };
    }, []);
  
    const loginWithGoogle = async (role = "buyer") => {
      const provider = new GoogleAuthProvider();
      try {
        const result = await signInWithPopup(auth, provider);
        const additionalInfo = getAdditionalUserInfo(result);
        
        if (additionalInfo?.isNewUser) {
          const baseUsername = result.user.email ? result.user.email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '') : 'user';
          await setDoc(doc(db, "users", result.user.uid), {
            uid: result.user.uid,
            email: result.user.email,
            displayName: result.user.displayName,
            photoURL: result.user.photoURL,
            role: role,
            username: `${baseUsername}_${Math.floor(Math.random() * 10000)}`,
            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp(),
          });
        }
        return result;
      } catch (error) {
        console.error("Login failed:", error);
        throw error;
      }
    };
  
    const loginWithEmail = async (email, password) => {
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (error) {
        console.error("Login with email failed:", error);
        throw error;
      }
    };
  
    const signupWithEmail = async (name, email, password, role = "buyer") => {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, {
          displayName: name,
          photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`
        });
        const baseUsername = email ? email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '') : 'user';
        await setDoc(doc(db, "users", userCredential.user.uid), {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          displayName: name,
          photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`,
          role: role,
          username: `${baseUsername}_${Math.floor(Math.random() * 10000)}`,
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
        });
    } catch (error) {
      console.error("Signup failed:", error);
      throw error;
    }
  };

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, dbUser, loading, loginWithGoogle, loginWithEmail, signupWithEmail, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
