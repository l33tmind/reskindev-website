import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Search, Bell, Menu } from "lucide-react";
import ServiceGrid from "@/components/ServiceGrid";

export const revalidate = 60;

async function getSettings() {
  try {
    const docSnap = await getDoc(doc(db, "settings", "global"));
    if (docSnap.exists()) return docSnap.data();
  } catch (e) {
    console.error(e);
  }
  return {};
}

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
    });
  } catch (e) {
    console.error(e);
  }
  return [];
}

function extractYouTubeId(url) {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  return match ? match[1] : null;
}

export default async function Home() {
  const [settings, gigs] = await Promise.all([getSettings(), getGigs()]);
  
  const heroTitle = settings.hero_title || "Hire Freelancer";
  const heroDescription = settings.hero_description || "অ্যাপ ডেভেলপমেন্ট কিংবা স্টার্টআপ নিয়ে ভাবছেন? তাহলে আপনি সঠিক জায়গাতেই এসেছেন! আমাদের ওয়েবসাইট আপনার সুবিধার্থে বাংলা এবং ইংলিশ—দুই ভাষাতেই ভিডিও দেওয়া আছে।";
  const videoId = extractYouTubeId(settings.youtube_url || "https://youtu.be/FdmW6ZaYWyU");
  
  const featuredAppName = settings.featured_app_name || "USA VPN - USA ip address";
  const featuredAppDev = settings.featured_app_developer || "reskindev dot com";
  const featuredAppIcon = settings.featured_app_icon_url || "https://play-lh.googleusercontent.com/7U4A3soerqX7j0xPCOwYyMmTUYWfQ0gWyCMVY1IXh37Vi6cGm945SQHF0b8kkcP0N-6X6yw5fJVUNnyfwQUc";
  const featuredAppUrl = settings.featured_app_url || "#";

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20 relative">
      <Navbar />

      {/* Hero Section */}
      <div className="w-full bg-gradient-to-r from-[#0d2621] to-[#1b2b36] py-16 px-4 md:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10">
          
          {/* Left Text & App Banner */}
          <div className="flex-1 text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 font-outfit flex items-center gap-3">
              <span className="text-blue-500 text-4xl">🚀</span> {heroTitle}
            </h1>
            <p className="text-base md:text-lg text-white/90 max-w-xl leading-relaxed mb-10">
              {heroDescription}
            </p>
            
            {/* Featured App Card */}
            <div className="bg-white dark:bg-gray-900/10 backdrop-blur-md border border-white/20 rounded-xl p-4 max-w-md flex items-center gap-4">
              <img src={featuredAppIcon} alt={featuredAppName} className="w-12 h-12 rounded-lg shadow-md" />
              <div className="flex-1">
                <h3 className="text-white font-bold text-sm line-clamp-1">{featuredAppName}</h3>
                <p className="text-white/70 text-xs">Developer: {featuredAppDev}</p>
                <p className="text-white/70 text-xs">Free</p>
              </div>
              <a href={featuredAppUrl} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center bg-white dark:bg-gray-900/20 hover:bg-white dark:bg-gray-900/30 p-2 rounded-lg transition">
                <svg className="w-6 h-6 text-white mb-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                <span className="text-[10px] text-white font-semibold">Download</span>
              </a>
            </div>
          </div>

          {/* Right Video Player */}
          <div className="flex-1 w-full max-w-2xl">
            {videoId && (
              <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10">
                <iframe 
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`} 
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen 
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="py-12 px-4 md:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-2 font-outfit">Explore Services</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8 text-lg">Find the best services for your next project</p>
        
        <ServiceGrid gigs={gigs} />
      </div>

      {/* App Promo Footer Section */}
      <div className="w-full bg-white dark:bg-gray-900 border-t border-gray-200 mt-10 pt-16 pb-12 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-4">
            Manage Projects From Your iPhone
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            Download the official Reskindev iOS app. Track live project milestones, receive instant notifications, and chat directly with developers anytime.
          </p>
          <a href="https://apps.apple.com/us/app/reskindev/id6802118085" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 bg-black hover:bg-gray-900 border border-gray-800 text-white px-8 py-3.5 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.04 2.26-.7 3.59-.7 1.56.03 2.85.64 3.65 1.77-3.14 1.83-2.61 6.13.43 7.38-.72 1.58-1.58 2.82-2.75 3.72zm-4.32-13.8c-.1-1.63 1.25-3.09 2.82-3.25.26 1.76-1.39 3.23-2.82 3.25z"/></svg>
            <div className="flex flex-col text-left">
              <span className="text-[10px] uppercase font-semibold text-gray-300 -mb-1">Download on the</span>
              <span className="text-lg font-bold">App Store</span>
            </div>
          </a>
        </div>

        {/* Animated Screenshots Slider */}
        <div className="relative w-full overflow-hidden pb-10">
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes slideLeft {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .animate-slide-left {
              animation: slideLeft 30s linear infinite;
            }
            .hide-scrollbar::-webkit-scrollbar {
              display: none;
            }
            .hide-scrollbar {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `}} />
          <div className="flex w-[200%] animate-slide-left gap-6 px-6">
            
            {/* Group 1 (Original 4) */}
            <div className="flex gap-6 w-1/2 justify-around">
              <AppScreenshot title="Hire Professional Freelancer" type="list" />
              <AppScreenshot title="Transform your ideas" type="grid" />
              <AppScreenshot title="Hire a Pro Video Editor" type="detail" />
              <AppScreenshot title="Track Your Projects" type="orders" />
            </div>
            
            {/* Group 2 (Duplicate for infinite loop) */}
            <div className="flex gap-6 w-1/2 justify-around">
              <AppScreenshot title="Hire Professional Freelancer" type="list" />
              <AppScreenshot title="Transform your ideas" type="grid" />
              <AppScreenshot title="Hire a Pro Video Editor" type="detail" />
              <AppScreenshot title="Track Your Projects" type="orders" />
            </div>

          </div>
        </div>
      </div>

      {/* Floating WhatsApp Button (Placeholder) */}
      <a href="#" className="fixed bottom-6 right-6 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform z-50">
        <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.441-1.273.6-1.446c.153-.164.333-.205.444-.205.111 0 .222.001.318.005.103.004.241-.039.366.262.13.313.443 1.08.483 1.16.039.08.064.173.011.278-.053.105-.08.17-.16.257-.08.087-.168.192-.239.262-.083.083-.171.173-.075.339.096.166.427.705.918 1.144.636.567 1.157.738 1.325.823.168.084.267.068.365-.043.097-.11.423-.49.537-.659.113-.168.225-.14.375-.084.15.056.947.447 1.109.528.162.081.271.121.311.189.04.068.04.394-.104.799z"/></svg>
      </a>
    </main>
  );
}

// Mini Component for CSS-based App Screenshots matching the Apple App Store exactly
function AppScreenshot({ title, type }) {
  return (
    <div className="w-[260px] h-[520px] bg-[#00C6A2] rounded-3xl shrink-0 flex flex-col items-center pt-10 px-4 overflow-hidden relative shadow-md">
      <h3 className="text-white text-2xl font-bold text-center leading-tight mb-8 drop-shadow-sm px-2">
        {title.split(' ').map((word, i) => (i === 1 || i === 3 ? <span key={i}><br />{word} </span> : word + ' '))}
      </h3>
      
      {/* Phone Frame */}
      <div className="w-[230px] h-[480px] bg-gray-900 rounded-[2.5rem] border-[6px] border-gray-900 shadow-2xl relative overflow-hidden flex-shrink-0">
        <div className="absolute top-0 inset-x-0 h-5 flex justify-center z-20 mt-1">
          <div className="w-20 h-4 bg-black rounded-full"></div>
        </div>
        
        {/* Screen Content */}
        <div className="w-full h-full bg-white dark:bg-gray-900 pt-10 px-3 pb-4 flex flex-col">
          {type === 'list' && (
            <>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-[#00C6A2] rounded flex items-center justify-center text-white text-[10px] font-bold">R</div>
                <span className="font-bold text-xs">Reskindev</span>
              </div>
              <div className="bg-[#00C6A2]/10 rounded-xl p-3 mb-3 border border-[#00C6A2]/20">
                <span className="text-[8px] bg-[#00C6A2] text-white px-2 py-0.5 rounded uppercase font-bold">Premium Services</span>
                <h4 className="text-[10px] font-bold mt-2 mb-1">Hire Freelancer</h4>
                <p className="text-[7px] text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">Explore top tier freelance services for your custom mobile and web applications.</p>
                <div className="flex gap-2">
                  <div className="bg-[#00C6A2] text-white text-[7px] px-2 py-1 rounded">Explore Services</div>
                  <div className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-[7px] px-2 py-1 rounded">My Orders</div>
                </div>
              </div>
              <div className="flex gap-2 overflow-hidden mb-3">
                <div className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full text-[8px] whitespace-nowrap border border-gray-200">Mobile Apps</div>
                <div className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full text-[8px] whitespace-nowrap border border-gray-200">Web Dev</div>
              </div>
              <div className="flex-1 bg-gray-50 dark:bg-gray-950 rounded-t-xl border border-gray-100 p-2">
                <div className="w-full h-16 bg-gray-200 dark:bg-gray-700 rounded-lg mb-2"></div>
                <div className="w-3/4 h-2 bg-gray-300 rounded mb-1"></div>
                <div className="w-1/2 h-2 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </>
          )}
          
          {type === 'grid' && (
            <>
              <div className="flex items-center justify-between mb-3 px-1 border-b border-gray-100 pb-2">
                <span className="text-[10px] font-bold text-gray-400">{'<'}</span>
                <span className="text-[10px] font-bold text-gray-800 dark:text-gray-200">All Services</span>
                <span className="w-2 h-2 rounded-full bg-gray-200 dark:bg-gray-700"></span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[1,2,3,4].map(i => (
                  <div key={i} className="bg-gray-50 dark:bg-gray-950 rounded-lg overflow-hidden border border-gray-100 pb-2">
                    <div className="h-14 bg-gray-200 dark:bg-gray-700 mb-1 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400"></div>
                    </div>
                    <div className="w-full h-1.5 bg-gray-300 rounded mx-1 mb-1 max-w-[80%] mt-1"></div>
                    <div className="w-1/2 h-1.5 bg-[#00C6A2] rounded mx-1 mb-0.5"></div>
                  </div>
                ))}
              </div>
            </>
          )}

          {type === 'detail' && (
            <>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-bold text-gray-400">{'<'}</span>
              </div>
              <h4 className="text-[11px] font-black leading-tight mb-2">I will professionally edit your videos, youtube video editor</h4>
              <div className="w-full h-24 bg-gray-800 rounded-xl mb-3 relative overflow-hidden flex items-center justify-center">
                 <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-900/20 flex items-center justify-center backdrop-blur-sm">
                   <div className="w-0 h-0 border-t-4 border-l-6 border-b-4 border-transparent border-l-white ml-0.5"></div>
                 </div>
              </div>
              <div className="w-1/3 h-2 bg-[#00C6A2] rounded mb-2"></div>
              <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
              <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
              <div className="w-4/5 h-1 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
              <div className="flex gap-2">
                <div className="flex-1 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg"></div>
                <div className="flex-1 h-8 bg-gray-100 dark:bg-gray-800 border border-[#00C6A2] rounded-lg"></div>
                <div className="flex-1 h-8 bg-[#00C6A2] rounded-lg"></div>
              </div>
            </>
          )}

          {type === 'orders' && (
            <>
              <h4 className="text-[12px] font-black text-center mb-4 mt-2">My Orders</h4>
              <div className="flex gap-2 mb-4">
                <div className="flex-1 bg-gray-50 dark:bg-gray-950 border border-gray-100 rounded-xl p-2 text-center shadow-sm">
                  <div className="text-[7px] text-gray-500 dark:text-gray-400 font-bold mb-1 uppercase">In Progress</div>
                  <div className="text-lg font-black text-[#00C6A2]">0</div>
                </div>
                <div className="flex-1 bg-gray-50 dark:bg-gray-950 border border-gray-100 rounded-xl p-2 text-center shadow-sm">
                  <div className="text-[7px] text-gray-500 dark:text-gray-400 font-bold mb-1 uppercase">Pending</div>
                  <div className="text-lg font-black text-orange-500">1</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="border border-gray-100 rounded-lg p-2 shadow-sm relative">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-400 rounded-l-lg"></div>
                  <div className="ml-2">
                    <div className="flex justify-between items-center mb-1">
                      <div className="w-2/3 h-2 bg-gray-800 rounded"></div>
                      <div className="w-1/5 h-2 bg-[#00C6A2] rounded"></div>
                    </div>
                    <div className="w-1/2 h-1.5 bg-gray-400 rounded mb-2 mt-2"></div>
                    <div className="flex justify-between items-center">
                      <div className="bg-orange-50 text-orange-500 text-[6px] px-1.5 py-0.5 rounded font-bold uppercase">Pending</div>
                      <div className="text-[6px] text-gray-500 dark:text-gray-400 font-bold border px-1 py-0.5 rounded">Details</div>
                    </div>
                  </div>
                </div>
                
                <div className="border border-gray-100 rounded-lg p-2 shadow-sm relative opacity-60">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#00C6A2] rounded-l-lg"></div>
                  <div className="ml-2">
                    <div className="flex justify-between items-center mb-1">
                      <div className="w-2/3 h-2 bg-gray-800 rounded"></div>
                      <div className="w-1/5 h-2 bg-[#00C6A2] rounded"></div>
                    </div>
                    <div className="w-1/2 h-1.5 bg-gray-400 rounded mb-2 mt-2"></div>
                    <div className="flex justify-between items-center">
                      <div className="bg-green-50 text-[#00C6A2] text-[6px] px-1.5 py-0.5 rounded font-bold uppercase">Completed</div>
                      <div className="text-[6px] text-gray-500 dark:text-gray-400 font-bold border px-1 py-0.5 rounded">Details</div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
