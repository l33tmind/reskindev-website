import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Navbar from "@/components/Navbar";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const q = query(collection(db, "pages"), where("slug", "==", slug));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const pageData = querySnapshot.docs[0].data();
      return {
        title: `${pageData.title} | Reskindev`,
        description: pageData.title,
      };
    }
  } catch (error) {
    console.error(error);
  }
  return { title: "Page Not Found" };
}

export default async function DynamicPage({ params }) {
  const { slug } = await params;
  
  // Exclude some common Next.js static files from triggering DB calls unnecessarily
  if (["favicon.ico", "robots.txt", "sitemap.xml"].includes(slug)) {
    return notFound();
  }

  let pageData = null;

  try {
    const q = query(collection(db, "pages"), where("slug", "==", slug));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      pageData = querySnapshot.docs[0].data();
    }
  } catch (error) {
    console.error("Error fetching dynamic page:", error);
  }

  if (!pageData) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
        <div className="bg-white p-8 md:p-12 rounded-2xl border border-gray-200 shadow-sm">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-8 pb-4 border-b border-gray-100 font-outfit">
            {pageData.title}
          </h1>
          
          <div 
            className="prose max-w-none text-gray-700 leading-relaxed" 
            dangerouslySetInnerHTML={{ __html: pageData.content }} 
          />
        </div>
      </div>
    </div>
  );
}
