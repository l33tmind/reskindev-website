"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, getDocs, doc, setDoc } from "firebase/firestore";
import { Search, Send, User } from "lucide-react";

export default function AdminMessages() {
  const [chats, setChats] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    // Fetch all users who have chats. In a real app we might use a dedicated 'chat_sessions' collection
    // For simplicity, we just listen to 'chats' collection if we maintained one, but we don't have a list of all users easily accessible except via 'users' collection.
    // Let's just fetch all users and assume we can message them.
    const fetchUsers = async () => {
      const q = query(collection(db, "users"));
      const snap = await getDocs(q);
      setChats(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (!selectedUserId) return;
    const q = query(collection(db, "chats", selectedUserId, "messages"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [selectedUserId]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUserId) return;

    const text = newMessage;
    setNewMessage("");

    await addDoc(collection(db, "chats", selectedUserId, "messages"), {
      text,
      senderId: "admin",
      senderName: "Admin Support",
      createdAt: serverTimestamp(),
    });
  };

  return (
    <div className="flex h-[calc(100vh-100px)] bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
      {/* Sidebar */}
      <div className="w-1/3 border-r border-gray-200 dark:border-gray-800 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="font-bold text-gray-900 dark:text-white mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input type="text" placeholder="Search users..." className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-sm outline-none" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {chats.map(chat => (
            <div 
              key={chat.id} 
              onClick={() => setSelectedUserId(chat.id)}
              className={`p-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${selectedUserId === chat.id ? 'bg-gray-50 dark:bg-gray-800' : ''}`}
            >
              <img src={chat.photoURL || "https://ui-avatars.com/api/?name="+chat.displayName} className="w-10 h-10 rounded-full" alt="User" />
              <div>
                <h3 className="font-bold text-sm text-gray-900 dark:text-white">{chat.displayName || chat.email}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">User</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-950">
        {selectedUserId ? (
          <>
            <div className="p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
              <h3 className="font-bold text-gray-900 dark:text-white">Chatting with {chats.find(c => c.id === selectedUserId)?.displayName || "User"}</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((msg) => {
                const isAdmin = msg.senderId === "admin";
                return (
                  <div key={msg.id} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                      isAdmin 
                        ? 'bg-[#00C6A2] text-white rounded-br-sm' 
                        : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-sm shadow-sm'
                    }`}>
                      <p className="text-sm">{msg.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <form onSubmit={sendMessage} className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex gap-2">
              <input 
                type="text" 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your reply..."
                className="flex-1 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00C6A2] dark:text-white"
              />
              <button 
                type="submit" 
                disabled={!newMessage.trim()}
                className="bg-[#00C6A2] text-white px-6 rounded-xl hover:bg-[#00b08f] transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                <Send size={18} />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <MessageSquareIcon />
            <p className="mt-4">Select a user to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}

function MessageSquareIcon() {
  return <MessageSquare size={48} className="opacity-20" />;
}
import { MessageSquare } from "lucide-react";
