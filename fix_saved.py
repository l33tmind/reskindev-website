with open('src/app/profile/saved/page.js', 'r') as f:
    content = f.read()

content = content.replace('import { Heart } from "lucide-react";', 'import { Heart } from "lucide-react";\nimport { useRouter } from "next/navigation";')
content = content.replace('export default function SavedServices() {', 'export default function SavedServices() {\n  const router = useRouter();')

profile_row = """                    <div className="flex items-center gap-2 mb-3">
                      <img 
                        src={gig.authorImage || "https://ui-avatars.com/api/?name=MD+Robius+Sany&background=00C6A2&color=fff"} 
                        alt={gig.authorName || "MD Robius Sany"} 
                        className="w-5 h-5 rounded-full object-cover"
                      />
                      <span className="text-[12px] font-bold text-gray-700">
                        {gig.authorName || "MD Robius Sany"}
                      </span>
                    </div>"""

new_profile_row = """                    <div 
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

with open('src/app/profile/saved/page.js', 'w') as f:
    f.write(content)
