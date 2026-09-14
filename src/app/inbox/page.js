"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp, updateDoc, doc, setDoc } from "firebase/firestore";
import Navbar from "@/components/Navbar";
import { Send, MessageSquare, Check, CheckCheck, Briefcase, ShieldAlert, Ban } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { Suspense } from "react";

function InboxContent() {
  const { user, dbUser } = useAuth();
  const searchParams = useSearchParams();
  const initialChatId = searchParams.get("chat");
  
  const [conversations, setConversations] = useState([]);
  const [activeChat, _setActiveChat] = useState(null);
  const setActiveChat = (c) => {
    _setActiveChat(c);
    activeChatRef.current = c;
  };
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserStatus, setOtherUserStatus] = useState("Offline");
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerDetails, setOfferDetails] = useState({ price: "", days: "", description: "" });
  
  const [searchQuery, setSearchQuery] = useState("");
  const [filterUnread, setFilterUnread] = useState(false);
  
  const messagesEndRef = useRef(null);
  const activeChatRef = useRef(activeChat);
  const typingTimeoutRef = useRef(null);

  // 1. Fetch conversations
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "conversations"),
      where("participants", "array-contains", user.uid),
      orderBy("updatedAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const convos = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data({ serverTimestamps: "estimate" })
      }));
      setConversations(convos);
      
      if (initialChatId && !activeChatRef.current) {
        const found = convos.find(c => c.id === initialChatId);
        if (found) setActiveChat(found);
      } else if (!activeChatRef.current && convos.length > 0 && !initialChatId) {
        setActiveChat(convos[0]);
      } else if (activeChatRef.current) {
        // update active chat reference so we get typing updates
        const updatedActive = convos.find(c => c.id === activeChatRef.current.id);
        if (updatedActive) setActiveChat(updatedActive);
      }
    });

    return () => unsubscribe();
  }, [user, initialChatId]);

  // Mark messages as read when chat becomes active or when new messages arrive while active
  useEffect(() => {
    if (!activeChat || !user) return;
    
    // Clear unread count for current user
    if (activeChat.unreadCount && activeChat.unreadCount[user.uid] > 0) {
      updateDoc(doc(db, "conversations", activeChat.id), {
        [`unreadCount.${user.uid}`]: 0,
        [`lastReadTime.${user.uid}`]: serverTimestamp()
      });
    } else {
      // Just update read time
      updateDoc(doc(db, "conversations", activeChat.id), {
        [`lastReadTime.${user.uid}`]: serverTimestamp()
      });
    }
  }, [activeChat?.id, activeChat?.updatedAt, user]);

  // 2. Fetch messages for active chat
  useEffect(() => {
    if (!activeChat) return;

    const q = query(
      collection(db, "conversations", activeChat.id, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data({ serverTimestamps: "estimate" })
      })));
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    });

    return () => unsubscribe();
  }, [activeChat?.id]);

  const handleTyping = () => {
    if (!activeChat || !user) return;
    
    if (!isTyping) {
      setIsTyping(true);
      updateDoc(doc(db, "conversations", activeChat.id), {
        [`typing.${user.uid}`]: true
      });
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      updateDoc(doc(db, "conversations", activeChat.id), {
        [`typing.${user.uid}`]: false
      });
    }, 2000);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat || !user) return;

    const msgText = newMessage.trim();
    setNewMessage("");
    setIsTyping(false);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    let otherUserId = null;
    if (activeChat.participants && activeChat.participants.length > 0) {
      otherUserId = activeChat.participants.find(id => id !== user.uid);
    } else if (activeChat.participantDetails) {
      otherUserId = Object.keys(activeChat.participantDetails).find(id => id !== user.uid);
    }
    
    if (!otherUserId) {
      console.error("Could not determine otherUserId. Using fallback.");
      otherUserId = "unknown";
    }

    const currentUnread = activeChat.unreadCount?.[otherUserId] || 0;

    try {
      const addMessagePromise = addDoc(collection(db, "conversations", activeChat.id, "messages"), {
        text: msgText,
        senderId: user.uid,
        senderName: user.displayName || "User",
        createdAt: serverTimestamp(),
        type: "text"
      });

      const updateData = {
        lastMessage: msgText,
        updatedAt: serverTimestamp(),
        [`typing.${user.uid}`]: false
      };
      
      if (otherUserId !== "unknown") {
        updateData[`unreadCount.${otherUserId}`] = currentUnread + 1;
      }
      
      const updateConvoPromise = updateDoc(doc(db, "conversations", activeChat.id), updateData);
      await Promise.all([addMessagePromise, updateConvoPromise]);
    } catch (err) {
      console.error("Error sending message:", err); toast.error("Send Error: " + (err.message || "Unknown error"));
    }
  };

  const handleSendOffer = async (e) => {
    e.preventDefault();
    if (!offerDetails.price || !offerDetails.days || !activeChat || !user) return;

    const otherUserId = activeChat.participants.find(id => id !== user.uid);
    const currentUnread = activeChat.unreadCount?.[otherUserId] || 0;

    const addMessagePromise = addDoc(collection(db, "conversations", activeChat.id, "messages"), {
      text: "Sent a custom offer",
      senderId: user.uid,
      senderName: user.displayName || "User",
      createdAt: serverTimestamp(),
      type: "offer",
      offerPrice: offerDetails.price,
      offerDays: offerDetails.days,
      offerDescription: offerDetails.description,
      offerStatus: "pending"
    });

    await updateDoc(doc(db, "conversations", activeChat.id), {
      lastMessage: `Custom Offer: $${offerDetails.price}`,
      updatedAt: serverTimestamp(),
      [`unreadCount.${otherUserId}`]: currentUnread + 1
    });

    setOfferDetails({ price: "", days: "", description: "" });
    setShowOfferModal(false);
  };

  const acceptOffer = async (msgId) => {
    if (!activeChat) return;
    await updateDoc(doc(db, "conversations", activeChat.id, "messages", msgId), {
      offerStatus: "accepted"
    });
    // Normally, this would route to a checkout page and create an order in Firestore
    alert("Offer accepted! Order has been created.");
  };

  const formatMessageTime = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate();
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">Please log in to view your messages.</p>
        </div>
      </div>
    );
  }

  const otherUserId = activeChat?.participants.find(id => id !== user.uid);
  const otherUser = activeChat?.participantDetails?.[otherUserId] || { name: "User" };
  const isOtherTyping = activeChat?.typing?.[otherUserId] === true;
  const otherUserLastRead = activeChat?.lastReadTime?.[otherUserId]?.toMillis() || 0;

  const filteredConversations = conversations.filter(chat => {
    const partnerId = chat.participants.find(id => id !== user.uid) || user.uid;
    const partnerUser = chat.participantDetails?.[partnerId] || { name: "User" };
    
    const matchesSearch = partnerUser.name.toLowerCase().includes(searchQuery.toLowerCase());
    const myUnread = chat.unreadCount?.[user.uid] || 0;
    const matchesUnread = filterUnread ? myUnread > 0 : true;
    
    return matchesSearch && matchesUnread;
  });

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      <Navbar />
      
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 overflow-hidden flex gap-6">
        
        {/* Left Sidebar - Conversations */}
        <div className={`w-full md:w-[350px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-2xl flex flex-col shadow-sm overflow-hidden ${activeChat ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-gray-100 dark:border-white/10 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-gray-900 dark:text-white">Messages</h2>
              <button 
                onClick={() => setFilterUnread(!filterUnread)}
                className={`text-xs font-bold px-3 py-1.5 rounded-full transition-colors ${filterUnread ? 'bg-[#00C6A2] text-white' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}
              >
                Unread
              </button>
            </div>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search messages..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-white/10 rounded-xl py-2 px-4 text-sm outline-none focus:border-[#00C6A2]"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="p-6 text-center text-gray-500 text-sm">No conversations found</div>
            ) : (
              filteredConversations.map(chat => {
                const partnerId = chat.participants.find(id => id !== user.uid) || user.uid;
                const partnerUser = chat.participantDetails?.[partnerId] || { name: "User" };
                const isActive = activeChat?.id === chat.id;
                const myUnread = chat.unreadCount?.[user.uid] || 0;
                
                return (
                  <div 
                    key={chat.id} 
                    onClick={() => setActiveChat(chat)}
                    className={`p-4 border-b border-gray-50 dark:border-white/5 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-3 ${isActive ? 'bg-[#E6F9F5] dark:bg-[#00C6A2]/10 border-l-4 border-l-[#00C6A2]' : 'border-l-4 border-l-transparent'}`}
                  >
                    <div className="relative">
                      <img src={partnerUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(partnerUser.name)}`} alt={partnerUser.name} className="w-12 h-12 rounded-full border border-gray-200" />
                      {/* Simplistic online indicator (always green for demo, usually tied to presence system) */}
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <h4 className="font-bold text-[15px] text-gray-900 dark:text-white truncate">{partnerUser.name}</h4>
                        {chat.updatedAt && (
                          <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">
                            {formatMessageTime(chat.updatedAt)}
                          </span>
                        )}
                      </div>
                      <div className="flex justify-between items-center">
                        <p className={`text-xs truncate ${myUnread > 0 ? 'font-bold text-gray-900 dark:text-white' : 'text-gray-500'}`}>
                          {chat.typing?.[partnerId] ? <span className="text-[#00C6A2] font-semibold italic">typing...</span> : (chat.lastMessage || "Started a conversation")}
                        </p>
                        {myUnread > 0 && (
                          <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-2 shrink-0">
                            {myUnread}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Pane - Chat History */}
        <div className={`flex-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-2xl flex flex-col shadow-sm overflow-hidden ${!activeChat ? 'hidden md:flex' : 'flex'} relative`}>
          {activeChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-100 dark:border-white/10 flex items-center justify-between bg-gray-50/80 dark:bg-gray-950/80 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <button onClick={() => setActiveChat(null)} className="md:hidden text-gray-500">
                    ←
                  </button>
                  <img src={otherUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherUser.name)}`} alt={otherUser.name} className="w-10 h-10 rounded-full border border-gray-200" />
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white leading-tight">{otherUser.name}</h3>
                    
                    <div className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${otherUserStatus === "Online" ? "bg-green-500" : "bg-gray-400"}`}></div>
                      <p className={`text-[11px] font-semibold tracking-wide ${otherUserStatus === "Online" ? "text-green-500" : "text-gray-400"}`}>{otherUserStatus}</p>
                    </div>

                  </div>
                </div>
                {(dbUser?.role === 'freelancer' || dbUser?.role === 'admin') && (
                  <button 
                    onClick={() => setShowOfferModal(true)}
                    className="hidden md:flex items-center gap-2 bg-gray-900 dark:bg-gray-800 hover:bg-gray-800 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors"
                  >
                    <Briefcase size={14} /> Create Offer
                  </button>
                )}
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-[#0a0a0a]">
                {messages.map((msg, index) => {
                  const isMe = msg.senderId === user.uid;
                  const msgTime = msg.createdAt?.toMillis() || 0;
                  const isRead = msgTime > 0 && msgTime <= otherUserLastRead;
                  
                  return (
                    <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      {msg.isSpam ? (
                        <div className="w-full max-w-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-3 my-2 text-center shadow-sm">
                          <p className="text-xs text-gray-500 font-medium italic flex items-center justify-center gap-1">
                            <Ban size={12} /> This message was removed by moderation.
                          </p>
                        </div>
                      ) : msg.type === 'admin_alert' ? (
                        <div className="w-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 my-2 text-center shadow-sm">
                          <div className="flex items-center justify-center gap-2 text-red-600 dark:text-red-400 mb-2">
                            <ShieldAlert size={18} />
                            <span className="font-bold text-xs uppercase tracking-wider">Message from Admin</span>
                          </div>
                          <p className="text-sm font-bold text-red-800 dark:text-red-300">{msg.text}</p>
                          <span className="text-[10px] text-red-500/70 mt-2 block">{formatMessageTime(msg.createdAt)}</span>
                        </div>
                      ) : msg.type === 'offer' ? (
                        <div className="w-full max-w-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/10 rounded-2xl p-4 shadow-sm my-2">
                          <div className="flex justify-between items-center mb-3 border-b border-gray-100 dark:border-white/5 pb-2">
                            <h4 className="font-black text-gray-900 dark:text-white flex items-center gap-2">
                              <Briefcase size={16} className="text-[#00C6A2]" /> Custom Offer
                            </h4>
                            <span className="font-black text-xl text-[#00C6A2]">${msg.offerPrice}</span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{msg.offerDescription}</p>
                          <div className="flex justify-between items-center text-xs text-gray-500 mb-4 font-semibold">
                            <span>Delivery: {msg.offerDays} Days</span>
                            <span className={`px-2 py-1 rounded capitalize ${msg.offerStatus === 'accepted' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                              {msg.offerStatus}
                            </span>
                          </div>
                          {!isMe && msg.offerStatus === 'pending' && (
                            <button onClick={() => acceptOffer(msg.id)} className="w-full bg-[#00C6A2] hover:bg-[#00b08f] text-white font-bold py-2 rounded-lg transition-colors neon-glow">
                              Accept Offer
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 relative group ${isMe ? 'bg-[#00C6A2] text-white rounded-br-sm shadow-md' : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-white/10 rounded-bl-sm text-gray-800 dark:text-gray-200 shadow-sm'}`}>
                          <p className="text-[15px] leading-relaxed">{msg.text}</p>
                          
                          <div className={`flex items-center justify-end gap-1 mt-1 ${isMe ? 'text-white/80' : 'text-gray-400'}`}>
                            <span className="text-[9px]">{formatMessageTime(msg.createdAt)}</span>
                            {isMe && (
                              isRead ? <CheckCheck size={12} className="text-white" /> : <Check size={12} />
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
                
                {isOtherTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-white/10 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex items-center gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-white/10">
                {(dbUser?.role === 'freelancer' || dbUser?.role === 'admin') && (
                  <button 
                    onClick={() => setShowOfferModal(true)}
                    className="md:hidden w-full mb-3 flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-gray-700 dark:text-gray-300 text-xs font-bold px-4 py-2 rounded-lg transition-colors"
                  >
                    <Briefcase size={14} /> Send Custom Offer
                  </button>
                )}
                <form onSubmit={handleSendMessage} className="flex gap-2 items-end">
                  <div className="flex-1 bg-gray-100 dark:bg-gray-800 border border-transparent focus-within:border-[#00C6A2] rounded-2xl overflow-hidden flex transition-colors">
                    <textarea 
                      value={newMessage}
                      onChange={(e) => {
                        setNewMessage(e.target.value);
                        handleTyping();
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage(e);
                        }
                      }}
                      placeholder="Write a message..." 
                      className="flex-1 bg-transparent px-4 py-3 text-sm focus:outline-none dark:text-white resize-none h-[48px] max-h-[120px]"
                      rows={1}
                    />
                  </div>
                  <button type="submit" disabled={!newMessage.trim()} className="h-[48px] w-[48px] flex items-center justify-center bg-[#00C6A2] hover:bg-[#00b08f] text-white rounded-2xl disabled:opacity-50 transition-colors shrink-0">
                    <Send size={20} className="ml-1" />
                  </button>
                </form>
              </div>

              {/* Custom Offer Modal */}
              {showOfferModal && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <div className="bg-white dark:bg-gray-900 w-full max-w-sm rounded-3xl shadow-2xl p-6 border border-gray-100 dark:border-white/10 animate-in fade-in zoom-in duration-200">
                    <h3 className="text-xl font-black mb-4">Create Custom Offer</h3>
                    <form onSubmit={handleSendOffer} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Price ($)</label>
                        <input type="number" required value={offerDetails.price} onChange={e => setOfferDetails({...offerDetails, price: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2" placeholder="e.g. 150" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Delivery Time (Days)</label>
                        <input type="number" required value={offerDetails.days} onChange={e => setOfferDetails({...offerDetails, days: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2" placeholder="e.g. 3" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Description</label>
                        <textarea required value={offerDetails.description} onChange={e => setOfferDetails({...offerDetails, description: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2 h-24 resize-none" placeholder="What are you offering?"></textarea>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <button type="button" onClick={() => setShowOfferModal(false)} className="flex-1 py-2 font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-xl">Cancel</button>
                        <button type="submit" className="flex-1 py-2 font-bold text-white bg-[#00C6A2] hover:bg-[#00b08f] rounded-xl neon-glow">Send Offer</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <MessageSquare size={48} className="mb-4 opacity-20" />
              <p>Select a conversation to start chatting</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default function InboxPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">Loading Messages...</div>
      </div>
    }>
      <InboxContent />
    </Suspense>
  );
}
