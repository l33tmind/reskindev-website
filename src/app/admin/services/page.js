"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Trash2, Edit2, Plus, CheckCircle, GripVertical } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  useEffect(() => {
    async function fetchServices() {
      try {
        const querySnapshot = await getDocs(collection(db, "services"));
        const fetchedServices = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a,b) => (a.order || 0) - (b.order || 0));
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

  const handleApprove = async (id) => {
    try {
      await updateDoc(doc(db, "services", id), { status: "active" });
      setServices(services.map(s => s.id === id ? { ...s, status: "active" } : s));
    } catch (e) {
      alert("Error approving service");
    }
  };

    const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragEnter = (index) => {
    setDragOverIndex(index);
  };

  const handleDragEnd = async () => {
    if (draggedIndex === null || dragOverIndex === null || draggedIndex === dragOverIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newServices = [...services];
    const [draggedItem] = newServices.splice(draggedIndex, 1);
    newServices.splice(dragOverIndex, 0, draggedItem);

    // Update state immediately for snappy UI
    const updatedServices = newServices.map((service, index) => ({
      ...service,
      order: index
    }));
    setServices(updatedServices);
    setDraggedIndex(null);
    setDragOverIndex(null);

    // Persist to Firestore
    try {
      const batchPromises = updatedServices.map((service) => 
        updateDoc(doc(db, "services", service.id), { order: service.order })
      );
      await Promise.all(batchPromises);
      toast.success("Services reordered successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save new order.");
    }
  };

  if (loading) return <div>Loading services...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Manage Services</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Review pending gigs or edit existing ones.</p>
        </div>
        <Link href="/admin/services/edit/new">
          <button className="bg-[#00C6A2] hover:bg-[#00b08f] text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-md flex items-center gap-2 transition-colors">
            <Plus size={18} /> Add Service
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, index) => {
          const ytMatch = service.youtubeUrl ? service.youtubeUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i) : null;
          const ytId = ytMatch ? ytMatch[1] : null;
          const coverImage = ytId 
            ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg` 
            : (service.youtubeUrls && service.youtubeUrls[0] && !service.youtubeUrls[0].includes("youtube.com") && !service.youtubeUrls[0].includes("youtu.be")) ? service.youtubeUrls[0] : service.imageUrl;
          
          const basePrice = service.packages && service.packages.length > 0 
            ? service.packages[0].price 
            : 0;
          const pkgCount = service.packages ? service.packages.length : 0;

          return (
            <div 
              key={service.id} 
              draggable={true}
              onDragStart={() => handleDragStart(index)}
              onDragEnter={() => handleDragEnter(index)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => e.preventDefault()}
              className={`bg-white dark:bg-gray-900 rounded-2xl border ${service.status === 'pending' ? 'border-orange-300 shadow-orange-100' : 'border-gray-200 dark:border-white/10'} overflow-hidden shadow-sm hover:shadow-md transition-all relative flex flex-col group cursor-grab active:cursor-grabbing ${draggedIndex === index ? 'opacity-50 scale-95' : ''} ${dragOverIndex === index && draggedIndex !== index ? 'border-[#00C6A2] border-2 shadow-lg shadow-[#00C6A2]/20 transform -translate-y-1' : ''}`}
            >
              <div className="absolute top-2 right-2 z-10 bg-black/40 backdrop-blur-sm text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical size={16} />
              </div>
              <div className="w-full h-44 relative bg-gray-100 dark:bg-gray-800">
                {coverImage ? (
                  <img src={coverImage} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                )}
                {service.authorName && (
                  <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded-full font-bold">
                    By: {service.authorName}
                  </div>
                )}
              </div>
              <div className="p-5 flex flex-col flex-1">
                <div className="flex justify-between items-start gap-4 mb-2">
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-snug line-clamp-2">{service.title}</h3>
                  <span className={`text-[9px] font-bold tracking-wider uppercase px-2 py-1 rounded-sm border ${service.status === 'pending' ? 'text-orange-700 bg-orange-50 border-orange-200' : 'text-green-700 bg-green-50 border-green-200'}`}>
                    {service.status === 'pending' ? 'PENDING' : 'ACTIVE'}
                  </span>
                </div>
                
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
                  ${basePrice} Base Price • {pkgCount} Packages
                </p>
                
                <div className="mt-auto flex items-center gap-3">
                  {service.status === 'pending' && (
                    <button onClick={() => handleApprove(service.id)} className="flex-1 bg-[#00C6A2] hover:bg-[#00b08f] text-white font-bold py-2 rounded-full text-xs transition-colors flex items-center justify-center gap-2">
                      <CheckCircle size={14} /> Approve
                    </button>
                  )}
                  <Link href={`/admin/services/edit/${service.id}`} className={service.status === 'pending' ? "flex-none" : "flex-1"}>
                    <button className="w-full bg-white dark:bg-gray-900 hover:bg-gray-50 dark:bg-gray-950 text-[#00C6A2] border border-[#00C6A2] font-bold py-2 px-3 rounded-full text-xs transition-colors flex items-center justify-center gap-2">
                      <Edit2 size={14} /> {service.status === 'pending' ? '' : 'Edit'}
                    </button>
                  </Link>
                  <button 
                    onClick={() => handleDelete(service.id)}
                    className="w-10 h-10 border border-red-200 text-red-500 hover:bg-red-50 rounded-full flex items-center justify-center shrink-0 transition-colors"
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
