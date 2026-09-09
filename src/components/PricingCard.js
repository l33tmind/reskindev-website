"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock, Check, X } from "lucide-react";

export default function PricingCard({ gig, gigId }) {
  const [activeTab, setActiveTab] = useState("basic");
  
  const activeTabName = activeTab === 'basic' ? 'Basic' : activeTab === 'standard' ? 'Standard' : 'Premium';
  
  const pkg = (gig.packages || []).find(p => p.name === activeTabName) || {};

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-gray-50 text-sm font-semibold text-center">
        {["basic", "standard", "premium"].map((tab) => (
          <div 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-4 cursor-pointer capitalize ${
              activeTab === tab 
                ? "border-b-2 border-green-500 text-green-600 bg-white" 
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            {tab}
          </div>
        ))}
      </div>
      
      {/* Card Body */}
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900 capitalize">{activeTab}</h3>
          <span className="text-2xl font-black text-green-500">${pkg.price || 0}.00</span>
        </div>
        
        <p className="text-gray-600 text-sm mb-6 leading-relaxed">
          {pkg.description || `${activeTab} service package includes standard features.`}
        </p>
        
        <div className="flex items-center text-sm font-bold text-gray-700 mb-6">
          <Clock size={18} className="mr-2 text-gray-400" /> 
          {pkg.deliveryDays || 3} Days Delivery
        </div>
        
        {gig.masterFeatures && gig.masterFeatures.length > 0 && (
          <>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-4">What's Included:</h4>
            <ul className="space-y-3 mb-8">
              {gig.masterFeatures.map((feature, index) => {
                const isIncluded = pkg.featureChecks && pkg.featureChecks[index];
                return (
                  <li key={index} className={`flex items-center text-sm ${isIncluded ? 'text-gray-700' : 'text-gray-400 line-through'}`}>
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
        
        <Link href={`/order/${gigId}/${activeTab}`} className="block w-full">
          <button className="w-full bg-[#00C6A2] hover:bg-[#00B08F] text-white font-bold py-3.5 px-4 rounded-xl transition-colors shadow-md text-center">
            Continue
          </button>
        </Link>
      </div>
    </div>
  );
}
