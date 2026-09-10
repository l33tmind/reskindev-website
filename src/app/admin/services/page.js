"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Trash2, Edit2, Plus } from "lucide-react";
import Link from "next/link";

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchServices() {
      try {
        const querySnapshot = await getDocs(collection(db, "services"));
        const fetchedServices = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setServices(fetchedServices);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
      setLoading(false);
    }
    fetchServices();
  }, []);

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this service?")) {
      try {
        await deleteDoc(doc(db, "services", id));
        setServices(services.filter(s => s.id !== id));
      } catch (e) {
        alert("Error deleting service");
      }
    }
  };

  if (loading) return <div>Loading services...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Manage Services</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Drag and drop to reorder. Add, edit, or remove services.</p>
        </div>
        <Link href="/admin/services/edit/new">
          <button className="bg-[#00C6A2] hover:bg-[#00b08f] text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-md flex items-center gap-2 transition-colors">
            <Plus size={18} /> Add Service
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map(service => {
          const ytMatch = service.youtubeUrl ? service.youtubeUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i) : null;
          const ytId = ytMatch ? ytMatch[1] : null;
          const coverImage = ytId 
            ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg` 
            : service.imageUrl;
          
          const basePrice = service.packages && service.packages.length > 0 
            ? service.packages[0].price 
            : 0;
          const pkgCount = service.packages ? service.packages.length : 0;

          return (
            <div key={service.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group">
              <div className="w-full h-44 relative bg-gray-100 dark:bg-gray-800">
                {coverImage ? (
                  <img src={coverImage} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                )}
              </div>
              <div className="p-5 flex flex-col flex-1">
                <div className="flex justify-between items-start gap-4 mb-2">
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-snug line-clamp-2">{service.title}</h3>
                  <span className="text-[9px] font-bold tracking-wider text-green-700 bg-green-50 uppercase px-2 py-1 rounded-sm border border-green-200">
                    PUBLISHED
                  </span>
                </div>
                
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
                  ${basePrice} Base Price • {pkgCount} Packages
                </p>
                
                <div className="mt-auto flex items-center gap-3">
                  <Link href={`/admin/services/edit/${service.id}`} className="flex-1">
                    <button className="w-full bg-white dark:bg-gray-900 hover:bg-gray-50 dark:bg-gray-950 text-[#00C6A2] border border-[#00C6A2] font-bold py-2 rounded-full text-xs transition-colors flex items-center justify-center gap-2">
                      <Edit2 size={14} /> Edit
                    </button>
                  </Link>
                  <button 
                    onClick={() => handleDelete(service.id)}
                    className="w-10 h-10 border border-red-200 text-red-500 hover:bg-red-50 rounded-full flex items-center justify-center transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
