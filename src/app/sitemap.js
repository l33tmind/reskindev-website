import { collection, getDocs, query, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default async function sitemap() {
  const baseUrl = "https://reskindev.com";

  // Get dynamic pages (terms, privacy, etc.)
  let pages = [];
  try {
    const pagesSnap = await getDocs(query(collection(db, "pages"), limit(100)));
    pages = pagesSnap.docs.map(doc => ({
      url: `${baseUrl}/${doc.data().slug}`,
      lastModified: new Date(),
    }));
  } catch (e) {
    console.error(e);
  }

  // Get dynamic gigs
  let gigs = [];
  try {
    const servicesSnap = await getDocs(query(collection(db, "services"), limit(500)));
    gigs = servicesSnap.docs.map(doc => {
      const gig = doc.data();
      const slug = gig.title ? gig.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : '';
      return {
        url: `${baseUrl}/gig/${doc.id}/${slug}`,
        lastModified: gig.updatedAt ? gig.updatedAt.toDate() : new Date(),
      };
    });
  } catch (e) {
    console.error(e);
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    ...pages,
    ...gigs,
  ];
}
