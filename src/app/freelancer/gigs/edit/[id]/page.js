"use client";

import { useEffect, useState, use } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { ArrowLeft, Video, Save, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";

import dynamic from 'next/dynamic';





export default function FreelancerEditGig({ params }) {
  const resolvedParams = params instanceof Promise ? use(params) : params;
  const router = useRouter();
  const { user, dbUser, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [newFeatureName, setNewFeatureName] = useState("");

  const toggleFeatureCheck = (pkgIndex, featureIndex) => {
    const newPackages = [...service.packages];
    if (!newPackages[pkgIndex].featureChecks) newPackages[pkgIndex].featureChecks = [];
    const currentVal = newPackages[pkgIndex].featureChecks[featureIndex] || false;
    newPackages[pkgIndex].featureChecks[featureIndex] = !currentVal;
    setService(prev => ({ ...prev, packages: newPackages }));
  };

  const handleAddFeature = () => {
    if (!newFeatureName.trim()) return;
    setService(prev => {
      const updatedFeatures = [...(prev.masterFeatures || []), newFeatureName.trim()];
      const updatedPackages = prev.packages.map(pkg => ({
        ...pkg,
        featureChecks: [...(pkg.featureChecks || []), false]
      }));
      return { ...prev, masterFeatures: updatedFeatures, packages: updatedPackages };
    });
    setNewFeatureName("");
  };

  const removeMasterFeature = (index) => {
    setService(prev => {
      const updatedFeatures = (prev.masterFeatures || []).filter((_, i) => i !== index);
      const updatedPackages = prev.packages.map(pkg => {
        const newChecks = [...(pkg.featureChecks || [])];
        newChecks.splice(index, 1);
        return { ...pkg, featureChecks: newChecks };
      });
      return { ...prev, masterFeatures: updatedFeatures, packages: updatedPackages };
    });
  };


  const [service, setService] = useState({
    title: "",
    description: "",
    category: "Service",
    youtubeUrl: "",
    videoConsent: false,
    packages: [
      { name: "Basic", price: 0, description: "", deliveryDays: 3, featureChecks: [] },
      { name: "Standard", price: 0, description: "", deliveryDays: 5, featureChecks: [] },
      { name: "Premium", price: 0, description: "", deliveryDays: 7, featureChecks: [] }
    ]
  });

  useEffect(() => {
    async function fetchService() {
      if (resolvedParams.id === "new") {
        setLoading(false);
        return;
      }
      try {
        const docRef = doc(db, "services", resolvedParams.id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          
          if (!data.packages || data.packages.length === 0) {
            data.packages = [
              { name: "Basic", price: 0, description: "", deliveryDays: 3, featureChecks: [] },
              { name: "Standard", price: 0, description: "", deliveryDays: 5, featureChecks: [] },
              { name: "Premium", price: 0, description: "", deliveryDays: 7, featureChecks: [] }
            ];
          }
          
          // Only pull fields freelancers can edit
          setService({
            title: data.title || "",
            description: data.description || "",
            category: data.category || "Service",
            youtubeUrl: data.youtubeUrls?.[0] || data.youtubeUrl || "",
            videoConsent: data.videoConsent || false,
            packages: data.packages,
            // Retain uneditable fields behind the scenes
            imageUrl: data.imageUrl || "",
            youtubeUrls: data.youtubeUrls || [],
            masterFeatures: data.masterFeatures || [],
            galleryUnlockPrice: data.galleryUnlockPrice || 0,
            deliveryCost: data.deliveryCost || 0,
            status: data.status || "pending"
          });
        }
      } catch (error) {
        console.error("Error fetching gig:", error);
      }
      setLoading(false);
    }
    
    if (!authLoading && user) {
      fetchService();
    }
  }, [resolvedParams.id, user, authLoading]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setService(prev => ({ ...prev, [name]: value }));
  };

  const handlePackageChange = (index, field, value) => {
    const newPackages = [...service.packages];
    if (field === "price" || field === "deliveryDays") {
      newPackages[index][field] = Number(value);
    } else {
      newPackages[index][field] = value;
    }
    setService(prev => ({ ...prev, packages: newPackages }));
  };

  const handleSave = async () => {
    if (!service.title.trim()) {
      toast.error("Title is required!");
      return;
    }
    
    if (service.youtubeUrl && !service.videoConsent) {
      toast.error("Please accept the Video Copyright Declaration to proceed.");
      return;
    }
    
    setSaving(true);
    try {
      const isNew = resolvedParams.id === "new";
      
      const savePayload = { 
        ...service,
        status: "pending", // Always set to pending on create/update for admin approval
        youtubeUrls: service.youtubeUrl ? [service.youtubeUrl] : [],
        videoConsent: service.videoConsent || false,
        videoConsentTimestamp: (service.youtubeUrl && service.videoConsent) ? new Date() : null,
        updatedAt: new Date()
      };
      
      // Remove any undefined fields from the state spread
      Object.keys(savePayload).forEach(key => savePayload[key] === undefined && delete savePayload[key]);
      
      if (isNew && user) {
        savePayload.authorId = user.uid;
        savePayload.authorName = user.displayName || "Seller";
        savePayload.authorImage = user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`;
        savePayload.status = "pending"; // Freelancers always submit as pending
        savePayload.createdAt = new Date();
      }

      if (isNew) {
        const newId = Date.now().toString();
        await setDoc(doc(db, "services", newId), savePayload);
        toast.success("Gig submitted for approval!");
        router.push("/freelancer");
      } else {
        await setDoc(doc(db, "services", resolvedParams.id), savePayload, { merge: true });
        toast.success("Gig updated successfully!");
      }
    } catch (error) {
      console.error("Error saving gig:", error);
      toast.error("Failed to save gig.");
    }
    setSaving(false);
  };

  if (authLoading || loading) return <div className="p-20 text-center text-gray-500">Loading gig details...</div>;

  


  if (dbUser?.role !== "freelancer") {
    return <div className="p-20 text-center text-red-500 font-bold">Access Denied. Only sellers can edit gigs.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 mt-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">
              {resolvedParams.id === "new" ? "Create a New Gig" : "Edit Your Gig"}
            </h1>
            <p className="text-gray-500 text-sm">Update your plain text description, YouTube video, and package pricing.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => router.push("/freelancer")} className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-bold text-sm flex items-center transition-colors">
              <ArrowLeft size={16} className="mr-2" /> Cancel
            </button>
            <button onClick={handleSave} disabled={saving || (service.youtubeUrl && !service.videoConsent)} className="px-6 py-2 bg-[#00C6A2] hover:bg-[#00b08f] disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-xl font-bold text-sm flex items-center gap-2 transition-colors">
              <Save size={16} /> {saving ? "Saving..." : "Save Gig"}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          
          {/* Basic Info */}
          <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Gig Title</label>
              <input type="text" name="title" value={service.title} onChange={handleChange} className="w-full border border-gray-300 dark:border-white/10 bg-transparent rounded-xl p-3 outline-none focus:border-[#00C6A2] text-gray-900 dark:text-white" placeholder="I will do..." />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Category</label>
              <select name="category" value={service.category} onChange={handleChange} className="w-full border border-gray-300 dark:border-white/10 bg-transparent rounded-xl p-3 outline-none focus:border-[#00C6A2] text-gray-900 dark:text-white">
                <option value="Service">Service</option>
                <option value="Design">Design</option>
                <option value="Development">Development</option>
                <option value="Writing">Writing</option>
                <option value="Video & Animation">Video & Animation</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">YouTube Video Link</label>
              <p className="text-xs text-gray-500 mb-2">Upload your video to your YouTube channel as <strong>"Unlisted"</strong> and paste the link here to use it as your gig portfolio.</p>
              <div className="relative mb-3">
                <Video size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-500" />
                <input 
                  type="text" 
                  name="youtubeUrl" 
                  value={service.youtubeUrl} 
                  onChange={handleChange} 
                  className="w-full pl-10 border border-gray-300 dark:border-white/10 bg-transparent rounded-xl p-3 outline-none focus:border-[#00C6A2] text-gray-900 dark:text-white" 
                  placeholder="https://www.youtube.com/watch?v=..." 
                />
              </div>
              
              {service.youtubeUrl && (
                <div className="flex items-start gap-3 bg-gray-50 dark:bg-gray-950/50 p-4 rounded-xl border border-gray-200 dark:border-white/10 mt-3 transition-all animate-in fade-in zoom-in-95 duration-300">
                  <input 
                    type="checkbox" 
                    id="videoConsent"
                    checked={service.videoConsent}
                    onChange={(e) => setService(prev => ({ ...prev, videoConsent: e.target.checked }))}
                    className="mt-0.5 w-4 h-4 text-[#00C6A2] rounded border-gray-300 focus:ring-[#00C6A2] cursor-pointer shrink-0"
                  />
                  <label htmlFor="videoConsent" className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed cursor-pointer select-none">
                    <strong>Mandatory UGC & Copyright Declaration:</strong> I confirm this video is uploaded as <strong>"Unlisted"</strong> on YouTube. I acknowledge that I am submitting User-Generated Content (UGC) and warrant that I own all intellectual property rights to this video. I agree not to submit any copyrighted, objectionable, or abusive material. I grant Reskindev permission to embed this video and assume full legal liability for its content.
                  </label>
                </div>
              )}
            </div>
            
            
            <div className="bg-white dark:bg-gray-900 rounded-2xl">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Gig Description</label>
              <p className="text-xs text-gray-500 mb-4">Write a clear and simple description of what you offer (formatting allowed).</p>
              
              <textarea 
                value={service.description} 
                onChange={(e) => setService(prev => ({ ...prev, description: e.target.value }))} 
                className="w-full border border-gray-300 dark:border-white/10 bg-transparent rounded-xl p-4 outline-none focus:border-[#00C6A2] text-gray-900 dark:text-white min-h-[250px] resize-y"
                placeholder="Describe your gig in detail..."
              />
            </div>

          </div>

          {/* Packages */}
          <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Gig Packages & Pricing</h2>
              {service.packages.length < 3 && (
                <button 
                  onClick={() => {
                    const availableNames = ["Basic", "Standard", "Premium"];
                    const currentNames = service.packages.map(p => p.name);
                    const nextName = availableNames.find(n => !currentNames.includes(n)) || `Package ${service.packages.length + 1}`;
                    setService(prev => ({
                      ...prev,
                      packages: [...prev.packages, { name: nextName, price: 0, description: "", deliveryDays: 3, featureChecks: [] }]
                    }));
                  }}
                  className="px-4 py-1.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 font-bold text-sm rounded-lg hover:bg-green-200 transition-colors"
                >
                  + Add Package
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {service.packages.map((pkg, pIndex) => (
                <div key={pIndex} className="border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden flex flex-col relative group">
                  {service.packages.length > 1 && (
                    <button 
                      onClick={() => {
                        setService(prev => {
                          const newPackages = [...prev.packages];
                          newPackages.splice(pIndex, 1);
                          return { ...prev, packages: newPackages };
                        });
                      }}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
                      title="Delete Package"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                    </button>
                  )}
                  <div className={`p-4 text-center font-black text-lg text-white ${
                    pkg.name === 'Basic' ? 'bg-slate-700' : pkg.name === 'Standard' ? 'bg-[#00C6A2]' : 'bg-amber-500'
                  }`}>
                    {pkg.name}
                  </div>
                  <div className="p-5 space-y-4 flex-1 bg-gray-50 dark:bg-gray-950/50">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Price ($)</label>
                      <input type="number" value={pkg.price} onChange={(e) => handlePackageChange(pIndex, "price", e.target.value)} className="w-full border border-gray-300 dark:border-white/10 bg-white dark:bg-gray-900 rounded-lg p-2.5 outline-none focus:border-[#00C6A2]" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Delivery Days</label>
                      <input type="number" value={pkg.deliveryDays} onChange={(e) => handlePackageChange(pIndex, "deliveryDays", e.target.value)} className="w-full border border-gray-300 dark:border-white/10 bg-white dark:bg-gray-900 rounded-lg p-2.5 outline-none focus:border-[#00C6A2]" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Short Description</label>
                      <textarea value={pkg.description} onChange={(e) => handlePackageChange(pIndex, "description", e.target.value)} rows="3" className="w-full border border-gray-300 dark:border-white/10 bg-white dark:bg-gray-900 rounded-lg p-2.5 outline-none focus:border-[#00C6A2] text-sm" />
                    </div>
                  </div>
                </div>
              ))}
            </div>


        {/* Checklist Inclusion Matrix */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-white/10">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Checklist Inclusion Matrix</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-[10px] font-black uppercase text-gray-500 dark:text-gray-400 tracking-wider border-b border-gray-100 dark:border-white/10">
                <tr>
                  <th className="p-4 w-1/2">Feature Description</th>
                  {service.packages.map((pkg, i) => (
                    <th key={i} className={`p-4 text-center ${
                      pkg.name === 'Basic' ? 'text-slate-700 dark:text-slate-400' : pkg.name === 'Standard' ? 'text-[#00C6A2]' : 'text-amber-500'
                    }`}>{pkg.name}</th>
                  ))}
                  <th className="p-4 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {(service.masterFeatures || []).map((feat, fIndex) => (
                  <tr key={fIndex} className="hover:bg-gray-50 dark:bg-gray-950 transition-colors">
                    <td className="p-4 text-sm text-gray-700 dark:text-gray-300">{feat}</td>
                    {service.packages.map((pkg, pIndex) => {
                      const isChecked = pkg.featureChecks?.[fIndex] || false;
                      return (
                        <td key={pIndex} className="p-4 text-center">
                          <button 
                            onClick={() => toggleFeatureCheck(pIndex, fIndex)}
                            className={`w-5 h-5 mx-auto rounded flex items-center justify-center transition-colors border-2 ${
                              isChecked ? 'bg-[#00C6A2] border-[#00C6A2]' : 'bg-white dark:bg-gray-900 border-gray-400'
                            }`}
                          >
                            {isChecked && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                          </button>
                        </td>
                      );
                    })}
                    <td className="p-4 text-center">
                      <button onClick={() => removeMasterFeature(fIndex)} className="text-gray-400 hover:text-red-500">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-4 border-t border-gray-100 dark:border-white/10 flex gap-4 bg-gray-50 dark:bg-gray-950">
            <input 
              type="text" 
              value={newFeatureName}
              onChange={(e) => setNewFeatureName(e.target.value)}
              placeholder="Add new feature..." 
              className="flex-1 border border-gray-300 dark:border-white/10 bg-transparent rounded-lg p-2.5 outline-none focus:border-[#00C6A2] text-sm text-gray-900 dark:text-white"
              onKeyDown={(e) => e.key === 'Enter' && handleAddFeature()}
            />
            <button onClick={handleAddFeature} className="bg-black hover:bg-gray-800 text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-colors">
              Add
            </button>
          </div>
        </div>

          </div>
          
        </div>
      </div>
    </div>
  );
}
