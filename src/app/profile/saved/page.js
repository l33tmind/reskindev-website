"use client";

import { useEffect, useState } from "react";
import { collection, query, where, getDocs, documentId } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SavedServices() {
  const router = useRouter();
  const { user, dbUser } = useAuth();
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSaved() {
      if (!dbUser || !dbUser.savedGigs || dbUser.savedGigs.length === 0) {
        setGigs([]);
        setLoading(false);
        return;
      }

      try {
        // Fetch up to 10 at a time to avoid in query limits, but assuming < 10 for now.
        const chunk = dbUser.savedGigs.slice(0, 10);
        const q = query(collection(db, "services"), where(documentId(), "in", chunk));
        const snap = await getDocs(q);
        
        setGigs(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e) {
        console.error("Error fetching saved gigs:", e);
      }
      setLoading(false);
    }
    fetchSaved();
  }, [dbUser]);

  if (loading) return <div>Loading saved services...</div>;

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-gray-900 mb-6">Saved Services</h1>

      {gigs.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl border border-gray-200 text-center text-gray-500">
          <Heart size={48} className="mx-auto mb-4 text-gray-300" />
          You haven't saved any services yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gigs.map(gig => {
            const ytMatch = gig.youtubeUrl ? gig.youtubeUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i) : null;
            const ytId = ytMatch ? ytMatch[1] : null;
            const coverImage = ytId 
              ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg` 
              : gig.imageUrl;
            
            const startingPrice = gig.packages && gig.packages.length > 0 
              ? gig.packages[0].price 
              : 0;

            return (
              <Link key={gig.id} href={`/gig/${gig.id}/${gig.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}>
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer h-full flex flex-col group">
                  <div className="w-full h-48 relative overflow-hidden bg-gray-100">
                    {coverImage ? (
                      <img src={coverImage} alt={gig.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                    )}
                    <div className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md text-red-500">
                      <Heart size={16} fill="currentColor" />
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        router.push(`/user/${gig.authorId || 'admin'}`);
                      }}
                      className="flex items-center gap-2 mb-3 cursor-pointer hover:opacity-80 transition-opacity w-fit z-10"
                    >
                      <img 
                        src={gig.authorImage || "https://ui-avatars.com/api/?name=MD+Robius+Sany&background=00C6A2&color=fff"} 
                        alt={gig.authorName || "MD Robius Sany"} 
                        className="w-6 h-6 rounded-full object-cover border border-gray-200"
                      />
                      <span className="text-[12px] font-bold text-gray-700 hover:text-[#00C6A2]">
                        {gig.authorName || "MD Robius Sany"}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2 text-[15px] leading-snug line-clamp-2 flex-1 group-hover:text-green-600 transition-colors">
                      {gig.title}
                    </h3>
                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                      <div className="text-xs text-gray-500">Starting at</div>
                      <div className="font-black text-xl text-gray-900">
                        ${startingPrice}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
