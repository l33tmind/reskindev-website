with open('src/components/PremiumGallery.js', 'r') as f:
    content = f.read()

content = content.replace('import { useAuth } from "@/context/AuthContext";', 'import { useAuth } from "@/context/AuthContext";\nimport toast from "react-hot-toast";')

content = content.replace('if (!user) return alert("Please sign in to unlock premium content.");', 'if (!user) { toast.error("Please sign in to unlock premium content."); return; }')

content = content.replace('      alert("Gallery Unlocked successfully!");', '      toast.success("Gallery Unlocked successfully!");')

with open('src/components/PremiumGallery.js', 'w') as f:
    f.write(content)
