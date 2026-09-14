import re

with open("src/app/freelancer/orders/page.js", "r") as f:
    content = f.read()

# Add states for Delivery Modal, activeTab, and platformFee
state_search = r'const \[orders, setOrders\] = useState\(\[\]\);\n  const \[fetching, setFetching\] = useState\(true\);'
state_replace = """const [orders, setOrders] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [platformFee, setPlatformFee] = useState(10);
  const [activeTab, setActiveTab] = useState('all');

  // Delivery Modal State
  const [deliveryModal, setDeliveryModal] = useState(null);
  const [deliveryMessage, setDeliveryMessage] = useState("");
  const [deliveryLink, setDeliveryLink] = useState("");"""
content = re.sub(state_search, state_replace, content)

# Update fetchOrders to get platformFee
fetch_search = r'const q = query\(collection\(db, "orders"\), where\("freelancerId", "==", user\.uid\)\);'
fetch_replace = """// Fetch Platform Fee
        const { getDoc } = require("firebase/firestore");
        const settingsSnap = await getDoc(doc(db, "settings", "global"));
        if (settingsSnap.exists()) {
          setPlatformFee(Number(settingsSnap.data().platformFee) || 10);
        }
        
        const q = query(collection(db, "orders"), where("freelancerId", "==", user.uid));"""
content = re.sub(fetch_search, fetch_replace, content)

# Change handleDeliverWork to use modal
deliver_search = r"""  const handleDeliverWork = async \(orderId\) => \{
    if \(\!window\.confirm\("Are you sure you want to mark this work as Delivered\?"\)\) return;
    try \{
      await updateDoc\(doc\(db, "orders", orderId\), \{ status: "delivered" \}\);
      setOrders\(orders\.map\(o => o\.id === orderId \? \{ \.\.\.o, status: "delivered" \} : o\)\);
      toast\.success\("Order marked as delivered!"\);
    \} catch \(error\) \{
      toast\.error\("Failed to update status"\);
    \}
  \};"""

deliver_replace = """  const submitDelivery = async (e) => {
    e.preventDefault();
    if (!deliveryModal) return;
    setSubmitting(true);
    try {
      await updateDoc(doc(db, "orders", deliveryModal.id), { 
        status: "delivered",
        deliveryMessage,
        deliveryLink,
        deliveredAt: serverTimestamp()
      });
      setOrders(orders.map(o => o.id === deliveryModal.id ? { 
        ...o, 
        status: "delivered", 
        deliveryMessage, 
        deliveryLink 
      } : o));
      toast.success("Work delivered successfully!");
      setDeliveryModal(null);
      setDeliveryMessage("");
      setDeliveryLink("");
    } catch (error) {
      toast.error("Failed to deliver work");
    }
    setSubmitting(false);
  };"""
content = re.sub(deliver_search, deliver_replace, content)

# Button changes in table
btn_search = r"""onClick=\{\(\) => handleDeliverWork\(order\.id\)\}"""
btn_replace = """onClick={() => setDeliveryModal(order)}"""
content = re.sub(btn_search, btn_replace, content)

# Price column updates to show earnings
price_search = r"""<td className="p-4 font-black text-gray-900 dark:text-white">\$\{order\.price\}</td>"""
price_replace = """<td className="p-4">
                  <div className="font-black text-gray-900 dark:text-white">${order.price}</div>
                  <div className="text-[10px] font-bold text-[#00C6A2]">Earn: ${(order.price - (order.price * (platformFee/100))).toFixed(2)}</div>
                </td>"""
content = re.sub(price_search, price_replace, content)

# Apply activeTab filtering
table_search = r'\{orders\.map\(order => \('
table_replace = """{orders.filter(o => {
              if (activeTab === 'all') return true;
              if (activeTab === 'active') return o.status === 'pending' || o.status === 'processing';
              if (activeTab === 'delivered') return o.status === 'delivered';
              if (activeTab === 'completed') return o.status === 'completed';
              if (activeTab === 'cancelled') return o.status === 'cancelled';
              return true;
            }).map(order => ("""
content = re.sub(table_search, table_replace, content)

# Add Tab UI above table
tab_ui_search = r'<div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 shadow-sm overflow-hidden">'
tab_ui_replace = """<div className="flex gap-2 mb-6 overflow-x-auto hide-scrollbar pb-2">
        {['all', 'active', 'delivered', 'completed', 'cancelled'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all whitespace-nowrap ${activeTab === tab ? 'bg-[#00C6A2] text-white shadow-md' : 'bg-white dark:bg-gray-900 text-gray-500 border border-gray-200 dark:border-white/10 hover:border-[#00C6A2]'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 shadow-sm overflow-hidden">"""
content = re.sub(tab_ui_search, tab_ui_replace, content)

# Empty state logic update
empty_search = r'\{orders\.length === 0 && \('
empty_replace = """{orders.filter(o => {
              if (activeTab === 'all') return true;
              if (activeTab === 'active') return o.status === 'pending' || o.status === 'processing';
              if (activeTab === 'delivered') return o.status === 'delivered';
              if (activeTab === 'completed') return o.status === 'completed';
              if (activeTab === 'cancelled') return o.status === 'cancelled';
              return true;
            }).length === 0 && ("""
content = re.sub(empty_search, empty_replace, content)

# Delivery Details display for delivered/completed orders
delivery_details_search = r'\{order\.credentials && \(\n                    <div className="mt-2 text-xs">\n                      <span className="font-bold text-gray-700 dark:text-gray-300">Credentials:</span>\n                      <p className="mt-1 p-2 bg-gray-50 dark:bg-gray-950 rounded border border-gray-100 dark:border-white/5 break-all font-mono">\{order\.credentials\}</p>\n                    </div>\n                  \)\}'
delivery_details_replace = """{order.credentials && (
                    <div className="mt-2 text-xs">
                      <span className="font-bold text-gray-700 dark:text-gray-300">Credentials:</span>
                      <p className="mt-1 p-2 bg-gray-50 dark:bg-gray-950 rounded border border-gray-100 dark:border-white/5 break-all font-mono">{order.credentials}</p>
                    </div>
                  )}
                  {order.deliveryLink && (
                    <div className="mt-3 text-xs bg-[#E6F9F5] dark:bg-[#00C6A2]/10 p-3 rounded-lg border border-[#00C6A2]/20">
                      <span className="font-bold text-[#00C6A2] block mb-1">Final Delivery:</span>
                      <p className="mb-2 text-gray-700 dark:text-gray-300">{order.deliveryMessage}</p>
                      <a href={order.deliveryLink} target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:underline break-all">
                        {order.deliveryLink}
                      </a>
                    </div>
                  )}"""
content = re.sub(delivery_details_search, delivery_details_replace, content)

# Delivery Modal Form
delivery_modal_html = """{/* Delivery Modal */}
      {deliveryModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-3xl p-8 shadow-2xl relative">
            <button 
              onClick={() => setDeliveryModal(null)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            
            <div className="mb-6">
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Deliver Work</h2>
              <p className="text-sm text-gray-500 mt-2">Submit your final work files or links for the client.</p>
            </div>

            <form onSubmit={submitDelivery} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Delivery Link (Drive, GitHub, etc)</label>
                <input
                  type="url"
                  required
                  value={deliveryLink}
                  onChange={(e) => setDeliveryLink(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#00C6A2] text-sm"
                  placeholder="https://..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Delivery Message</label>
                <textarea
                  required
                  value={deliveryMessage}
                  onChange={(e) => setDeliveryMessage(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#00C6A2] resize-none h-24 text-sm"
                  placeholder="Here is the final delivery as requested..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50 text-sm mt-4"
              >
                {submitting ? "Sending..." : "Deliver Order"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Rating & Complete Modal */}"""

rating_modal_search = r'\{/\* Rating & Complete Modal \*/\}'
content = re.sub(rating_modal_search, delivery_modal_html, content)


with open("src/app/freelancer/orders/page.js", "w") as f:
    f.write(content)

