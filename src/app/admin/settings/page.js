"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function AdminSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const docSnap = await getDoc(doc(db, "settings", "global"));
        if (docSnap.exists()) {
          setSettings(docSnap.data());
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
      setLoading(false);
    }
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (section) => {
    setSaving(section);
    try {
      await updateDoc(doc(db, "settings", "global"), settings);
      alert("Settings saved successfully!");
    } catch (e) {
      console.error(e);
      alert("Failed to save settings.");
    }
    setSaving(false);
  };

  if (loading) return <div>Loading settings...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8">Settings</h1>

      {/* Hero Section Settings */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 shadow-sm p-8 mb-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-6 border-b border-gray-100 pb-4">Hero Section Settings</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Main Title</label>
            <input 
              type="text" 
              name="hero_title"
              value={settings?.hero_title || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#00C6A2] outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Description</label>
            <textarea 
              name="hero_description"
              rows="3"
              value={settings?.hero_description || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#00C6A2] outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">YouTube Video URL</label>
            <input 
              type="text" 
              name="youtube_url"
              value={settings?.youtube_url || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#00C6A2] outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">WhatsApp Number</label>
            <input 
              type="text" 
              name="whatsappNumber"
              value={settings?.whatsappNumber || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#00C6A2] outline-none"
            />
          </div>
          
          <button 
            onClick={() => handleSave('hero')}
            disabled={saving === 'hero'}
            className="bg-[#00C6A2] hover:bg-[#00b08f] text-white px-6 py-2 rounded-lg font-bold transition-colors"
          >
            {saving === 'hero' ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}
