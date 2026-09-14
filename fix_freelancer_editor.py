import re

with open("src/app/freelancer/gigs/edit/[id]/page.js", "r") as f:
    content = f.read()

# 1. Add dynamic import and Quill CSS
import_statements = """
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
"""
content = content.replace('import Navbar from "@/components/Navbar";', 'import Navbar from "@/components/Navbar";\n' + import_statements)

# 2. Import Trash2 icon
content = content.replace('import { ArrowLeft, Video, Save } from "lucide-react";', 'import { ArrowLeft, Video, Save, Trash2 } from "lucide-react";')

# 3. Add state and handlers
handlers_code = """
  const [newFeatureName, setNewFeatureName] = useState("");

  const toggleFeatureCheck = (pkgIndex, featureIndex) => {
    const newPackages = [...service.packages];
    if (!newPackages[pkgIndex].featureChecks) newPackages[pkgIndex].featureChecks = [];
    const currentVal = newPackages[pkgIndex].featureChecks[featureIndex] || false;
    newPackages[pkgIndex].featureChecks[featureIndex] = !currentVal;
    setService(prev => ({ ...prev, packages: newPackages }));
  };

  const handleAddFeature = () => {
    if (!newFeatureName.trim()) return;
    setService(prev => {
      const updatedFeatures = [...(prev.masterFeatures || []), newFeatureName.trim()];
      const updatedPackages = prev.packages.map(pkg => ({
        ...pkg,
        featureChecks: [...(pkg.featureChecks || []), false]
      }));
      return { ...prev, masterFeatures: updatedFeatures, packages: updatedPackages };
    });
    setNewFeatureName("");
  };

  const removeMasterFeature = (index) => {
    setService(prev => {
      const updatedFeatures = (prev.masterFeatures || []).filter((_, i) => i !== index);
      const updatedPackages = prev.packages.map(pkg => {
        const newChecks = [...(pkg.featureChecks || [])];
        newChecks.splice(index, 1);
        return { ...pkg, featureChecks: newChecks };
      });
      return { ...prev, masterFeatures: updatedFeatures, packages: updatedPackages };
    });
  };
"""

content = content.replace('  const [saving, setSaving] = useState(false);', '  const [saving, setSaving] = useState(false);\n' + handlers_code)

# 4. Replace Plain Text Description with React Quill
quill_ui = """
            <div className="bg-white dark:bg-gray-900 rounded-2xl">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Gig Description</label>
              <p className="text-xs text-gray-500 mb-4">Write a clear and simple description of what you offer (formatting allowed).</p>
              <div className="quill-wrapper">
                <ReactQuill 
                  theme="snow" 
                  value={service.description} 
                  onChange={(val) => setService(prev => ({ ...prev, description: val }))} 
                  className="bg-white text-gray-900 rounded-lg min-h-[200px]"
                />
              </div>
              <style jsx global>{`
                .quill-wrapper .ql-container { min-height: 200px; font-family: inherit; font-size: 14px; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;}
                .quill-wrapper .ql-toolbar { border-top-left-radius: 8px; border-top-right-radius: 8px; }
              `}</style>
            </div>
"""

# Find the old textarea block and replace it
# We'll use a regex to capture it. It looks like:
#             <div>
#               <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Plain Text Description</label>
#               <p className="text-xs text-gray-500 mb-2">Write a clear and simple description of what you offer.</p>
#               <textarea ... />
#             </div>
old_textarea_pattern = r'<div>\s*<label[^>]*>Plain Text Description</label>.*?</div>'
content = re.sub(old_textarea_pattern, quill_ui, content, flags=re.DOTALL)

# 5. Add Checklist Inclusion Matrix just before the "</div>" closing the "space-y-6" wrapping packages
matrix_ui = """
        {/* Checklist Inclusion Matrix */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-white/10">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Checklist Inclusion Matrix</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-[10px] font-black uppercase text-gray-500 dark:text-gray-400 tracking-wider border-b border-gray-100 dark:border-white/10">
                <tr>
                  <th className="p-4 w-1/2">Feature Description</th>
                  {service.packages.map((pkg, i) => (
                    <th key={i} className={`p-4 text-center ${
                      pkg.name === 'Basic' ? 'text-slate-700 dark:text-slate-400' : pkg.name === 'Standard' ? 'text-[#00C6A2]' : 'text-amber-500'
                    }`}>{pkg.name}</th>
                  ))}
                  <th className="p-4 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {(service.masterFeatures || []).map((feat, fIndex) => (
                  <tr key={fIndex} className="hover:bg-gray-50 dark:bg-gray-950 transition-colors">
                    <td className="p-4 text-sm text-gray-700 dark:text-gray-300">{feat}</td>
                    {service.packages.map((pkg, pIndex) => {
                      const isChecked = pkg.featureChecks?.[fIndex] || false;
                      return (
                        <td key={pIndex} className="p-4 text-center">
                          <button 
                            onClick={() => toggleFeatureCheck(pIndex, fIndex)}
                            className={`w-5 h-5 mx-auto rounded flex items-center justify-center transition-colors border-2 ${
                              isChecked ? 'bg-[#00C6A2] border-[#00C6A2]' : 'bg-white dark:bg-gray-900 border-gray-400'
                            }`}
                          >
                            {isChecked && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                          </button>
                        </td>
                      );
                    })}
                    <td className="p-4 text-center">
                      <button onClick={() => removeMasterFeature(fIndex)} className="text-gray-400 hover:text-red-500">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-4 border-t border-gray-100 dark:border-white/10 flex gap-4 bg-gray-50 dark:bg-gray-950">
            <input 
              type="text" 
              value={newFeatureName}
              onChange={(e) => setNewFeatureName(e.target.value)}
              placeholder="Add new feature..." 
              className="flex-1 border border-gray-300 dark:border-white/10 bg-transparent rounded-lg p-2.5 outline-none focus:border-[#00C6A2] text-sm text-gray-900 dark:text-white"
              onKeyDown={(e) => e.key === 'Enter' && handleAddFeature()}
            />
            <button onClick={handleAddFeature} className="bg-black hover:bg-gray-800 text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-colors">
              Add
            </button>
          </div>
        </div>
"""

# Insert the checklist matrix after the pricing packages block
# Find:               ))}
#            </div>
packages_block_end = r"              \)\)}\n            </div>"
content = re.sub(packages_block_end, "              ))}\n            </div>\n\n" + matrix_ui, content, count=1)

with open("src/app/freelancer/gigs/edit/[id]/page.js", "w") as f:
    f.write(content)

