import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Navbar from "@/components/Navbar";
import ServiceGrid from "@/components/ServiceGrid";
import { Suspense } from "react";

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

async function getGigs() {
  try {
    const querySnapshot = await getDocs(collection(db, "services"));
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || null,
      };
    }).filter(gig => gig.status !== 'pending').sort((a, b) => (a.order || 0) - (b.order || 0));
  } catch (e) {
    console.error(e);
  }
  return [];
}

export default async function SearchPage() {
  const gigs = await getGigs();
  
  return (
    <div className="min-h-screen bg-[#F4F7F6] dark:bg-gray-950 font-sans selection:bg-[#00C6A2] selection:text-white">
      <Navbar />
      
      <div className="pt-32 pb-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="mb-10 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
              Explore All <span className="text-[#00C6A2]">Services</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl text-lg">
              Find the perfect service for your next project. Use the search bar or categories below to filter exactly what you need.
            </p>
          </div>
          
          <Suspense fallback={<div className="text-center py-20">Loading services...</div>}>
            <ServiceGrid gigs={gigs} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
