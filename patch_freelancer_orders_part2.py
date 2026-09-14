import re

with open("src/app/freelancer/orders/page.js", "r") as f:
    content = f.read()

# Replace Status column rendering
status_search = r'<td className="p-4">\n\s*<span className=\{\`px-2 py-1 rounded text-\[10px\] font-bold uppercase border \$\{\n\s*order\.status === \'completed\' \? \'bg-green-50 text-green-600 border-green-200\' :\n\s*order\.status === \'delivered\' \? \'bg-purple-50 text-purple-600 border-purple-200\' :\n\s*order\.status === \'processing\' \? \'bg-blue-50 text-blue-600 border-blue-200\' :\n\s*\'bg-orange-50 text-orange-600 border-orange-200\'\n\s*\}\`\}>\n\s*\{order\.status \|\| \'pending\'\}\n\s*</span>\n\s*</td>'

status_replace = """<td className="p-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${
                    ['completed'].includes(order.status) ? 'bg-green-50 text-green-600 border-green-200' :
                    ['delivered'].includes(order.status) ? 'bg-purple-50 text-purple-600 border-purple-200' :
                    ['cancelled', 'disputed'].includes(order.status) ? 'bg-red-50 text-red-600 border-red-200' :
                    ['requirements'].includes(order.status) ? 'bg-amber-50 text-amber-600 border-amber-200' :
                    'bg-blue-50 text-blue-600 border-blue-200'
                  }`}>
                    {order.status || 'requirements'}
                  </span>
                  {(order.status === 'processing' || order.status === 'revision') && (
                    <div className="mt-2 text-[10px] font-bold text-gray-500 bg-gray-50 px-2 py-1 rounded border border-gray-200 inline-block">
                      ⏳ {getCountdown(order.requirementsSubmittedAt || order.createdAt, order.deliveryDays || 3)}
                    </div>
                  )}
                </td>"""

content = re.sub(status_search, status_replace, content)

# Modify Action column
action_search = r'\{order\.status === \'processing\' && \(\n\s*<button \n\s*onClick=\{\(\) => setDeliveryModal\(order\)\}\n\s*className="bg-blue-600 text-white font-bold py-2 px-4 rounded-xl hover:bg-blue-700 transition-colors text-xs"\n\s*>\n\s*Deliver Work\n\s*</button>\n\s*\)\}'

action_replace = """{(order.status === 'processing' || order.status === 'revision') && (
                    <button 
                      onClick={() => setDeliveryModal(order)}
                      className="bg-blue-600 text-white font-bold py-2 px-4 rounded-xl hover:bg-blue-700 transition-colors text-xs"
                    >
                      Deliver Work
                    </button>
                  )}
                  {['processing', 'revision', 'requirements'].includes(order.status) && (
                    <button onClick={() => { if(confirm('Request Cancellation?')) handleAction(order.id, 'cancel') }} className="bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 font-bold py-2 px-4 rounded-xl text-xs transition-colors">
                      Cancel Order
                    </button>
                  )}
                  {order.status === 'cancel_requested_by_buyer' && (
                    <div className="flex flex-col gap-2">
                      <button onClick={() => handleAction(order.id, 'accept_cancel')} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-xl text-xs transition-colors">
                        Accept Cancellation
                      </button>
                      <button onClick={() => handleAction(order.id, 'decline')} className="bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 font-bold py-2 px-4 rounded-xl text-xs transition-colors">
                        Decline Cancel
                      </button>
                    </div>
                  )}
                  {['processing', 'delivered', 'revision'].includes(order.status) && (
                    <button onClick={() => { if(confirm('Involve Admin?')) handleAction(order.id, 'admin') }} className="bg-red-50 hover:bg-red-100 border border-red-100 text-red-600 font-bold py-2 px-4 rounded-xl text-xs transition-colors">
                      Involve Admin
                    </button>
                  )}"""
content = content.replace(action_search, action_replace)

# Also update the waiting for admin payment verfication block
wait_admin_search = r"\{\(\!order\.status \|\| order\.status === \'pending\' \|\| order\.status === \'requirements\'\) && \("
wait_admin_replace = """{(!order.status || order.status === 'pending' || order.status === 'requirements') && (
                    <span className="text-[10px] text-orange-600 font-bold bg-orange-50 px-2 py-1.5 rounded-lg text-center border border-orange-100">Waiting for Client Requirements or Admin</span>
                  )}"""

if "{(!order.status || order.status === 'pending' || order.status === 'requirements') && (" in content:
    content = content.replace(
        "{(!order.status || order.status === 'pending' || order.status === 'requirements') && (\n                    <span className=\"text-xs text-orange-600 font-bold bg-orange-50 px-3 py-2 rounded-xl text-center border border-orange-100\">Waiting for Admin<br/>Payment Verification</span>\n                  )}",
        wait_admin_replace
    )

with open("src/app/freelancer/orders/page.js", "w") as f:
    f.write(content)

