import re

with open('src/app/admin/services/edit/[id]/page.js', 'r') as f:
    content = f.read()

# We need to find the start of {/* Packages Configuration (Tabbed) */}
# and the end of {/* Global Features Manager */}
start_idx = content.find('{/* Packages Configuration (Tabbed) */}')
if start_idx == -1:
    start_idx = content.find('{/* Packages Configuration */}')

end_idx = content.find('{/* Service Description */}')
if end_idx == -1:
    end_idx = content.find('{/* Description */}')
    if end_idx == -1:
        end_idx = content.find('<div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 shadow-sm">\n          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Description')

print(f"Start: {start_idx}, End: {end_idx}")

new_ui = """        {/* Packages & Features (App-Style UI) */}
        <div className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm">
          
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Packages & Features</h2>
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
                className="px-4 py-2 bg-[#00C6A2] hover:bg-[#00b08f] text-white font-bold text-sm rounded-full transition-colors flex items-center gap-1 shrink-0 shadow-sm"
              >
                + Add Tier
              </button>
            )}
          </div>

          {/* Pill Tabs */}
          <div className="flex gap-3 overflow-x-auto pb-4 mb-2 hide-scrollbar">
            {service.packages.map((pkg, idx) => {
              const isActive = activeTab === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveTab(idx)}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm whitespace-nowrap border transition-all ${
                    isActive 
                      ? 'bg-[#00C6A2]/10 border-[#00C6A2] text-[#00C6A2]' 
                      : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300'
                  }`}
                >
                  {isActive && <span className="text-[#00C6A2]">✓</span>}
                  {pkg.name || `Package ${idx + 1}`}
                </button>
              );
            })}
          </div>

          {/* Active Package Card */}
          {service.packages[activeTab] && (
            <div className="border border-[#00C6A2]/30 bg-white dark:bg-gray-900 rounded-2xl p-6 md:p-8 shadow-sm">
              
              {/* Form Fields */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">Package Name</label>
                  <div className="flex items-center gap-4">
                    <input 
                      type="text" 
                      value={service.packages[activeTab].name} 
                      onChange={(e) => handlePackageChange(activeTab, "name", e.target.value)} 
                      className="flex-1 border border-gray-200 dark:border-gray-700 rounded-xl p-3 outline-none focus:border-[#00C6A2] text-gray-900 dark:text-white bg-transparent" 
                    />
                    {service.packages.length > 1 && (
                      <button 
                        onClick={() => {
                          setService(prev => {
                            const newPackages = [...prev.packages];
                            newPackages.splice(activeTab, 1);
                            return { ...prev, packages: newPackages };
                          });
                          if (activeTab > 0) setActiveTab(activeTab - 1);
                        }}
                        className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-3 rounded-xl transition-colors shrink-0"
                        title="Delete Tier"
                      >
                        <Trash2 size={20} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">Price (USD)</label>
                    <input 
                      type="number" 
                      value={service.packages[activeTab].price} 
                      onChange={(e) => handlePackageChange(activeTab, "price", e.target.value)} 
                      className="w-full border border-gray-200 dark:border-gray-700 rounded-xl p-3 outline-none focus:border-[#00C6A2] text-gray-900 dark:text-white bg-transparent" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">Delivery (Days)</label>
                    <input 
                      type="number" 
                      value={service.packages[activeTab].deliveryDays} 
                      onChange={(e) => handlePackageChange(activeTab, "deliveryDays", e.target.value)} 
                      className="w-full border border-gray-200 dark:border-gray-700 rounded-xl p-3 outline-none focus:border-[#00C6A2] text-gray-900 dark:text-white bg-transparent" 
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">Package Description</label>
                  <textarea 
                    value={service.packages[activeTab].description} 
                    onChange={(e) => handlePackageChange(activeTab, "description", e.target.value)} 
                    rows="3" 
                    className="w-full border border-gray-200 dark:border-gray-700 rounded-xl p-4 outline-none focus:border-[#00C6A2] text-sm text-gray-900 dark:text-white bg-transparent resize-none" 
                  />
                </div>
              </div>

              {/* Features Included */}
              <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-6">Features Included</h3>
                
                <div className="space-y-4 mb-6">
                  {service.masterFeatures.map((feat, fIndex) => {
                    const isChecked = service.packages[activeTab].featureChecks?.[fIndex] || false;
                    return (
                      <div key={fIndex} className="flex items-center gap-4 group">
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
                          className={`w-6 h-6 rounded flex items-center justify-center shrink-0 border transition-colors ${
                            isChecked 
                              ? 'bg-[#00C6A2] border-[#00C6A2] text-white' 
                              : 'bg-transparent border-gray-300 dark:border-gray-600'
                          }`}
                        >
                          {isChecked && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                        </button>
                        
                        <span className="flex-1 text-sm text-gray-700 dark:text-gray-300">{feat}</span>
                        
                        <button 
                          onClick={() => handleRemoveFeature(fIndex)}
                          className="text-gray-400 hover:text-red-500 p-1 rounded-md transition-colors"
                          title="Remove Feature Globally"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Add New Feature */}
                <div className="flex gap-3">
                  <input 
                    type="text" 
                    value={newFeatureName} 
                    onChange={(e) => setNewFeatureName(e.target.value)} 
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                    className="flex-1 border border-gray-200 dark:border-gray-700 rounded-xl p-3 outline-none focus:border-[#00C6A2] text-sm text-gray-900 dark:text-white bg-transparent" 
                    placeholder="Add new feature (e.g. Source Code)" 
                  />
                  <button 
                    onClick={handleAddFeature}
                    className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl text-sm transition-transform hover:scale-105 active:scale-95 shrink-0"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

"""

if start_idx != -1 and end_idx != -1:
    new_content = content[:start_idx] + new_ui + content[end_idx:]
    with open('src/app/admin/services/edit/[id]/page.js', 'w') as f:
        f.write(new_content)
    print("UI replaced successfully.")
else:
    print("Could not find boundaries.")
