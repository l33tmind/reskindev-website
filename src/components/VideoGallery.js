"use client";

import { useState } from "react";
import { Play, Lock } from "lucide-react";
import toast from "react-hot-toast";

function getYoutubeId(url) {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  return match ? match[1] : null;
}

export default function VideoGallery({ youtubeUrls, imageUrl, title }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!youtubeUrls || youtubeUrls.length === 0) {
    return (
      <div className="w-full bg-black rounded-2xl overflow-hidden mb-8 shadow-sm relative">
        {imageUrl ? (
          <div className="aspect-video w-full">
            <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="aspect-video w-full flex items-center justify-center text-gray-400 bg-gray-100 dark:bg-gray-800">
            No Preview Available
          </div>
        )}
      </div>
    );
  }

  const activeVideoId = getYoutubeId(youtubeUrls[activeIndex]);

  const handleVideoSelect = (index) => {
    if (index > 0) {
      toast.error("Please purchase this service to unlock premium videos.", {
        icon: '🔒',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
      return;
    }
    setActiveIndex(index);
  };

  return (
    <div className="w-full mb-8">
      {/* Main Player */}
      <div className="w-full bg-black rounded-2xl overflow-hidden shadow-sm relative mb-4">
        <div className="aspect-video w-full">
          {activeVideoId ? (
            <iframe
              src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=0&rel=0`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white bg-gray-800">
              Invalid Video URL
            </div>
          )}
        </div>
      </div>

      {/* Thumbnails Gallery */}
      {youtubeUrls.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
          {youtubeUrls.map((url, index) => {
            const ytId = getYoutubeId(url);
            if (!ytId) return null;
            const thumbUrl = `https://img.youtube.com/vi/${ytId}/mqdefault.jpg`;
            const isActive = index === activeIndex;
            const isLocked = index > 0;

            return (
              <button
                key={index}
                onClick={() => handleVideoSelect(index)}
                className={`relative shrink-0 w-32 aspect-video rounded-xl overflow-hidden border-2 transition-all ${
                  isActive ? "border-[#00C6A2] ring-2 ring-[#00C6A2]/20" : "border-transparent opacity-80 hover:opacity-100"
                }`}
              >
                <img src={thumbUrl} alt={`Thumbnail ${index + 1}`} className={`w-full h-full object-cover ${isLocked ? 'blur-[2px]' : ''}`} />
                <div className="absolute top-1 left-1 bg-black/70 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                  {index + 1}
                </div>
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className={`w-8 h-8 rounded-full ${isLocked ? 'bg-red-500/80' : 'bg-white dark:bg-gray-900/30'} backdrop-blur-sm flex items-center justify-center`}>
                     {isLocked ? (
                       <Lock size={14} className="text-white" />
                     ) : (
                       <Play size={14} className="text-white fill-white ml-0.5" />
                     )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
