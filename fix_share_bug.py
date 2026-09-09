with open('src/app/gig/[id]/page.js', 'r') as f:
    content = f.read()

# Remove the raw button and toast import
content = content.replace('import toast from "react-hot-toast";\n', '')
content = content.replace('Share2', 'ShareButton')
content = content.replace('import { ArrowLeft, Heart, MessageCircle, ShareButton } from "lucide-react";', 'import { ArrowLeft, Heart, MessageCircle } from "lucide-react";\nimport ShareButton from "@/components/ShareButton";')

# Replace the button markup
raw_button = """            <button 
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success("Link copied to clipboard!");
              }}
              className="p-2 bg-white rounded-full border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm text-gray-500 hover:text-[#00C6A2]"
              title="Share Service"
            >
              <Share2 size={20} />
            </button>"""

content = content.replace(raw_button, "<ShareButton />")

with open('src/app/gig/[id]/page.js', 'w') as f:
    f.write(content)
