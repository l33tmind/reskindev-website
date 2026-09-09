with open('src/app/gig/[id]/page.js', 'r') as f:
    content = f.read()

content = content.replace('import { ArrowLeft, Heart, MessageCircle } from "lucide-react";', 'import { ArrowLeft, Heart, MessageCircle, Share2 } from "lucide-react";\nimport toast from "react-hot-toast";')

share_button_html = """            <button 
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success("Link copied to clipboard!");
              }}
              className="p-2 bg-white rounded-full border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm text-gray-500 hover:text-[#00C6A2]"
              title="Share Service"
            >
              <Share2 size={20} />
            </button>
            <SaveButton gigId={id} />"""

content = content.replace('<SaveButton gigId={id} />', share_button_html)

with open('src/app/gig/[id]/page.js', 'w') as f:
    f.write(content)
