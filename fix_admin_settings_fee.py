import re

with open("src/app/admin/settings/page.js", "r") as f:
    content = f.read()

# Add Financial Settings block before Hero Section Settings
old_block = """      {/* Hero Section Settings */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 shadow-sm p-8 mb-8">"""

new_block = """      {/* Financial Settings */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 shadow-sm p-8 mb-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-6 border-b border-gray-100 pb-4">Financial Settings</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Platform Commission Fee (%)</label>
            <input 
              type="number" 
              name="platformFee"
              min="0"
              max="100"
              value={settings?.platformFee !== undefined ? settings.platformFee : 10}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg p-3 focus:ring-2 focus:ring-[#00C6A2] outline-none"
            />
            <p className="text-xs text-gray-500 mt-2">
              This percentage will be deducted from the freelancer's earnings on every completed order. 
              For example, if set to 10%, a $100 order gives the freelancer $90 and the platform keeps $10 as profit.
            </p>
          </div>
          <button 
            onClick={() => handleSave('financial')}
            disabled={saving === 'financial'}
            className="bg-[#00C6A2] hover:bg-[#00b08f] text-white px-6 py-2 rounded-lg font-bold transition-colors"
          >
            {saving === 'financial' ? 'Saving...' : 'Save Financial Settings'}
          </button>
        </div>
      </div>

      {/* Hero Section Settings */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 shadow-sm p-8 mb-8">"""

content = content.replace(old_block, new_block)

with open("src/app/admin/settings/page.js", "w") as f:
    f.write(content)

