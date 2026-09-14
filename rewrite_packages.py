import re

with open('src/app/admin/services/edit/[id]/page.js', 'r') as f:
    content = f.read()

# Add state
content = content.replace(
    'const [newFeatureName, setNewFeatureName] = useState("");',
    'const [newFeatureName, setNewFeatureName] = useState("");\n  const [activeTab, setActiveTab] = useState(0);'
)

# Extract everything before "Packages Configuration"
start_idx = content.find('{/* Packages Configuration */}')

# Extract everything after the end of Checklist Inclusion Matrix
# Find the end of the Matrix div
end_marker = '{/* Service Description */}'
end_idx = content.find(end_marker)

if start_idx == -1 or end_idx == -1:
    # If end_marker doesn't exist, we just find the div that follows Matrix.
    # The next section might be "Description (HTML Supported)"
    end_idx = content.find('{/* Description */}')
    if end_idx == -1:
        end_idx = content.find('<div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 shadow-sm">\n          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Description')

print(f"Start: {start_idx}, End: {end_idx}")

new_packages_ui = """        {/* Packages Configuration (Tabbed) */}
        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Pricing Packages</h2>
            {service.packages.length < 3 && (
              <button 
                onClick={() => {
                  const availableNames = ["Basic", "Standard", "Premium"];
                  const currentNames = service.packages.map(p => p.name);
                  const nextName = availableNames.find(n => !currentNames.includes(n)) || `Package ${service.packages.length + 1}`;
                  setService(prev => ({
                    ...prev,
                    packages: [...prev.packages, { name: nextName, price: 0, description: "", deliveryDays: 3, featureChecks: prev.masterFeatures?.map(()=>false) || [] }]
                  }));
                  setActiveTab(service.packages.length);
                }}
                className="px-4 py-1.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 font-bold text-sm rounded-lg hover:bg-green-200 transition-colors shrink-0"
              >
                + Add Package
              </button>
            )}
          </div>

          {/* Tabs */}
          <div className="flex w-full border-b border-gray-200 dark:border-gray-800 mb-6 relative">
            {service.packages.map((pkg, idx) => (
              <div 
                key={idx} 
                className={`flex-1 text-center py-3 font-bold text-sm sm:text-base cursor-pointer border-b-2 transition-colors relative group ${
                  activeTab === idx 
                    ? (pkg.name === 'Basic' ? 'border-slate-700 text-slate-700 dark:text-white' : pkg.name === 'Standard' ? 'border-[#00C6A2] text-[#00C6A2]' : 'border-amber-500 text-amber-500') 
                    : 'border-transparent text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                }`}
                onClick={() => setActiveTab(idx)}
              >
                {pkg.name}
                {service.packages.length > 1 && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setService(prev => {
                        const newPackages = [...prev.packages];
                        newPackages.splice(idx, 1);
                        return { ...prev, packages: newPackages };
                      });
                      if (activeTab >= idx && activeTab > 0) setActiveTab(activeTab - 1);
                    }}
                    className="absolute top-1/2 -translate-y-1/2 right-2 bg-red-100 hover:bg-red-500 text-red-500 hover:text-white p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-all z-10"
                    title="Delete Package"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Active Tab Content */}
          {service.packages[activeTab] && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Price ($)</label>
                  <input type="number" value={service.packages[activeTab].price} onChange={(e) => handlePackageChange(activeTab, "price", e.target.value)} className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:border-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Delivery Days</label>
                  <input type="number" value={service.packages[activeTab].deliveryDays} onChange={(e) => handlePackageChange(activeTab, "deliveryDays", e.target.value)} className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:border-gray-900" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Short Description</label>
                <textarea value={service.packages[activeTab].description} onChange={(e) => handlePackageChange(activeTab, "description", e.target.value)} rows="2" className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:border-gray-900 text-sm" placeholder="Briefly describe what is included..." />
              </div>

              {/* Package Specific Checklist */}
              <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Features Checklist</h3>
                </div>
                
                {service.masterFeatures.length === 0 ? (
                  <div className="text-center p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                    <p className="text-gray-500 text-sm">No features added yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {service.masterFeatures.map((feat, fIndex) => {
                      const isChecked = service.packages[activeTab].featureChecks?.[fIndex] || false;
                      return (
                        <div key={fIndex} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                          <span className="text-sm text-gray-700 dark:text-gray-300 font-medium truncate pr-4">{feat}</span>
                          <button 
                            onClick={() => {
                              setService(prev => {
                                const newPackages = [...prev.packages];
                                const pkg = { ...newPackages[activeTab] };
                                const checks = [...(pkg.featureChecks || [])];
                                checks[fIndex] = !checks[fIndex];
                                pkg.featureChecks = checks;
                                newPackages[activeTab] = pkg;
                                return { ...prev, packages: newPackages };
                              });
                            }}
                            className={`w-10 h-6 flex items-center shrink-0 rounded-full p-1 cursor-pointer transition-colors ${isChecked ? 'bg-[#00C6A2]' : 'bg-gray-300 dark:bg-gray-600'}`}
                          >
                            <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${isChecked ? 'translate-x-4' : 'translate-x-0'}`} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Global Features Manager */}
        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Global Features List</h2>
          <p className="text-sm text-gray-500 mb-6">Add features here, then switch between package tabs above to turn them ON or OFF.</p>
          
          <div className="flex gap-2 mb-4">
            <input 
              type="text" 
              value={newFeatureName} 
              onChange={(e) => setNewFeatureName(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
              className="flex-1 border border-gray-300 rounded-xl p-3 outline-none focus:border-gray-900 text-sm" 
              placeholder="e.g. Source Code, App Icon..." 
            />
            <button 
              onClick={handleAddFeature}
              className="px-6 py-3 bg-[#00C6A2] hover:bg-[#00b08f] text-white font-bold rounded-xl text-sm transition-colors shrink-0"
            >
              Add
            </button>
          </div>
          
          <div className="space-y-2">
            {service.masterFeatures.map((feat, fIndex) => (
              <div key={fIndex} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl group border border-transparent hover:border-gray-200 transition-colors">
                <span className="text-sm text-gray-700 dark:text-gray-300">{feat}</span>
                <button 
                  onClick={() => handleDeleteFeature(fIndex)}
                  className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-50 rounded"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

"""

if start_idx != -1 and end_idx != -1:
    new_content = content[:start_idx] + new_packages_ui + content[end_idx:]
    with open('src/app/admin/services/edit/[id]/page.js', 'w') as f:
        f.write(new_content)
    print("Replaced successfully.")
else:
    print("Could not find start or end index.")

