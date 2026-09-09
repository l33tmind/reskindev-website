with open('src/app/order/[gigId]/[pkg]/page.js', 'r') as f:
    content = f.read()

content = content.replace('import { ArrowLeft, CheckCircle2 } from "lucide-react";', 'import { ArrowLeft, CheckCircle2 } from "lucide-react";\nimport toast from "react-hot-toast";')

content = content.replace('      alert("Please Sign In first to place an order.");', '      toast.error("Please Sign In first to place an order.");')
content = content.replace('      alert("Please provide order requirements.");', '      toast.error("Please provide order requirements.");')
content = content.replace('      alert("Failed to place order. Try again.");', '      toast.error("Failed to place order. Try again.");')

with open('src/app/order/[gigId]/[pkg]/page.js', 'w') as f:
    f.write(content)
