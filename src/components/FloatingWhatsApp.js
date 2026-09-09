"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { MessageCircle } from "lucide-react";

export default function FloatingWhatsApp() {
  const [whatsapp, setWhatsapp] = useState(null);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const docSnap = await getDoc(doc(db, "settings", "global"));
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.whatsappNumber) {
            setWhatsapp(data.whatsappNumber);
          }
        }
      } catch (e) {
        console.error("Error fetching whatsapp settings:", e);
      }
    }
    fetchSettings();
  }, []);

  if (!whatsapp) return null;

  // Format the number (remove non-digits if necessary, but WhatsApp needs country code)
  const formattedNumber = whatsapp.replace(/[^0-9]/g, "");

  return (
    <a
      href={`https://wa.me/${formattedNumber}?text=Hello!%20I%20came%20from%20your%20website%20and%20want%20to%20discuss%20a%20project.`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all z-50 flex items-center justify-center"
      title="Chat on WhatsApp"
    >
      <MessageCircle size={28} />
      <span className="absolute -top-1 -right-1 flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
      </span>
    </a>
  );
}
