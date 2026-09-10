"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function SaveButton({ gigId }) {
  const { user, dbUser } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (dbUser && dbUser.savedGigs) {
      setIsSaved(dbUser.savedGigs.includes(gigId));
    }
  }, [dbUser, gigId]);

  const toggleSave = async () => {
    if (!user) {
      alert("Please sign in to save services.");
      return;
    }
    
    setLoading(true);
    const userRef = doc(db, "users", user.uid);
    try {
      if (isSaved) {
        await updateDoc(userRef, {
          savedGigs: arrayRemove(gigId)
        });
        setIsSaved(false);
      } else {
        await updateDoc(userRef, {
          savedGigs: arrayUnion(gigId)
        });
        setIsSaved(true);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <button 
      onClick={toggleSave}
      disabled={loading}
      className={`p-3 rounded-full border transition-colors shadow-sm flex items-center justify-center ${
        isSaved 
          ? "bg-red-50 border-red-200 text-red-500 hover:bg-red-100" 
          : "bg-white dark:bg-gray-900 border-gray-200 text-gray-400 hover:bg-gray-50 dark:bg-gray-950 hover:text-red-500"
      }`}
      title={isSaved ? "Remove from Saved" : "Save this Service"}
    >
      <Heart size={20} fill={isSaved ? "currentColor" : "none"} />
    </button>
  );
}
