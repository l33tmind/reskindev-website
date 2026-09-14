"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { doc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Save } from "lucide-react";

export default function ProfileSettings() {
  const { user, dbUser } = useAuth();
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    username: "",
    displayName: "",
    phone: "",
    country: ""
  });

  const [usernameStatus, setUsernameStatus] = useState("idle"); // idle, checking, available, taken

  useEffect(() => {
    if (dbUser) {
      setFormData({
        username: dbUser.username || "",
        displayName: dbUser.displayName || user?.displayName || "",
        phone: dbUser.phone || "",
        country: dbUser.country || ""
      });
    }
  }, [dbUser, user]);

  useEffect(() => {
    const checkAvailability = async () => {
      const uName = formData.username;
      if (!uName || uName === dbUser?.username) {
        setUsernameStatus("idle");
        return;
      }
      setUsernameStatus("checking");
      try {
        const q = query(collection(db, "users"), where("username", "==", uName));
        const querySnapshot = await getDocs(q);
        let isTaken = false;
        querySnapshot.forEach(docSnap => {
           if (docSnap.id !== user.uid) isTaken = true;
        });
        setUsernameStatus(isTaken ? "taken" : "available");
      } catch (err) {
        setUsernameStatus("idle");
      }
    };
    
    const timeoutId = setTimeout(checkAvailability, 500);
    return () => clearTimeout(timeoutId);
  }, [formData.username, dbUser?.username, user?.uid]);

  const handleChange = (e) => {
    let val = e.target.value;
    if (e.target.name === "username") {
      val = val.toLowerCase().replace(/[^a-z0-9_]/g, '');
    }
    setFormData({ ...formData, [e.target.name]: val });
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      let updatePayload = { ...formData };
      
      // Username change validation logic
      if (formData.username && formData.username !== (dbUser.username || "")) {
        const now = Date.now();
        const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);
        const history = dbUser.usernameChanges || [];
        
        // Filter recent changes within the last 30 days
        const recentChanges = history.filter(ts => {
           const time = ts?.toMillis ? ts.toMillis() : ts;
           return time > thirtyDaysAgo;
        });

        if (recentChanges.length >= 2) {
          alert("You can only change your username 2 times within 30 days.");
          setSaving(false);
          return;
        }

        // Check uniqueness
        const q = query(collection(db, "users"), where("username", "==", formData.username));
        const querySnapshot = await getDocs(q);
        let isTaken = false;
        querySnapshot.forEach(docSnap => {
           if (docSnap.id !== user.uid) isTaken = true;
        });
        
        if (isTaken) {
          alert("This username is already taken. Please choose another.");
          setSaving(false);
          return;
        }

        // Append new timestamp to change history
        updatePayload.usernameChanges = [...recentChanges, now];
      }

      await updateDoc(doc(db, "users", user.uid), updatePayload);
      alert("Profile updated successfully!");
    } catch (e) {
      alert("Error updating profile.");
      console.error(e);
    }
    setSaving(false);
  };

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-6">Profile Settings</h1>
      
      <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm max-w-2xl">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Email Address (Read-only)</label>
            <input 
              type="text" 
              disabled
              value={user?.email || ""}
              className="w-full border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-gray-950 rounded-lg p-3 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Username</label>
            <p className="text-xs text-gray-500 mb-2">Unique identifier (letters, numbers, underscores). Max 2 changes per 30 days.</p>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 font-bold">@</span>
              <input 
                type="text" 
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`w-full pl-8 pr-10 border ${
                  usernameStatus === 'taken' ? 'border-red-500 focus:ring-red-500' 
                  : usernameStatus === 'available' ? 'border-green-500 focus:ring-green-500' 
                  : 'border-gray-300 dark:border-white/10 focus:ring-[#00C6A2]'
                } bg-white dark:bg-gray-800 rounded-lg p-3 outline-none focus:ring-2`}
                placeholder="your_unique_username"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {usernameStatus === 'checking' && <span className="text-gray-400 text-sm">...</span>}
                {usernameStatus === 'available' && <span className="text-green-500 font-bold">✅</span>}
                {usernameStatus === 'taken' && <span className="text-red-500 font-bold">❌</span>}
              </div>
            </div>
            {usernameStatus === 'taken' && <p className="text-red-500 text-xs mt-1 font-semibold">This username is already taken.</p>}
            {usernameStatus === 'available' && <p className="text-green-500 text-xs mt-1 font-semibold">Username available!</p>}
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Display Name</label>
            <input 
              type="text" 
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-white/10 bg-white dark:bg-gray-800 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#00C6A2]"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
            <input 
              type="text" 
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-white/10 bg-white dark:bg-gray-800 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#00C6A2]"
              placeholder="+1 234 567 890"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Country</label>
            <input 
              type="text" 
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-white/10 bg-white dark:bg-gray-800 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#00C6A2]"
              placeholder="e.g. Bangladesh"
            />
          </div>

          <button 
            onClick={handleSave}
            disabled={saving}
            className="bg-[#00C6A2] hover:bg-[#00b08f] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-md transition-colors mt-4"
          >
            <Save size={18} /> {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
