"use client";

import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { collection, query, where, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import toast from "react-hot-toast";

export default function ContactUserButton({ targetUserId, targetUserName, label = "Message", className = "" }) {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const handleContact = async () => {
    if (!user) {
      toast.error("Please login to message.");
      router.push("/login");
      return;
    }

    if (user.uid === targetUserId) {
      toast.error("You cannot message yourself.");
      return;
    }

    setLoading(true);
    try {
      const q = query(
        collection(db, "conversations"),
        where("participants", "array-contains", user.uid)
      );
      
      const snap = await getDocs(q);
      let existingChatId = null;
      
      snap.docs.forEach(doc => {
        const data = doc.data();
        if (data.participants.includes(targetUserId)) {
          existingChatId = doc.id;
        }
      });

      if (existingChatId) {
        router.push(`/inbox?chat=${existingChatId}`);
      } else {
        const newChat = await addDoc(collection(db, "conversations"), {
          participants: [user.uid, targetUserId],
          participantDetails: {
            [user.uid]: { name: user.displayName || "User" },
            [targetUserId]: { name: targetUserName || "User" }
          },
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          lastMessage: ""
        });
        router.push(`/inbox?chat=${newChat.id}`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to start conversation.");
      setLoading(false);
    }
  };

  const defaultClasses = "bg-[#00C6A2] hover:bg-[#00b08f] text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 text-xs";
  
  return (
    <button 
      onClick={(e) => {
         e.preventDefault();
         e.stopPropagation();
         handleContact();
      }}
      disabled={loading}
      className={className || defaultClasses}
    >
      <MessageSquare size={16} />
      {loading ? "..." : label}
    </button>
  );
}
