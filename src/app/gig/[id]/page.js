import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import PricingCard from "@/components/PricingCard";
import { ArrowLeft, Heart, MessageCircle } from "lucide-react";
import ShareButton from "@/components/ShareButton";
import SaveButton from "@/components/SaveButton";
import VideoGallery from "@/components/VideoGallery";
import GigReviews from "@/components/GigReviews";
import PremiumGallery from "@/components/PremiumGallery";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const docSnap = await getDoc(doc(db, "services", id));
    if (docSnap.exists()) {
      const gig = docSnap.data();
      const title = gig.title || "Reskindev Service";
      let description = gig.description || "Professional app development services.";
      description = description.replace(/<[^>]*>?/gm, '').substring(0, 160);
      let imageUrl = "https://reskindev.com/icons/Icon-512.png";
      
      const videoUrls = gig.youtubeUrls?.length > 0 ? gig.youtubeUrls : (gig.youtubeUrl ? [gig.youtubeUrl] : []);
      if (videoUrls.length > 0) {
        const match = videoUrls[0].match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
        if (match && match[1]) {
          imageUrl = `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg`;
        }
      } else if (gig.imageUrl) {
        imageUrl = gig.imageUrl;
      }
      
      return {
        title: `${title} | Reskindev`,
        description,
        openGraph: { title, description, images: [{ url: imageUrl }] },
        twitter: { card: "summary_large_image", title, description, images: [imageUrl] },
      };
    }
  } catch (error) { console.error("Error fetching gig meta:", error); }
  return { title: "Service Not Found - Reskindev" };
}

export default async function GigDetail({ params }) {
  const { id } = await params;
  const docRef = doc(db, "services", id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500 dark:text-gray-400">Service not found.</div>;
  }

  let gig = docSnap.data();
  // Sanitize Firestore timestamps so they can be passed to Client Components safely
  if (gig.createdAt && typeof gig.createdAt.toDate === 'function') {
    gig.createdAt = gig.createdAt.toDate().toISOString();
  }
  if (gig.updatedAt && typeof gig.updatedAt.toDate === 'function') {
    gig.updatedAt = gig.updatedAt.toDate().toISOString();
  }
  // Remove any remaining complex objects (like array unions if they act up, though usually fine)
  gig = JSON.parse(JSON.stringify(gig));
  const pkg = gig.basicPackage || {};
  
  const videoUrls = gig.youtubeUrls?.length > 0 ? gig.youtubeUrls : (gig.youtubeUrl ? [gig.youtubeUrl] : []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 bg-white dark:bg-gray-900 rounded-full border border-gray-200 hover:bg-gray-50 dark:bg-gray-950 transition-colors shadow-sm">
              <ArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
            </Link>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white leading-tight">
              {gig.title}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <ShareButton />
            <SaveButton gigId={id} />
          </div>
        </div>
        
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">Review gig features, previews, and select your custom package</p>
        
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left Column: Media & Description */}
          <div className="flex-1 w-full">
            {/* Media Player */}
            <VideoGallery youtubeUrls={videoUrls} imageUrl={gig.imageUrl} title={gig.title} />

            {/* Premium Gallery */}
            <PremiumGallery images={gig.galleryImages} unlockPrice={gig.galleryUnlockPrice} />

            {/* Service Description */}
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Service Description</h2>
            <div className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm">
              <div 
                className="prose max-w-none text-gray-700 dark:text-gray-300 leading-relaxed" 
                dangerouslySetInnerHTML={{ __html: gig.description }} 
              />
            </div>
            
            {/* Reviews */}
            <GigReviews gigId={id} />
          </div>

          {/* Right Column: Pricing Card & Contact */}
          <div className="w-full lg:w-[400px] sticky top-24">
            <PricingCard gig={gig} gigId={id} />
            
            <a 
              href={`https://wa.me/${gig.whatsappNumber?.replace(/[^0-9]/g, "") || ""}?text=Hi!%20I'm%20interested%20in%20your%20gig:%20${encodeURIComponent(gig.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 w-full bg-white dark:bg-gray-900 border-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <MessageCircle size={20} />
              Contact Seller Directly
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
