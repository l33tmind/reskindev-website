import re

with open("src/app/freelancer/orders/page.js", "r") as f:
    content = f.read()

# 1. Add Navbar and Package icon import
import_search = r'import \{ ArrowLeft, Clock, CheckCircle2, PlayCircle, Star, Package, X \} from "lucide-react";'
import_replace = """import { ArrowLeft, Clock, CheckCircle2, PlayCircle, Star, Package, X, Inbox } from "lucide-react";
import Navbar from "@/components/Navbar";"""
content = re.sub(import_search, import_replace, content)

# 2. Add Navbar and background to return statement
return_search = r'  return \(\n    <div className="max-w-6xl mx-auto p-8 relative">'
return_replace = """  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans">
      <Navbar />
      <div className="max-w-7xl mx-auto p-4 md:p-8 relative">"""
content = re.sub(return_search, return_replace, content)

# Close the newly added div at the very end of the file.
# The original ended with `    </div>\n  );\n}`
# We need to add one more `    </div>\n`
content = content.replace("    </div>\n  );\n}", "      </div>\n    </div>\n  );\n}")

# 3. Enhance the Empty State
empty_search = r"""\{orders\.filter\(o => \{
              if \(activeTab === 'all'\) return true;
              if \(activeTab === 'active'\) return o\.status === 'pending' \|\| o\.status === 'processing';
              if \(activeTab === 'delivered'\) return o\.status === 'delivered';
              if \(activeTab === 'completed'\) return o\.status === 'completed';
              if \(activeTab === 'cancelled'\) return o\.status === 'cancelled';
              return true;
            \}\)\.length === 0 && \(\n              <tr><td colSpan="5" className="p-8 text-center text-gray-500">No orders yet\.</td></tr>\n            \)\}"""

empty_replace = """{orders.filter(o => {
              if (activeTab === 'all') return true;
              if (activeTab === 'active') return o.status === 'pending' || o.status === 'processing';
              if (activeTab === 'delivered') return o.status === 'delivered';
              if (activeTab === 'completed') return o.status === 'completed';
              if (activeTab === 'cancelled') return o.status === 'cancelled';
              return true;
            }).length === 0 && (
              <tr>
                <td colSpan="5" className="p-16">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
                      <Inbox size={48} className="text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Orders Found</h3>
                    <p className="text-gray-500 max-w-sm mx-auto">You don't have any orders in this category yet. Keep optimizing your gigs to attract more clients!</p>
                  </div>
                </td>
              </tr>
            )}"""
content = re.sub(empty_search, empty_replace, content)

# 4. Enhance the Table Header styling
thead_search = r'<thead className="bg-gray-50 dark:bg-gray-950 border-b border-gray-100 text-gray-500 font-bold uppercase tracking-wider text-\[10px\]">'
thead_replace = """<thead className="bg-gray-100/50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider text-xs">"""
content = re.sub(thead_search, head_replace := thead_replace, content)

# 5. Make tabs look bigger and more premium
tab_search = r'<div className="flex gap-2 mb-6 overflow-x-auto hide-scrollbar pb-2">'
tab_replace = """<div className="flex gap-3 mb-8 overflow-x-auto hide-scrollbar pb-2">"""
content = re.sub(tab_search, tab_replace, content)

tab_button_search = r'className=\{\`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all whitespace-nowrap \$\{activeTab === tab \? \'bg-\[\#00C6A2\] text-white shadow-md\' : \'bg-white dark:bg-gray-900 text-gray-500 border border-gray-200 dark:border-white/10 hover:border-\[\#00C6A2\]\'\}\`\}'
tab_button_replace = """className={`px-6 py-2.5 rounded-full text-sm font-bold tracking-wide uppercase transition-all whitespace-nowrap ${activeTab === tab ? 'bg-[#00C6A2] text-white shadow-lg shadow-[#00C6A2]/20' : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/10 hover:border-[#00C6A2] hover:text-[#00C6A2]'}`}"""
content = re.sub(tab_button_search, tab_button_replace, content)

with open("src/app/freelancer/orders/page.js", "w") as f:
    f.write(content)

print("Updated Freelancer Orders UI")

