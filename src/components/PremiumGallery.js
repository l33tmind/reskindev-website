"use client";

import { useState } from "react";
import { Lock, Unlock, Image as ImageIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function PremiumGallery({ images, unlockPrice }) {
  const { user } = useAuth();
  const [unlocked, setUnlocked] = useState(false);
  const [unlocking, setUnlocking] = useState(false);

  if (!images || images.length === 0) return null;

  const handleUnlock = async () => {
    if (!user) return alert("Please sign in to unlock premium content.");
    
    setUnlocking(true);
    // In a real app, this would trigger a payment modal or debit tokens.
    // For now, we mock the successful unlock.
    setTimeout(() => {
      setUnlocked(true);
      setUnlocking(false);
      alert("Gallery Unlocked successfully!");
    }, 1000);
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4 text-gray-900 flex items-center gap-2">
        <ImageIcon size={20} className="text-[#00C6A2]" /> 
        Premium Screenshots
      </h2>
      
      <div className="relative bg-white p-4 rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        
        {/* Gallery Grid */}
        <div className={`grid grid-cols-2 md:grid-cols-3 gap-3 ${!unlocked ? 'blur-md opacity-70 select-none pointer-events-none' : ''}`}>
          {images.map((img, idx) => (
            <div key={idx} className="aspect-[4/3] rounded-lg overflow-hidden bg-gray-100">
              <img src={img} alt={`Premium ${idx + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform" />
            </div>
          ))}
        </div>

        {/* Lock Overlay */}
        {!unlocked && (
          <div className="absolute inset-0 bg-white/40 flex flex-col items-center justify-center backdrop-blur-sm z-10">
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200 text-center max-w-sm w-full mx-4">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock size={32} />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">Exclusive Content Locked</h3>
              <p className="text-gray-500 text-sm mb-6">
                Unlock high-quality premium screenshots and secret app features for this service.
              </p>
              <button 
                onClick={handleUnlock}
                disabled={unlocking}
                className="w-full bg-[#00C6A2] hover:bg-[#00b08f] text-white font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {unlocking ? "Processing..." : (
                  <>
                    <Unlock size={18} />
                    Unlock for ${unlockPrice || 10}
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
