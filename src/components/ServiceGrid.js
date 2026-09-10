"use client";

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ServiceGrid({ gigs }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Mobile Apps", "Web Dev", "Marketing", "UI/UX", "Others"];

  const filteredGigs = gigs.filter((gig) => {
    const matchSearch = gig.title?.toLowerCase().includes(search.toLowerCase());
    
    let matchCategory = selectedCategory === "All";
    if (!matchCategory) {
      const q = selectedCategory.toLowerCase();
      const title = gig.title?.toLowerCase() || "";
      const cat = gig.category?.toLowerCase() || "";
      
      if (q === "mobile apps") matchCategory = title.includes("app") || cat.includes("app");
      else if (q === "web dev") matchCategory = title.includes("web") || cat.includes("web");
      else if (q === "marketing") matchCategory = title.includes("market") || title.includes("seo") || title.includes("promo");
      else if (q === "ui/ux") matchCategory = title.includes("ui") || title.includes("design");
      else matchCategory = cat === q;
    }
    
    return matchSearch && matchCategory;
  });

  const extractYouTubeId = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
    return match ? match[1] : null;
  };

  return (
    <>
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-10 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search services..." 
            className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 bg-white dark:bg-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00C6A2] focus:border-transparent text-gray-700 dark:text-gray-300"
          />
        </div>

        <div className="flex overflow-x-auto gap-2 w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-bold transition-colors border ${
                selectedCategory === cat 
                  ? "bg-gray-900 text-white border-gray-900" 
                  : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 hover:bg-gray-50 dark:bg-gray-950"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      
      {/* Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredGigs.map(gig => {
          const ytId = extractYouTubeId(gig.youtubeUrl);
          const coverImage = ytId 
            ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg` 
            : gig.imageUrl;
          
          const startingPrice = gig.packages && gig.packages.length > 0 
            ? gig.packages[0].price 
            : 0;

          return (
            <Link key={gig.id} href={`/gig/${gig.id}/${gig.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}>
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer h-full flex flex-col group">
                <div className="w-full h-48 relative overflow-hidden bg-gray-100 dark:bg-gray-800">
                  {coverImage ? (
                    <img src={coverImage} alt={gig.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                  )}
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
                    <span className="text-[12px] font-bold text-gray-700 dark:text-gray-300 hover:text-[#00C6A2]">
                      {gig.authorName || "MD Robius Sany"}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-[15px] leading-snug line-clamp-2 flex-1 group-hover:text-[#00C6A2] transition-colors">
                    {gig.title}
                  </h3>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="text-xs text-gray-500 dark:text-gray-400">Starting at</div>
                    <div className="font-black text-xl text-gray-900 dark:text-white">
                      ${startingPrice}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
        
        {filteredGigs.length === 0 && (
          <div className="col-span-full py-20 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 border border-gray-200 rounded-2xl">
            No services found matching your criteria.
          </div>
        )}
      </div>
    </>
  );
}
