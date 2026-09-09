"use client";

import { Share2 } from "lucide-react";
import toast from "react-hot-toast";

export default function ShareButton() {
  return (
    <button 
      onClick={() => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      }}
      className="p-2 bg-white rounded-full border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm text-gray-500 hover:text-[#00C6A2]"
      title="Share Service"
    >
      <Share2 size={20} />
    </button>
  );
}
