import re

with open("src/app/profile/orders/page.js", "r") as f:
    content = f.read()

# 1. getStageIndex update
get_stage_search = r'  const getStageIndex = \(status\) => \{.*?return idx === -1 \? 0 : idx;\n  \};'
get_stage_replace = """  const getStageIndex = (status) => {
    let s = (status || "requirements").toLowerCase();
    if (s === "pending") s = "requirements";
    if (s === "revision") s = "processing";
    const idx = STAGES.indexOf(s);
    return idx === -1 ? 0 : idx;
  };"""
content = re.sub(get_stage_search, get_stage_replace, content, flags=re.DOTALL)

# 2. Add Timer to the top right of the order card
order_card_top = r'<div className="flex justify-between items-start mb-4">'
order_card_top_replace = """<div className="flex justify-between items-start mb-4">
                  <div className="absolute top-4 right-4 text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                      ['completed'].includes(order.status) ? 'bg-green-50 text-green-600 border-green-200' :
                      ['delivered'].includes(order.status) ? 'bg-purple-50 text-purple-600 border-purple-200' :
                      ['cancelled', 'disputed'].includes(order.status) ? 'bg-red-50 text-red-600 border-red-200' :
                      ['requirements'].includes(order.status) ? 'bg-amber-50 text-amber-600 border-amber-200' :
                      'bg-blue-50 text-blue-600 border-blue-200'
                    }`}>
                      {order.status || 'requirements'}
                    </span>
                    {(order.status === 'processing' || order.status === 'revision') && (
                      <div className="mt-2 text-[11px] font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-md border border-gray-200">
                        ⏳ {getCountdown(order.requirementsSubmittedAt || order.createdAt, order.deliveryDays || 3)}
                      </div>
                    )}
                  </div>"""
content = content.replace('<div className="flex justify-between items-start mb-4">', order_card_top_replace)

# 3. Modify Actions rendering
actions_search = r'\{\/\* Actions \(Review\) \*\/\}.*?\}'
# wait, replacing the whole block is better
actions_search = r'\{\/\* Actions \(Review\) \*\/\}.*?</div>\n                \)\}'
actions_replace = """{/* Actions */}
                <div className="pt-4 mt-4 border-t border-gray-100 dark:border-white/5 flex flex-wrap gap-2 justify-end">
                  
                  {['requirements', 'pending'].includes(order.status) && (
                    <button onClick={() => setReqOrder(order)} className="bg-amber-400 hover:bg-amber-500 text-amber-900 font-bold py-2 px-5 rounded-xl text-xs transition-colors shadow-sm">
                      Submit Requirements
                    </button>
                  )}

                  {order.status === 'delivered' && (
                    <>
                      <button onClick={() => setRevOrder(order)} className="bg-white border border-orange-200 text-orange-600 hover:bg-orange-50 font-bold py-2 px-5 rounded-xl text-xs transition-colors">
                        Request Revision
                      </button>
                      <button onClick={() => setReviewOrder(order)} className="bg-[#00C6A2] hover:bg-[#00b08f] text-white font-bold py-2 px-5 rounded-xl text-xs transition-colors shadow-sm">
                        Accept & Complete
                      </button>
                    </>
                  )}

                  {['processing', 'revision', 'requirements'].includes(order.status) && (
                    <button onClick={() => { if(confirm('Request Cancellation?')) handleAction(order.id, 'cancel') }} className="bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 font-bold py-2 px-4 rounded-xl text-xs transition-colors">
                      Cancel Order
                    </button>
                  )}

                  {order.status === 'cancel_requested_by_freelancer' && (
                    <div className="flex gap-2">
                      <button onClick={() => handleAction(order.id, 'decline')} className="bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 font-bold py-2 px-4 rounded-xl text-xs transition-colors">
                        Decline Cancel
                      </button>
                      <button onClick={() => handleAction(order.id, 'accept_cancel')} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-xl text-xs transition-colors">
                        Accept Cancellation
                      </button>
                    </div>
                  )}

                  {['processing', 'delivered', 'revision'].includes(order.status) && (
                    <button onClick={() => { if(confirm('Involve Admin?')) handleAction(order.id, 'admin') }} className="bg-red-50 hover:bg-red-100 border border-red-100 text-red-600 font-bold py-2 px-4 rounded-xl text-xs transition-colors">
                      Involve Admin
                    </button>
                  )}
                  
                  {order.status === 'completed' && !order.hasReview && (
                    <button onClick={() => setReviewOrder(order)} className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold py-2 px-6 rounded-xl text-xs flex items-center gap-2 transition-colors shadow-sm">
                      <Star size={14} className="fill-yellow-900" /> Leave a Review
                    </button>
                  )}
                  
                  {order.hasReview && (
                    <span className="text-green-500 font-bold text-xs flex items-center gap-1">
                      <Star size={14} className="fill-green-500" /> Review Submitted
                    </span>
                  )}
                </div>"""
content = re.sub(actions_search, actions_replace, content, flags=re.DOTALL)

with open("src/app/profile/orders/page.js", "w") as f:
    f.write(content)
