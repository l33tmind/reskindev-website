import re

with open("src/app/[slug]/page.js", "r") as f:
    content = f.read()

# Replace generateMetadata
meta_search = r'export async function generateMetadata\(\{ params \}\) \{.*?\n  return \{ title: "Page Not Found" \};\n\}'
meta_replace = """export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const isExplicitProfile = slug.startsWith('%40') || slug.startsWith('@');
    const rawSlug = isExplicitProfile ? decodeURIComponent(slug).substring(1) : decodeURIComponent(slug);
    
    // First check pages
    if (!isExplicitProfile) {
      const qPage = query(collection(db, "pages"), where("slug", "==", rawSlug));
      const pageSnap = await getDocs(qPage);
      if (!pageSnap.empty) {
        const pageData = pageSnap.docs[0].data();
        return {
          title: `${pageData.title} | Reskindev`,
          description: pageData.title,
        };
      }
    }
    
    // Then check users
    const qUser = query(collection(db, "users"), where("username", "==", rawSlug));
    const userSnap = await getDocs(qUser);
    if (!userSnap.empty) {
      const user = userSnap.docs[0].data();
      return {
        title: `${user.displayName || rawSlug} | Profile on Reskindev`,
        description: `Check out ${user.displayName || rawSlug}'s profile and premium services on Reskindev.`
      };
    }
  } catch (error) {
    console.error(error);
  }
  return { title: "Page Not Found" };
}"""
content = re.sub(meta_search, meta_replace, content, flags=re.DOTALL)

# Replace DynamicPage
page_search = r'export default async function DynamicPage\(\{ params \}\) \{.*'
page_replace = """export default async function DynamicPage({ params }) {
  const { slug } = await params;
  
  if (["favicon.ico", "robots.txt", "sitemap.xml"].includes(slug)) {
    return notFound();
  }

  const isExplicitProfile = slug.startsWith('%40') || slug.startsWith('@');
  const rawSlug = isExplicitProfile ? decodeURIComponent(slug).substring(1) : decodeURIComponent(slug);
  
  let pageData = null;
  
  // 1. Check if it's a page (only if no @ prefix)
  if (!isExplicitProfile) {
    try {
      const q = query(collection(db, "pages"), where("slug", "==", rawSlug));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        pageData = querySnapshot.docs[0].data();
      }
    } catch (error) {
      console.error("Error fetching dynamic page:", error);
    }
  }

  // If it's a page, render the page
  if (pageData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
          <div className="bg-white dark:bg-gray-900 p-8 md:p-12 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8 pb-4 border-b border-gray-100 dark:border-white/10 font-outfit">
              {pageData.title}
            </h1>
            <div 
              className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed" 
              dangerouslySetInnerHTML={{ __html: pageData.content }} 
            />
          </div>
        </div>
      </div>
    );
  }

  // 2. Not a page, check if it's a user profile
  let userProfile = null;
  let userGigs = [];
  
  try {
    const q = query(collection(db, "users"), where("username", "==", rawSlug));
    const snap = await getDocs(q);
    if (!snap.empty) {
      userProfile = snap.docs[0].data();
      const gigsQuery = query(collection(db, "services"), where("authorId", "==", userProfile.uid));
      const gigsSnap = await getDocs(gigsQuery);
      userGigs = gigsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    }
  } catch (e) {
    console.error(e);
  }
  
  if (!userProfile) return notFound();
  
  const authorName = userProfile.displayName || rawSlug;
  const authorImage = userProfile.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=00C6A2&color=fff&size=256`;
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20">
      <Navbar />
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <img src={authorImage} alt={authorName} className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-lg object-cover" />
            <div className="text-center md:text-left mt-2">
              <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">{authorName}</h1>
              <p className="text-[#00C6A2] font-bold text-sm mb-2">@{rawSlug}</p>
              <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-2xl">
                Welcome to my profile! Here you can find all the premium services and gigs I offer.
              </p>
              <div className="mt-4 flex gap-4 justify-center md:justify-start">
                <div className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-4 py-2 rounded-lg font-bold text-sm">
                  {userGigs.length} Active Gigs
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">My Services</h2>
        {userGigs.length === 0 ? (
          <div className="text-gray-500 dark:text-gray-400 text-center py-20">This user hasn't published any gigs yet.</div>
        ) : (
          <ServiceGrid gigs={userGigs} />
        )}
      </div>
    </div>
  );
}
"""
content = re.sub(page_search, page_replace, content, flags=re.DOTALL)

with open("src/app/[slug]/page.js", "w") as f:
    f.write(content)

