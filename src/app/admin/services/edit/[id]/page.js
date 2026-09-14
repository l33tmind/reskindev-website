
"use client";

import { useEffect, useState, use } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2, Video, Star, Image as ImageIcon, Play, Tag } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

const extractYouTubeId = (url) => {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/i);
  return match ? match[1] : null;
};

export default function EditService({ params }) {
  const resolvedParams = params instanceof Promise ? use(params) : params;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newFeatureName, setNewFeatureName] = useState("");
  const [activeTab, setActiveTab] = useState(0);

  const [service, setService] = useState({
    title: "",
    description: "",
    imageUrl: "",
    youtubeUrls: [""],
    galleryUnlockPrice: 0,
    deliveryCost: 0,
    galleryCoupons: [],
    category: "Service",
    masterFeatures: [],
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
          if (data.youtubeUrl && (!data.youtubeUrls || data.youtubeUrls.length === 0)) {
            data.youtubeUrls = [data.youtubeUrl];
          } else if (!data.youtubeUrls) {
            data.youtubeUrls = [""];
          }
          if (!data.packages || data.packages.length === 0) {
            data.packages = [
              { name: "Basic", price: 0, description: "", deliveryDays: 3, featureChecks: [] },
              { name: "Standard", price: 0, description: "", deliveryDays: 5, featureChecks: [] },
              { name: "Premium", price: 0, description: "", deliveryDays: 7, featureChecks: [] }
            ];
          }
          if (!data.masterFeatures) data.masterFeatures = [];
          
          setService({ ...service, ...data });
        }
      } catch (error) {
        console.error("Error fetching service:", error);
      }
      setLoading(false);
    }
    fetchService();
  }, [resolvedParams.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setService(prev => ({ ...prev, [name]: value }));
  };

  const handleYoutubeChange = (index, value) => {
    setService(prev => {
      const newUrls = [...(prev.youtubeUrls || [])];
      newUrls[index] = value;
      return { ...prev, youtubeUrls: newUrls };
    });
  };
  const addYoutubeUrl = () => {
    setService(prev => ({ ...prev, youtubeUrls: [...(prev.youtubeUrls || []), ""] }));
  };
  const removeYoutubeUrl = (index) => {
    setService(prev => {
      const newUrls = (prev.youtubeUrls || []).filter((_, i) => i !== index);
      return { ...prev, youtubeUrls: newUrls.length ? newUrls : [""] };
    });
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

  const toggleFeatureCheck = (pkgIndex, featureIndex) => {
    const newPackages = [...service.packages];
    const currentVal = newPackages[pkgIndex].featureChecks[featureIndex] || false;
    newPackages[pkgIndex].featureChecks[featureIndex] = !currentVal;
    setService(prev => ({ ...prev, packages: newPackages }));
  };

  const handleAddFeature = () => {
    if (!newFeatureName.trim()) return;
    setService(prev => {
      const updatedFeatures = [...prev.masterFeatures, newFeatureName.trim()];
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
      const updatedFeatures = prev.masterFeatures.filter((_, i) => i !== index);
      const updatedPackages = prev.packages.map(pkg => {
        const newChecks = [...(pkg.featureChecks || [])];
        newChecks.splice(index, 1);
        return { ...pkg, featureChecks: newChecks };
      });
      return { ...prev, masterFeatures: updatedFeatures, packages: updatedPackages };
    });
  };

  const { user, dbUser } = useAuth();

  const handleSave = async () => {
    setSaving(true);
    try {
      const isNew = resolvedParams.id === "new";
      const savePayload = { ...service };
      
      if (isNew && user) {
        savePayload.authorId = user.uid;
        savePayload.authorName = user.displayName || "Unknown Seller";
        savePayload.authorImage = user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`;
        savePayload.status = dbUser?.role === "admin" ? "active" : "pending";
        savePayload.createdAt = new Date();
      }
      
      savePayload.updatedAt = new Date();

      if (isNew) {
        const newId = Date.now().toString();
        await setDoc(doc(db, "services", newId), savePayload);
        toast.success(dbUser?.role === "admin" ? "Service created!" : "Service submitted for approval!");
        router.push(dbUser?.role === "admin" ? "/admin/services" : "/freelancer");
      } else {
        await setDoc(doc(db, "services", resolvedParams.id), savePayload, { merge: true });
        toast.success("Service updated successfully!");
      }
    } catch (error) {
      console.error("Error saving:", error);
      toast.error("Failed to save service.");
    }
    setSaving(false);
  };

  if (loading) return <div className="p-10 text-center text-gray-500 dark:text-gray-400">Loading service details...</div>;

  return (
    <div className="max-w-4xl mx-auto pb-20 bg-gray-50 dark:bg-gray-950 min-h-screen">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 sticky top-0 z-20 px-8 py-4 flex items-center justify-between shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Edit Gig Details</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Modify service price, preview media, and description text</p>
        </div>
        <div className="flex gap-4">
          <button onClick={() => router.push("/admin/services")} className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-bold text-sm flex items-center transition-colors">
            <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
          </button>
          <button onClick={handleSave} disabled={saving} className="px-6 py-2 bg-[#00C6A2] hover:bg-[#00b08f] text-white rounded-lg font-bold text-sm transition-colors">
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="p-8 space-y-8">
        
        {/* Basic Info */}
        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Basic Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Gig Title</label>
              <input type="text" name="title" value={service.title} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:border-gray-900" placeholder="I will do..." />
            </div>
          </div>
        </div>

        {/* Video / Image Gallery */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Video / Image Gallery</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Upload video to YouTube as <strong>"Unlisted"</strong> and paste the link here. Thumbnails will auto-generate.</p>
            </div>
            <button onClick={addYoutubeUrl} className="bg-[#1C2C26] hover:bg-[#2A4038] text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors">
              <Plus size={16} /> Add Video / Image
            </button>
          </div>
          
          <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-950/50 rounded-b-2xl">
            {(service.youtubeUrls || []).map((url, idx) => {
              const ytId = extractYouTubeId(url);
              const previewImage = ytId ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg` : url;
              
              return (
                <div key={idx} className="bg-white dark:bg-gray-900 border border-red-200 rounded-xl p-4 shadow-sm relative overflow-hidden">
                  <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0 mt-1">
                      {idx + 1}
                    </div>
                    <div className="flex-1 space-y-4">
                      {/* Input Row */}
                      <div className="flex items-center gap-3">
                        <div className="flex-1 relative">
                          <Video size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-500" />
                          <input 
                            type="text" 
                            value={url} 
                            onChange={(e) => handleYoutubeChange(idx, e.target.value)} 
                            className="w-full pl-10 pr-24 border border-gray-300 rounded-lg p-2.5 outline-none focus:border-gray-900 text-sm" 
                            placeholder="https://www.youtube.com/watch?v=..." 
                          />
                          {ytId && (
                            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-red-50 text-red-600 text-[10px] font-bold px-2 py-1 rounded">
                              YouTube
                            </div>
                          )}
                        </div>
                        <button onClick={() => removeYoutubeUrl(idx)} className="text-red-500 hover:text-red-700 p-2 shrink-0">
                          <Trash2 size={18} />
                        </button>
                      </div>
                      
                      {/* Upload Image Alternative Button (Mock) */}
                      {!ytId && (
                        <div className="flex items-center text-xs font-bold text-gray-700 dark:text-gray-300 cursor-pointer hover:text-black">
                          <ImageIcon size={14} className="mr-2" /> Upload Image
                        </div>
                      )}

                      {/* Large Thumbnail Preview */}
                      {previewImage && (
                        <div className="w-full aspect-[21/9] bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden relative border border-gray-200 group">
                          <img src={previewImage} alt={`Preview ${idx+1}`} className="w-full h-full object-cover" />
                          {ytId && (
                            <div className="absolute inset-0 bg-black/10 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                              <div className="w-12 h-12 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center shadow-lg">
                                <Play size={20} className="text-black fill-black ml-1" />
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Premium Gallery Configuration */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-2">
            <div className="bg-black text-white p-1 rounded-full"><Star size={12} className="fill-white" /></div>
            Premium Gallery Configuration
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
            Set an unlock price to lock the gallery items (except the first one). Users must pay or use a valid coupon code to view them. Set price to 0 to make the gallery free.
          </p>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-xs font-bold text-gray-900 dark:text-white mb-2">Unlock Price ($)</label>
              <input type="number" name="galleryUnlockPrice" value={service.galleryUnlockPrice} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-gray-900 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-900 dark:text-white mb-2">Delivery Cost ($)</label>
              <input type="number" name="deliveryCost" value={service.deliveryCost} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-gray-900 text-sm" />
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-bold text-gray-900 dark:text-white mb-2">Unlock Coupon Codes</label>
            <button className="border border-gray-300 hover:bg-gray-50 dark:bg-gray-950 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-full font-bold text-xs flex items-center gap-2 transition-colors">
              <Tag size={14} /> Add Coupon Code
            </button>
          </div>
        </div>
        
                {/* Packages Configuration (Tabbed) */}
        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Pricing Packages</h2>
            {service.packages.length < 3 && (
              <button 
                onClick={() => {
                  const availableNames = ["Basic", "Standard", "Premium"];
                  const currentNames = service.packages.map(p => p.name);
                  const nextName = availableNames.find(n => !currentNames.includes(n)) || `Package ${service.packages.length + 1}`;
                  setService(prev => ({
                    ...prev,
                    packages: [...prev.packages, { name: nextName, price: 0, description: "", deliveryDays: 3, featureChecks: prev.masterFeatures?.map(()=>false) || [] }]
                  }));
                  setActiveTab(service.packages.length);
                }}
                className="px-4 py-1.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 font-bold text-sm rounded-lg hover:bg-green-200 transition-colors shrink-0"
              >
                + Add Package
              </button>
            )}
          </div>

          {/* Tabs */}
          <div className="flex w-full border-b border-gray-200 dark:border-gray-800 mb-6 relative">
            {service.packages.map((pkg, idx) => (
              <div 
                key={idx} 
                className={`flex-1 text-center py-3 font-bold text-sm sm:text-base cursor-pointer border-b-2 transition-colors relative group ${
                  activeTab === idx 
                    ? (pkg.name === 'Basic' ? 'border-slate-700 text-slate-700 dark:text-white' : pkg.name === 'Standard' ? 'border-[#00C6A2] text-[#00C6A2]' : 'border-amber-500 text-amber-500') 
                    : 'border-transparent text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                }`}
                onClick={() => setActiveTab(idx)}
              >
                {pkg.name}
                {service.packages.length > 1 && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setService(prev => {
                        const newPackages = [...prev.packages];
                        newPackages.splice(idx, 1);
                        return { ...prev, packages: newPackages };
                      });
                      if (activeTab >= idx && activeTab > 0) setActiveTab(activeTab - 1);
                    }}
                    className="absolute top-1/2 -translate-y-1/2 right-2 bg-red-100 hover:bg-red-500 text-red-500 hover:text-white p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-all z-10"
                    title="Delete Package"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Active Tab Content */}
          {service.packages[activeTab] && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Price ($)</label>
                  <input type="number" value={service.packages[activeTab].price} onChange={(e) => handlePackageChange(activeTab, "price", e.target.value)} className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:border-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Delivery Days</label>
                  <input type="number" value={service.packages[activeTab].deliveryDays} onChange={(e) => handlePackageChange(activeTab, "deliveryDays", e.target.value)} className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:border-gray-900" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Short Description</label>
                <textarea value={service.packages[activeTab].description} onChange={(e) => handlePackageChange(activeTab, "description", e.target.value)} rows="2" className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:border-gray-900 text-sm" placeholder="Briefly describe what is included..." />
              </div>

              {/* Package Specific Checklist */}
              <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Features Checklist</h3>
                </div>
                
                {service.masterFeatures.length === 0 ? (
                  <div className="text-center p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                    <p className="text-gray-500 text-sm">No features added yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {service.masterFeatures.map((feat, fIndex) => {
                      const isChecked = service.packages[activeTab].featureChecks?.[fIndex] || false;
                      return (
                        <div key={fIndex} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                          <span className="text-sm text-gray-700 dark:text-gray-300 font-medium truncate pr-4">{feat}</span>
                          <button 
                            onClick={() => {
                              setService(prev => {
                                const newPackages = [...prev.packages];
                                const pkg = { ...newPackages[activeTab] };
                                const checks = [...(pkg.featureChecks || [])];
                                checks[fIndex] = !checks[fIndex];
                                pkg.featureChecks = checks;
                                newPackages[activeTab] = pkg;
                                return { ...prev, packages: newPackages };
                              });
                            }}
                            className={`w-10 h-6 flex items-center shrink-0 rounded-full p-1 cursor-pointer transition-colors ${isChecked ? 'bg-[#00C6A2]' : 'bg-gray-300 dark:bg-gray-600'}`}
                          >
                            <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${isChecked ? 'translate-x-4' : 'translate-x-0'}`} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Global Features Manager */}
        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Global Features List</h2>
          <p className="text-sm text-gray-500 mb-6">Add features here, then switch between package tabs above to turn them ON or OFF.</p>
          
          <div className="flex gap-2 mb-4">
            <input 
              type="text" 
              value={newFeatureName} 
              onChange={(e) => setNewFeatureName(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
              className="flex-1 border border-gray-300 rounded-xl p-3 outline-none focus:border-gray-900 text-sm" 
              placeholder="e.g. Source Code, App Icon..." 
            />
            <button 
              onClick={handleAddFeature}
              className="px-6 py-3 bg-[#00C6A2] hover:bg-[#00b08f] text-white font-bold rounded-xl text-sm transition-colors shrink-0"
            >
              Add
            </button>
          </div>
          
          <div className="space-y-2">
            {service.masterFeatures.map((feat, fIndex) => (
              <div key={fIndex} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl group border border-transparent hover:border-gray-200 transition-colors">
                <span className="text-sm text-gray-700 dark:text-gray-300">{feat}</span>
                <button 
                  onClick={() => handleRemoveFeature(fIndex)}
                  className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-50 rounded"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

<div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Description (HTML Supported)</h2>
          <textarea 
            name="description" 
            value={service.description} 
            onChange={handleChange} 
            rows="10" 
            className="w-full border border-gray-300 rounded-xl p-4 font-mono text-sm outline-none focus:border-gray-900 bg-gray-50 dark:bg-gray-950" 
            placeholder="<!DOCTYPE html>..." 
          />
        </div>
        
      </div>
    </div>
  );
}
