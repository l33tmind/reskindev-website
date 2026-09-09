with open('src/components/ServiceGrid.js', 'r') as f:
    content = f.read()

# Add useRouter import
content = content.replace('import { Search } from "lucide-react";', 'import { Search } from "lucide-react";\nimport { useRouter } from "next/navigation";')

# Add router instance
content = content.replace('export default function ServiceGrid({ gigs }) {', 'export default function ServiceGrid({ gigs }) {\n  const router = useRouter();')

# Replace the profile row with a clickable one
profile_row = """                  <div className="flex items-center gap-2 mb-3">
                    <img 
                      src={gig.authorImage || "https://ui-avatars.com/api/?name=MD+Robius+Sany&background=00C6A2&color=fff"} 
                      alt={gig.authorName || "MD Robius Sany"} 
                      className="w-5 h-5 rounded-full object-cover"
                    />
                    <span className="text-[12px] font-bold text-gray-700">
                      {gig.authorName || "MD Robius Sany"}
                    </span>
                  </div>"""

new_profile_row = """                  <div 
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
                    <span className="text-[12px] font-bold text-gray-700 hover:text-[#00C6A2]">
                      {gig.authorName || "MD Robius Sany"}
                    </span>
                  </div>"""

content = content.replace(profile_row, new_profile_row)

with open('src/components/ServiceGrid.js', 'w') as f:
    f.write(content)
