import re

# 1. Update ContactSellerButton.js to accept custom className and custom text
with open("src/components/ContactSellerButton.js", "r") as f:
    csb = f.read()

csb = csb.replace("export default function ContactSellerButton({ authorId, authorName, gigTitle, gigId }) {", "export default function ContactSellerButton({ authorId, authorName, gigTitle, gigId, className, buttonText }) {")

old_btn = """    <button 
      onClick={handleContact}
      disabled={loading}
      className="mt-4 w-full bg-white dark:bg-gray-900 border-2 border-[#00C6A2] text-[#00C6A2] hover:bg-[#00C6A2] hover:text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
    >
      <MessageSquare size={20} />
      {loading ? "Connecting..." : "Message Seller"}
    </button>"""

new_btn = """    <button 
      onClick={handleContact}
      disabled={loading}
      className={className || "mt-4 w-full bg-white dark:bg-gray-900 border-2 border-[#00C6A2] text-[#00C6A2] hover:bg-[#00C6A2] hover:text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"}
    >
      {!className && <MessageSquare size={20} />}
      {loading ? "Connecting..." : (buttonText || "Message Seller")}
    </button>"""

csb = csb.replace(old_btn, new_btn)

with open("src/components/ContactSellerButton.js", "w") as f:
    f.write(csb)


# 2. Update PricingCard.js to use ContactSellerButton
with open("src/components/PricingCard.js", "r") as f:
    pc = f.read()

# Add import if missing
if "ContactSellerButton" not in pc:
    pc = pc.replace('import { Check } from "lucide-react";', 'import { Check } from "lucide-react";\nimport ContactSellerButton from "./ContactSellerButton";')

old_contact_btn_pattern = r'<button\s+onClick=\{async \(\) => \{.*?Contact Me\s+</button>'
new_contact_btn = """<ContactSellerButton 
          authorId={gig.authorId} 
          authorName={gig.authorName} 
          gigTitle={gig.title}
          gigId={gig.id}
          buttonText="Contact Me"
          className="w-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-gray-700 font-bold py-3.5 px-4 rounded-xl transition-all text-center"
        />"""

pc = re.sub(old_contact_btn_pattern, new_contact_btn, pc, flags=re.DOTALL)

with open("src/components/PricingCard.js", "w") as f:
    f.write(pc)

