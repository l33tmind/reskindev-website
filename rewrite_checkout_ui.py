import re

with open("src/app/order/[gigId]/[pkg]/page.js", "r") as f:
    content = f.read()

# 1. Update the title "Order Requirements" to "Place Order"
content = content.replace('<h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Order Requirements</h2>', '<h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Complete Purchase</h2>')

# 2. Replace the inputs with a clean message
inputs_search = r'<div className="space-y-4 mb-6">.*?</div>\n                \n                <button'
inputs_replace = """<div className="space-y-4 mb-6">
                  <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-white/10 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-[#00C6A2] mb-4"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">Submit Requirements Later</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">After placing your order, you will be directed to a dedicated page to securely submit your project files, links, and detailed requirements.</p>
                  </div>
                </div>
                
                <button"""

content = re.sub(inputs_search, inputs_replace, content, flags=re.DOTALL)

with open("src/app/order/[gigId]/[pkg]/page.js", "w") as f:
    f.write(content)
