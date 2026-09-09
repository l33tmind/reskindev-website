with open('src/components/GigReviews.js', 'r') as f:
    content = f.read()

content = content.replace('import { Star } from "lucide-react";', 'import { Star } from "lucide-react";\nimport toast from "react-hot-toast";')

content = content.replace('if (!user) return alert("Please login to submit a review.");', 'if (!user) { toast.error("Please login to submit a review."); return; }')
content = content.replace('if (!comment.trim()) return alert("Please enter a comment.");', 'if (!comment.trim()) { toast.error("Please enter a comment."); return; }')

content = content.replace('      setRating(5);\n    } catch (error) {', '      setRating(5);\n      toast.success("Review submitted successfully!");\n    } catch (error) {')
content = content.replace('      alert("Failed to submit review.");', '      toast.error("Failed to submit review.");')

with open('src/components/GigReviews.js', 'w') as f:
    f.write(content)
