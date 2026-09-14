"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock, Check, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

export default function PricingCard({ gig, gigId }) {
  const { user } = useAuth();
  const router = useRouter();
  
  const availablePackages = gig.packages || [];
  const packageNames = availablePackages.map(p => (p.name || "").toLowerCase());
  
  const [activeTab, setActiveTab] = useState(packageNames[0] || "basic");
  
  // Ensure activeTab is valid if packages change
  const currentTab = packageNames.includes(activeTab) ? activeTab : (packageNames[0] || "basic");
  const pkg = availablePackages.find(p => (p.name || "").toLowerCase() === currentTab) || availablePackages[0] || {};

  if (availablePackages.length === 0) {
    return <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200">No packages available.</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-gray-50 dark:bg-gray-950 text-sm font-semibold text-center">
        {packageNames.map((tab) => (
          <div 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-4 cursor-pointer capitalize ${
              currentTab === tab 
                ? "border-b-2 border-green-500 text-green-600 bg-white dark:bg-gray-900" 
                : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:bg-gray-800"
            }`}
          >
            {tab}
          </div>
        ))}
      </div>
      
      {/* Card Body */}
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white capitalize">{pkg.name}</h3>
          <span className="text-2xl font-black text-green-500">${pkg.price || 0}.00</span>
        </div>
        
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 leading-relaxed">
          {pkg.description || `${pkg.name} service package includes standard features.`}
        </p>
        
        <div className="flex items-center text-sm font-bold text-gray-700 dark:text-gray-300 mb-6">
          <Clock size={18} className="mr-2 text-gray-400" /> 
          {pkg.deliveryDays || 3} Days Delivery
        </div>
        
        {gig.masterFeatures && gig.masterFeatures.length > 0 && (
          <>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-4">What's Included:</h4>
            <ul className="space-y-3 mb-8">
              {gig.masterFeatures.map((feature, index) => {
                const isIncluded = pkg.featureChecks && pkg.featureChecks[index];
                return (
                  <li key={index} className={`flex items-center text-sm ${isIncluded ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 line-through'}`}>
                    {isIncluded ? (
                      <Check size={18} className="mr-3 text-green-500" />
                    ) : (
                      <X size={18} className="mr-3 text-gray-300" />
                    )}
                    {feature}
                  </li>
                );
              })}
            </ul>
          </>
        )}
        
        <Link href={`/order/${gigId}/${currentTab}`} className="block w-full mb-3">
          <button className="w-full bg-[#00C6A2] hover:bg-[#00B08F] text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-md hover:shadow-xl neon-glow text-center">
            Continue
          </button>
        </Link>
        <ContactSellerButton 
          authorId={gig.authorId} 
          authorName={gig.authorName} 
          gigTitle={gig.title}
          gigId={gig.id}
          buttonText="Contact Me"
          className="w-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-gray-700 font-bold py-3.5 px-4 rounded-xl transition-all text-center"
        />
      </div>
    </div>
  );
}
