"use client";

import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { collection, query, where, getDocs, addDoc, serverTimestamp, updateDoc, doc, increment } from "firebase/firestore";
import { db } from "@/lib/firebase";
import toast from "react-hot-toast";

export default function ContactSellerButton({ authorId, authorName, gigId, gigTitle, className, buttonText }) {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const handleContact = async () => {
    if (!user) {
      toast.error("Please login to message the seller.");
      router.push("/login");
      return;
    }

    if (user.uid === authorId) {
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
        if (data.participants.includes(authorId)) {
          existingChatId = doc.id;
        }
      });

      let chatId = existingChatId;

      if (!existingChatId) {
        const newChat = await addDoc(collection(db, "conversations"), {
          participants: [user.uid, authorId],
          participantDetails: {
            [user.uid]: { name: user.displayName || "User" },
            [authorId]: { name: authorName || "Freelancer" }
          },
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          lastMessage: ""
        });
        chatId = newChat.id;
      }

      // If clicked from a gig, send a reference message automatically
      if (gigId && gigTitle) {
        const msgText = `Hi! I'm interested in your service:\n${gigTitle}\nhttps://reskindev.com/gig/${gigId}`;
        
        await addDoc(collection(db, "conversations", chatId, "messages"), {
          text: msgText,
          senderId: user.uid,
          senderName: user.displayName || "User",
          createdAt: serverTimestamp(),
          type: "text"
        });

        await updateDoc(doc(db, "conversations", chatId), {
          lastMessage: `Interested in: ${gigTitle}`,
          updatedAt: serverTimestamp(),
          [`unreadCount.${authorId}`]: increment(1)
        });
      }

      router.push(`/inbox?chat=${chatId}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to start conversation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleContact}
      disabled={loading}
      className={className || "mt-4 w-full bg-white dark:bg-gray-900 border-2 border-[#00C6A2] text-[#00C6A2] hover:bg-[#00C6A2] hover:text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"}
    >
      {!className && <MessageSquare size={20} />}
      {loading ? "Connecting..." : (buttonText || "Message Seller")}
    </button>
  );
}
