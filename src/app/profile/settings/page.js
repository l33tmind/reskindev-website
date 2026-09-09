"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Save } from "lucide-react";

export default function ProfileSettings() {
  const { user, dbUser } = useAuth();
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    displayName: "",
    phone: "",
    country: ""
  });

  useEffect(() => {
    if (dbUser) {
      setFormData({
        displayName: dbUser.displayName || user?.displayName || "",
        phone: dbUser.phone || "",
        country: dbUser.country || ""
      });
    }
  }, [dbUser, user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, "users", user.uid), formData);
      alert("Profile updated successfully!");
    } catch (e) {
      alert("Error updating profile.");
      console.error(e);
    }
    setSaving(false);
  };

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-gray-900 mb-6">Profile Settings</h1>
      
      <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm max-w-2xl">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Email Address (Read-only)</label>
            <input 
              type="text" 
              disabled
              value={user?.email || ""}
              className="w-full border border-gray-200 bg-gray-50 rounded-lg p-3 text-gray-500 cursor-not-allowed"
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Display Name</label>
            <input 
              type="text" 
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#00C6A2]"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
            <input 
              type="text" 
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#00C6A2]"
              placeholder="+1 234 567 890"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Country</label>
            <input 
              type="text" 
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#00C6A2]"
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
