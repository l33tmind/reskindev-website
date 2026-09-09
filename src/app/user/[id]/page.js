"use client";

import { use, useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Navbar from "@/components/Navbar";
import ServiceGrid from "@/components/ServiceGrid";

export default function UserProfile({ params }) {
  const resolvedParams = use(params);
  const userId = resolvedParams.id;
  
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Since we don't have user profiles saved separately with their gigs yet,
  // we'll fetch gigs where authorId matches, OR if it's 'admin', fetch all gigs 
  // (since right now all gigs belong to the admin/site owner).
  useEffect(() => {
    async function fetchUserGigs() {
      try {
        let q;
        if (userId === 'admin' || userId === 'md-robius-sany') {
          q = query(collection(db, "services")); // Get all gigs for admin
        } else {
          q = query(collection(db, "services"), where("authorId", "==", userId));
        }
        
        const snap = await getDocs(q);
        setGigs(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (e) {
        console.error("Error fetching user gigs:", e);
      }
      setLoading(false);
    }
    fetchUserGigs();
  }, [userId]);

  const authorName = gigs.length > 0 && gigs[0].authorName ? gigs[0].authorName : "MD Robius Sany";
  const authorImage = gigs.length > 0 && gigs[0].authorImage ? gigs[0].authorImage : `https://ui-avatars.com/api/?name=MD+Robius+Sany&background=00C6A2&color=fff&size=256`;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Profile Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <img 
              src={authorImage} 
              alt={authorName}
              className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-lg object-cover"
            />
            <div className="text-center md:text-left mt-2">
              <h1 className="text-3xl font-extrabold text-gray-900">{authorName}</h1>
              <p className="text-gray-500 mt-2 max-w-2xl">
                Welcome to my profile! Here you can find all the premium services and gigs I offer.
              </p>
              <div className="mt-4 flex gap-4 justify-center md:justify-start">
                <div className="bg-green-50 text-green-700 px-4 py-2 rounded-lg font-bold text-sm">
                  {gigs.length} Active Gigs
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User's Gigs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">My Services</h2>
        
        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading services...</div>
        ) : (
          <ServiceGrid gigs={gigs} />
        )}
      </div>
    </div>
  );
}
