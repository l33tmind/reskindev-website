"use client";

import { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot, getDoc, doc, addDoc, serverTimestamp, updateDoc, deleteDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Search, User, MessageCircle, AlertTriangle, Trash2, ShieldAlert, Send, Settings, X, Ban } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

export default function AdminMessages() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [search, setSearch] = useState("");
  const [adminMsg, setAdminMsg] = useState("");
  const [sending, setSending] = useState(false);
  const [participantStats, setParticipantStats] = useState([]);
  const [allUsersMap, setAllUsersMap] = useState({});

  // Moderation / Flagged Words state
  const [flaggedWords, setFlaggedWords] = useState(["whatsapp", "email", "paypal", "pay outside", "direct pay", "skype", "telegram"]);
  const [showKeywordModal, setShowKeywordModal] = useState(false);
  const [newKeyword, setNewKeyword] = useState("");

  useEffect(() => {
    const unsubUsers = onSnapshot(collection(db, "users"), (snap) => {
      const map = {};
      snap.docs.forEach(d => {
        map[d.id] = d.data();
      });
      setAllUsersMap(map);
    });
    return () => unsubUsers();
  }, []);

  useEffect(() => {
    // Fetch Flagged Keywords from Firebase Settings
    const unsubKeywords = onSnapshot(doc(db, "settings", "moderation"), (docSnap) => {
      if (docSnap.exists() && docSnap.data().keywords) {
        setFlaggedWords(docSnap.data().keywords);
      }
    });

    // Fetch ALL conversations for God Mode
    const q = query(collection(db, "conversations"), orderBy("updatedAt", "desc"));
    const unsubChats = onSnapshot(q, (snapshot) => {
      setConversations(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => {
      unsubKeywords();
      unsubChats();
    };
  }, []);

  useEffect(() => {
    if (!selectedChat) {
      setMessages([]);
      setParticipantStats([]);
      return;
    }
    // Fetch Messages
    const q = query(
      collection(db, "conversations", selectedChat.id, "messages"),
      orderBy("createdAt", "asc")
    );
    const unsub = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    // Fetch Participant Details
    const fetchUsers = async () => {
      const stats = [];
      for (const pId of selectedChat.participants || []) {
        try {
          const uSnap = await getDoc(doc(db, "users", pId));
          if(uSnap.exists()) {
            stats.push(uSnap.data());
          }
        } catch(e){}
      }
      setParticipantStats(stats);
    };
    fetchUsers();

    return () => unsub();
  }, [selectedChat]);

  const filteredConversations = conversations.filter(c => {
    const p1Id = c.participants?.[0];
    const p2Id = c.participants?.[1];
    
    const p1Name = Object.values(c.participantDetails || {})[0]?.name || "";
    const p2Name = Object.values(c.participantDetails || {})[1]?.name || "";
    
    const p1User = allUsersMap[p1Id] || {};
    const p2User = allUsersMap[p2Id] || {};
    
    const p1Username = p1User.username || "";
    const p2Username = p2User.username || "";

    const s = search.toLowerCase();

    return p1Name.toLowerCase().includes(s) || 
           p2Name.toLowerCase().includes(s) ||
           p1Username.toLowerCase().includes(s) ||
           p2Username.toLowerCase().includes(s);
  });

  const checkFlagged = (text) => {
    if (!text) return false;
    const lower = text.toLowerCase();
    return flaggedWords.some(w => lower.includes(w.toLowerCase()));
  };

  const handleAddKeyword = async (e) => {
    e.preventDefault();
    if (!newKeyword.trim()) return;
    const kw = newKeyword.trim().toLowerCase();
    if (flaggedWords.includes(kw)) {
      setNewKeyword("");
      return;
    }
    
    const updated = [...flaggedWords, kw];
    await setDoc(doc(db, "settings", "moderation"), { keywords: updated }, { merge: true });
    setNewKeyword("");
    toast.success("Keyword added!");
  };

  const handleRemoveKeyword = async (kw) => {
    const updated = flaggedWords.filter(w => w !== kw);
    await setDoc(doc(db, "settings", "moderation"), { keywords: updated }, { merge: true });
    toast.success("Keyword removed!");
  };

  const handleAdminSend = async (e) => {
    e.preventDefault();
    if (!adminMsg.trim() || !selectedChat || !user) return;
    setSending(true);
    try {
      await addDoc(collection(db, "conversations", selectedChat.id, "messages"), {
        text: adminMsg.trim(),
        senderId: user.uid,
        senderName: "Platform Admin",
        type: "admin_alert",
        createdAt: serverTimestamp()
      });
      await updateDoc(doc(db, "conversations", selectedChat.id), {
        lastMessage: "⚠️ Admin Notice: " + adminMsg.trim(),
        updatedAt: serverTimestamp()
      });
      setAdminMsg("");
      toast.success("Warning sent!");
    } catch (err) {
      toast.error("Failed to send message");
    }
    setSending(false);
  };

  const handleDeleteChat = async () => {
    if(!selectedChat) return;
    if(!window.confirm("Are you sure you want to completely delete this conversation? This cannot be undone.")) return;
    
    try {
      await deleteDoc(doc(db, "conversations", selectedChat.id));
      setSelectedChat(null);
      toast.success("Chat deleted.");
    } catch(err) {
      toast.error("Error deleting chat.");
    }
  };

  const toggleSpam = async (msgId, currentSpamStatus) => {
    if(!selectedChat) return;
    try {
      await updateDoc(doc(db, "conversations", selectedChat.id, "messages", msgId), {
        isSpam: !currentSpamStatus
      });
      toast.success(currentSpamStatus ? "Marked as Not Spam" : "Marked as Spam (Hidden from users)");
    } catch(err) {
      toast.error("Failed to update spam status");
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto flex h-[calc(100vh-120px)] bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden relative">
      
      {/* 1. Left List (Conversations) */}
      <div className="w-1/4 border-r border-gray-200 dark:border-white/10 flex flex-col min-w-[250px]">
        <div className="p-4 border-b border-gray-200 dark:border-white/10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">All Chats</h2>
            <button 
              onClick={() => setShowKeywordModal(true)}
              className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
              title="Manage Flagged Keywords"
            >
              <Settings size={18} />
            </button>
          </div>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#00C6A2]"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map(chat => {
            const users = Object.values(chat.participantDetails || {});
            let names = "Unknown Users";
            if (users.length > 0) {
              names = users.map(u => u.name).join(" & ");
            } else if (chat.participants && chat.participants.length > 0) {
              names = `Chat (${chat.participants.length} members)`;
            }
            
            const isFlagged = checkFlagged(chat.lastMessage);

            return (
              <div 
                key={chat.id}
                onClick={() => setSelectedChat(chat)}
                className={`p-4 border-b border-gray-50 dark:border-white/5 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors relative ${selectedChat?.id === chat.id ? 'bg-[#00C6A2]/10 border-l-4 border-l-[#00C6A2]' : 'border-l-4 border-l-transparent'} ${isFlagged ? 'bg-red-50 dark:bg-red-900/10' : ''}`}
              >
                {isFlagged && <AlertTriangle size={14} className="absolute top-4 right-4 text-red-500" />}
                <h4 className={`font-bold text-sm truncate pr-6 ${isFlagged ? 'text-red-700 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>{names}</h4>
                <p className={`text-xs truncate mt-1 ${isFlagged ? 'text-red-500 font-medium' : 'text-gray-500'}`}>{chat.lastMessage || "No messages yet"}</p>
                {chat.updatedAt && typeof chat.updatedAt.toDate === 'function' && <p className="text-[10px] text-gray-400 mt-2">{chat.updatedAt.toDate().toLocaleString()}</p>}
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Middle Viewer (Messages) */}
      <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-950/50">
        {selectedChat ? (
          <>
            <div className="p-4 border-b border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 flex justify-between items-center shadow-sm z-10">
              <div className="flex items-center gap-3">
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <ShieldAlert size={18} className="text-red-500" /> Monitoring Chat
                </h3>
                <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-1 rounded border border-red-100 uppercase tracking-wide">God Mode</span>
              </div>
              <button 
                onClick={handleDeleteChat}
                className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold border border-transparent hover:border-red-200"
              >
                <Trash2 size={16} /> Delete Chat
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map(msg => {
                const isUser1 = msg.senderId === selectedChat.participants[0];
                const msgFlagged = checkFlagged(msg.text);

                return (
                  <div key={msg.id} className={`flex flex-col group ${msg.type === 'admin_alert' ? 'items-center w-full' : (isUser1 ? 'items-start' : 'items-end')}`}>
                    {msg.type === 'admin_alert' ? (
                      <div className="bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200 p-3 rounded-xl text-sm border border-red-200 font-bold flex flex-col items-center my-2 max-w-[80%] text-center relative">
                        <span className="text-[10px] uppercase mb-1 opacity-70">Admin Notice</span>
                        {msg.text}
                      </div>
                    ) : (
                      <>
                        <div className={`flex gap-2 items-center mb-1 ${!isUser1 && 'flex-row-reverse'}`}>
                          <span className="text-[10px] text-gray-400 font-bold">{msg.senderName || "Unknown"}</span>
                          {msg.createdAt && typeof msg.createdAt.toDate === 'function' && (
                            <span className="text-[9px] text-gray-300">{msg.createdAt.toDate().toLocaleTimeString()}</span>
                          )}
                          {/* Manual Spam Flag Button (Visible on Hover) */}
                          <button 
                            onClick={() => toggleSpam(msg.id, msg.isSpam)}
                            className={`opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full ${msg.isSpam ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'}`}
                            title={msg.isSpam ? "Unmark Spam" : "Mark as Spam (Hide from users)"}
                          >
                            <Ban size={12} />
                          </button>
                        </div>
                        
                        {msg.type === 'offer' ? (
                           <div className={`bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 p-3 rounded-lg text-sm border ${msg.isSpam ? 'border-red-500 opacity-70' : 'border-orange-200 dark:border-orange-500/30'}`}>
                             {msg.isSpam && <div className="text-red-600 font-black text-xs mb-1 uppercase flex items-center gap-1"><Ban size={12} /> Marked Spam</div>}
                             <strong>Custom Offer:</strong> ${msg.offerPrice} for {msg.offerDays} Days. Status: {msg.offerStatus}
                           </div>
                        ) : (
                          <div className={`px-4 py-2 rounded-2xl max-w-[80%] ${msg.isSpam ? 'bg-red-900 text-white border border-red-500 line-through opacity-80' : msgFlagged ? 'bg-red-50 border border-red-200 text-red-900 font-medium shadow-sm' : (isUser1 ? 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/10 rounded-tl-sm text-gray-900 dark:text-gray-100 shadow-sm' : 'bg-gray-200 dark:bg-gray-700 rounded-tr-sm text-gray-900 dark:text-gray-100 shadow-sm')}`}>
                            {msg.isSpam && <div className="text-red-300 font-black text-[10px] mb-1 uppercase flex items-center gap-1"><Ban size={10} /> Hidden / Spam</div>}
                            <p className="text-sm">{msg.text}</p>
                            {!msg.isSpam && msgFlagged && <span className="text-[9px] text-red-500 font-bold mt-1 block flex items-center gap-1"><AlertTriangle size={10}/> Flagged Keyword Detected</span>}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
              {messages.length === 0 && <p className="text-center text-gray-500 text-sm">No messages in this conversation yet.</p>}
            </div>

            {/* Admin Intervention Input */}
            <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-white/10">
              <form onSubmit={handleAdminSend} className="flex gap-2">
                <input 
                  type="text" 
                  value={adminMsg}
                  onChange={e => setAdminMsg(e.target.value)}
                  placeholder="Send an official warning or admin notice..."
                  className="flex-1 bg-gray-100 dark:bg-gray-800 border border-transparent focus:border-red-400 focus:ring-1 focus:ring-red-400 rounded-xl px-4 py-2 text-sm outline-none"
                />
                <button 
                  type="submit" 
                  disabled={!adminMsg.trim() || sending}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-bold disabled:opacity-50 flex items-center gap-2"
                >
                  <Send size={16} />
                  Send Warning
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <MessageCircle size={48} className="mb-4 opacity-20" />
            <p>Select a conversation to monitor</p>
          </div>
        )}
      </div>

      {/* 3. Right Sidebar (User Stats) */}
      {selectedChat && (
        <div className="w-1/4 border-l border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 flex flex-col min-w-[250px] overflow-y-auto">
          <div className="p-4 border-b border-gray-200 dark:border-white/10">
            <h3 className="font-bold text-gray-900 dark:text-white">Participant Details</h3>
          </div>
          <div className="p-4 space-y-6">
            {participantStats.length === 0 ? (
              <p className="text-sm text-gray-500 text-center">Loading info...</p>
            ) : (
              participantStats.map((u, i) => (
                <div key={u.uid} className="bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-white/5 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-200 dark:border-white/5">
                    <img src={u.photoURL || `https://ui-avatars.com/api/?name=${u.displayName}`} alt={u.displayName} className="w-10 h-10 rounded-full border border-gray-200" />
                    <div>
                      <h4 className="font-bold text-sm text-gray-900 dark:text-white line-clamp-1">{u.displayName}</h4>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${u.role === 'freelancer' ? 'bg-[#00C6A2]/10 text-[#00C6A2]' : 'bg-blue-100 text-blue-600'}`}>
                        {u.role || "User"}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-gray-500">
                      <span>Email:</span>
                      <span className="font-medium text-gray-800 dark:text-gray-200 truncate ml-2" title={u.email}>{u.email}</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>Username:</span>
                      <span className="font-medium text-gray-800 dark:text-gray-200 truncate ml-2">@{u.username || "N/A"}</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>Joined:</span>
                      <span className="font-medium text-gray-800 dark:text-gray-200">
                        {u.createdAt && typeof u.createdAt.toDate === 'function' ? u.createdAt.toDate().toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-white/5 flex gap-2">
                       <button 
                         onClick={() => window.open(u.username ? '/' + u.username : '/user/' + u.uid, '_blank')}
                         className="flex-1 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 py-1.5 rounded-lg font-bold text-[10px] uppercase transition-colors"
                       >
                         View Profile
                       </button>
                       <button 
                         onClick={async () => {
                           if(window.confirm('Are you sure you want to ban ' + u.displayName + '?')) {
                             try {
                               await updateDoc(doc(db, "users", u.uid), { banned: true });
                               toast.success(u.displayName + ' banned successfully.');
                             } catch(err) {
                               toast.error('Failed to ban user.');
                             }
                           }
                         }}
                         className="flex-1 bg-red-100 hover:bg-red-200 text-red-600 py-1.5 rounded-lg font-bold text-[10px] uppercase transition-colors"
                       >
                         Ban User
                       </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Settings Modal for Flagged Keywords */}
      {showKeywordModal && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 w-full max-w-sm rounded-3xl p-6 shadow-2xl relative">
            <button onClick={() => setShowKeywordModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 dark:hover:text-white">
              <X size={20} />
            </button>
            <h3 className="text-lg font-bold mb-4">Manage Flagged Words</h3>
            <p className="text-xs text-gray-500 mb-4">Messages containing these words will be automatically highlighted in God Mode to help you stop off-platform payments.</p>
            
            <div className="flex flex-wrap gap-2 mb-6 max-h-40 overflow-y-auto">
              {flaggedWords.map(kw => (
                <div key={kw} className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1 border border-red-100 dark:border-red-800">
                  {kw}
                  <button onClick={() => handleRemoveKeyword(kw)} className="hover:text-red-900 dark:hover:text-white"><X size={12} /></button>
                </div>
              ))}
              {flaggedWords.length === 0 && <span className="text-sm text-gray-400">No flagged keywords.</span>}
            </div>

            <form onSubmit={handleAddKeyword} className="flex gap-2">
              <input 
                type="text"
                value={newKeyword}
                onChange={e => setNewKeyword(e.target.value)}
                placeholder="Add new word..."
                className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00C6A2]"
              />
              <button type="submit" className="bg-[#00C6A2] hover:bg-[#00b08f] text-white px-4 py-2 rounded-lg text-sm font-bold">Add</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
