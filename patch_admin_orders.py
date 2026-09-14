import re

with open("src/app/admin/orders/page.js", "r") as f:
    content = f.read()

# Add a filter bar for All / Disputed
filter_search = r'<div className="relative w-full md:w-64">'
filter_replace = """<div className="flex gap-4">
          <div className="relative w-full md:w-64">"""
content = content.replace(filter_search, filter_replace)

search_end = r'placeholder="Search orders..."\n            value=\{searchTerm\}\n            onChange=\{\(e\) => setSearchTerm\(e\.target\.value\)\}\n            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-\[\#00C6A2\]"\n          />\n        </div>'
search_end_replace = """placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#00C6A2]"
          />
        </div>
        <select 
          onChange={(e) => setSearchTerm(e.target.value === 'disputed' ? 'disputed' : '')}
          className="border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-[#00C6A2] font-bold text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
        >
          <option value="">All Orders</option>
          <option value="disputed">⚠️ Disputes</option>
        </select>
        </div>"""
content = re.sub(search_end, search_end_replace, content)

# Update the dropdown to include new statuses
status_search = r'<option value="requirements">Requirements</option>\n                          <option value="processing">Processing</option>\n                          <option value="review">Review</option>\n                          <option value="completed">Completed</option>\n                          <option value="cancelled">Cancelled</option>'
status_replace = """<option value="requirements">Requirements</option>
                          <option value="processing">Processing</option>
                          <option value="revision">Revision</option>
                          <option value="delivered">Delivered</option>
                          <option value="completed">Completed</option>
                          <option value="cancel_requested_by_buyer">Cancel Req (Buyer)</option>
                          <option value="cancel_requested_by_freelancer">Cancel Req (Seller)</option>
                          <option value="disputed">Disputed ⚠️</option>
                          <option value="cancelled">Cancelled</option>"""
content = re.sub(status_search, status_replace, content)

# Color updates for new statuses
color_search = r'\(pendingStatuses\[order\.id\] \|\| order\.status\) === \'cancelled\' \? \'bg-red-100 text-red-700 border border-red-200\' :'
color_replace = """['cancelled', 'cancel_requested_by_buyer', 'cancel_requested_by_freelancer', 'disputed'].includes(pendingStatuses[order.id] || order.status) ? 'bg-red-100 text-red-700 border border-red-200' :
                            ['delivered'].includes(pendingStatuses[order.id] || order.status) ? 'bg-purple-100 text-purple-700 border border-purple-200' :"""
content = re.sub(color_search, color_replace, content)

with open("src/app/admin/orders/page.js", "w") as f:
    f.write(content)

