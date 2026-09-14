"use client";

import { useEffect, useState } from "react";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Edit2, Plus, Trash2, Video } from "lucide-react";
import toast from "react-hot-toast";

export default function FreelancerGigs() {
  const { user, dbUser, loading } = useAuth();
  const [gigs, setGigs] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!user) return;
    async function fetchGigs() {
      try {
        const q = query(collection(db, "services"), where("authorId", "==", user.uid));
        const snap = await getDocs(q);
        setGigs(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error(err);
      }
      setFetching(false);
    }
    fetchGigs();
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this gig?")) return;
    try {
      await deleteDoc(doc(db, "services", id));
      setGigs(gigs.filter(g => g.id !== id));
      toast.success("Gig deleted.");
    } catch (err) {
      toast.error("Failed to delete gig.");
      console.error(err);
    }
  };

  if (loading || fetching) return <div className="p-20 text-center text-gray-500">Loading your gigs...</div>;

  if (dbUser?.role !== "freelancer") {
    return <div className="p-20 text-center text-red-500 font-bold">Access Denied. You must be a Seller to view this page.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <div className="max-w-6xl mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white">My Gigs</h1>
            <p className="text-gray-500 text-sm">Manage the services you offer</p>
          </div>
          <Link href="/freelancer/gigs/edit/new" className="bg-[#00C6A2] hover:bg-[#00b08f] text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2">
            <Plus size={18} /> Create New Gig
          </Link>
        </div>

        {gigs.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 p-10 rounded-2xl border border-gray-200 dark:border-white/10 text-center text-gray-500 dark:text-gray-400">
            You haven't created any gigs yet. Click "Create New Gig" to start selling!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gigs.map(gig => (
              <div key={gig.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm flex flex-col">
                <div className="w-full aspect-video bg-gray-100 dark:bg-gray-800 relative">
                  {gig.youtubeUrl ? (
                    <img 
                      src={`https://img.youtube.com/vi/${gig.youtubeUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i)?.[1]}/maxresdefault.jpg`} 
                      className="w-full h-full object-cover" 
                      alt={gig.title} 
                    />
                  ) : gig.youtubeUrls && gig.youtubeUrls[0] ? (
                    <img 
                      src={`https://img.youtube.com/vi/${gig.youtubeUrls[0].match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i)?.[1]}/maxresdefault.jpg`} 
                      className="w-full h-full object-cover" 
                      alt={gig.title} 
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-gray-400">
                      <Video size={32} />
                    </div>
                  )}
                  <div className={`absolute top-2 right-2 px-2 py-1 rounded text-[10px] font-bold uppercase ${gig.status === 'active' ? 'bg-green-500 text-white' : 'bg-orange-500 text-white'}`}>
                    {gig.status || 'pending'}
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white line-clamp-2 mb-2">{gig.title || "Untitled Gig"}</h3>
                  </div>
                  <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-white/10">
                    <Link href={`/freelancer/gigs/edit/${gig.id}`} className="flex-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 text-center py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2">
                      <Edit2 size={16} /> Edit
                    </Link>
                    <button onClick={() => handleDelete(gig.id)} className="bg-red-50 hover:bg-red-100 text-red-500 p-2 rounded-lg">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
