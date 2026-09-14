import re

with open("src/app/admin/services/page.js", "r") as f:
    content = f.read()

# 1. Add toast import and dnd state
import_search = r'import \{ Trash2, Edit2, Plus, CheckCircle \} from "lucide-react";\nimport Link from "next/link";'
import_replace = """import { Trash2, Edit2, Plus, CheckCircle, GripVertical } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";"""
content = re.sub(import_search, import_replace, content)

state_search = r'const \[loading, setLoading\] = useState\(true\);'
state_replace = """const [loading, setLoading] = useState(true);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);"""
content = re.sub(state_search, state_replace, content)

# 2. Add sorting to fetched services
fetch_search = r'const fetchedServices = querySnapshot\.docs\.map\(doc => \(\{ id: doc\.id, \.\.\.doc\.data\(\) \}\)\);'
fetch_replace = """const fetchedServices = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a,b) => (a.order || 0) - (b.order || 0));"""
content = re.sub(fetch_search, fetch_replace, content)

# 3. Add drag and drop handlers
dnd_logic = """  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragEnter = (index) => {
    setDragOverIndex(index);
  };

  const handleDragEnd = async () => {
    if (draggedIndex === null || dragOverIndex === null || draggedIndex === dragOverIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newServices = [...services];
    const [draggedItem] = newServices.splice(draggedIndex, 1);
    newServices.splice(dragOverIndex, 0, draggedItem);

    // Update state immediately for snappy UI
    const updatedServices = newServices.map((service, index) => ({
      ...service,
      order: index
    }));
    setServices(updatedServices);
    setDraggedIndex(null);
    setDragOverIndex(null);

    // Persist to Firestore
    try {
      const batchPromises = updatedServices.map((service) => 
        updateDoc(doc(db, "services", service.id), { order: service.order })
      );
      await Promise.all(batchPromises);
      toast.success("Services reordered successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save new order.");
    }
  };

  if (loading) return <div>Loading services...</div>;"""

loading_search = r'if \(loading\) return <div>Loading services\.\.\.</div>;'
content = re.sub(loading_search, dnd_logic, content)

# 4. Modify the card wrapping div to support drag and drop
card_search = r'\{services\.map\(service => \{'
card_replace = """{services.map((service, index) => {"""
content = re.sub(card_search, card_replace, content)

div_search = r'<div key=\{service\.id\} className=\{\`bg-white dark:bg-gray-900 rounded-2xl border \$\{service\.status === \'pending\' \? \'border-orange-300 shadow-orange-100\' : \'border-gray-200\'\} overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group\`\}>'
div_replace = """<div 
              key={service.id} 
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragEnter={() => handleDragEnter(index)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => e.preventDefault()}
              className={`bg-white dark:bg-gray-900 rounded-2xl border ${service.status === 'pending' ? 'border-orange-300 shadow-orange-100' : 'border-gray-200 dark:border-white/10'} overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group cursor-grab active:cursor-grabbing ${draggedIndex === index ? 'opacity-50 scale-95' : ''} ${dragOverIndex === index && draggedIndex !== index ? 'border-[#00C6A2] border-2 shadow-lg shadow-[#00C6A2]/20 transform -translate-y-1' : ''}`}
            >
              <div className="absolute top-2 right-2 z-10 bg-black/40 backdrop-blur-sm text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical size={16} />
              </div>"""
content = re.sub(div_search, div_replace, content)

# Add relative to the div wrapper
# Wait, actually the div wrapper is what I just replaced. Let me add `relative` to its classes just in case it doesn't have it.
content = content.replace("flex flex-col group cursor-grab", "relative flex flex-col group cursor-grab")


with open("src/app/admin/services/page.js", "w") as f:
    f.write(content)

