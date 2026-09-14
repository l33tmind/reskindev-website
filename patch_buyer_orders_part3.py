import re

with open("src/app/profile/orders/page.js", "r") as f:
    content = f.read()

modals = """

      {/* Requirements Modal */}
      {reqOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-white/10 animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-black text-gray-900 dark:text-white mb-2">Submit Requirements</h2>
            <p className="text-gray-500 text-sm mb-6">Please provide all necessary details for <span className="font-bold">{reqOrder.gigTitle}</span>.</p>
            <form onSubmit={handleSubmitReq}>
              <div className="mb-6">
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Project Details & Links</label>
                <textarea 
                  required
                  rows="6"
                  value={reqText}
                  onChange={(e) => setReqText(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#00C6A2]"
                  placeholder="Describe your requirements, add Google Drive links, credentials, etc..."
                ></textarea>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setReqOrder(null)} className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors">Cancel</button>
                <button type="submit" disabled={submittingReq} className="flex-1 py-3 bg-[#00C6A2] hover:bg-[#00b08f] text-white font-bold rounded-xl transition-colors disabled:opacity-50">
                  {submittingReq ? 'Submitting...' : 'Start Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Revision Modal */}
      {revOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-white/10 animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-black text-gray-900 dark:text-white mb-2">Request Revision</h2>
            <p className="text-gray-500 text-sm mb-6">What needs to be changed in this delivery?</p>
            <form onSubmit={handleRequestRev}>
              <div className="mb-6">
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Revision Notes</label>
                <textarea 
                  required
                  rows="4"
                  value={revText}
                  onChange={(e) => setRevText(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="E.g. Please change the logo color to blue..."
                ></textarea>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setRevOrder(null)} className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors">Cancel</button>
                <button type="submit" disabled={submittingRev} className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors disabled:opacity-50">
                  {submittingRev ? 'Sending...' : 'Send Revision Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
"""

content = content.replace('    </div>\n  );\n}', modals + '    </div>\n  );\n}')

with open("src/app/profile/orders/page.js", "w") as f:
    f.write(content)
