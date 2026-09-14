import re

with open("src/app/admin/orders/page.js", "r") as f:
    content = f.read()

# 1. Add new state variables
state_search = r'const \[searchTerm, setSearchTerm\] = useState\(""\);'
state_replace = """const [searchTerm, setSearchTerm] = useState("");
  const [pendingStatuses, setPendingStatuses] = useState({});
  const [savingStatusId, setSavingStatusId] = useState(null);"""
content = re.sub(state_search, state_replace, content)

# 2. Add handleStatusSelect and handleStatusSave right before filteredOrders
func_search = r'  const filteredOrders = orders\.filter'
func_replace = """  const handleStatusSelect = (orderId, value) => {
    setPendingStatuses(prev => ({ ...prev, [orderId]: value }));
  };

  const handleStatusSave = async (orderId) => {
    const newStatus = pendingStatuses[orderId];
    if (!newStatus) return;
    
    setSavingStatusId(orderId);
    await updateStatus(orderId, newStatus);
    
    setPendingStatuses(prev => {
      const next = { ...prev };
      delete next[orderId];
      return next;
    });
    setSavingStatusId(null);
  };

  const filteredOrders = orders.filter"""
content = re.sub(func_search, func_replace, content)

# 3. Update the select UI to use the new local state and show the Save button
select_search = r"""                    <td className="px-6 py-4">
                      <select
                        value=\{order\.status \|\| 'pending'\}
                        onChange=\{\(e\) => updateStatus\(order\.id, e\.target\.value\)\}
                        className=\{\`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full outline-none cursor-pointer \$\{
                          order\.status === 'completed' \? 'bg-green-100 text-green-700' :
                          order\.status === 'processing' \|\| order\.status === 'review' \? 'bg-blue-100 text-blue-700' :
                          'bg-amber-100 text-amber-700'
                        \}\`\}
                      >
                        <option value="pending">Pending</option>
                        <option value="requirements">Requirements</option>
                        <option value="processing">Processing</option>
                        <option value="review">Review</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>"""

select_replace = """                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <select
                          value={pendingStatuses[order.id] || order.status || 'pending'}
                          onChange={(e) => handleStatusSelect(order.id, e.target.value)}
                          className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full outline-none cursor-pointer ${
                            (pendingStatuses[order.id] || order.status) === 'completed' ? 'bg-green-100 text-green-700 border border-green-200' :
                            (pendingStatuses[order.id] || order.status) === 'processing' || (pendingStatuses[order.id] || order.status) === 'review' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                            (pendingStatuses[order.id] || order.status) === 'cancelled' ? 'bg-red-100 text-red-700 border border-red-200' :
                            'bg-amber-100 text-amber-700 border border-amber-200'
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="requirements">Requirements</option>
                          <option value="processing">Processing</option>
                          <option value="review">Review</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>

                        {pendingStatuses[order.id] && pendingStatuses[order.id] !== order.status && (
                          <button
                            onClick={() => handleStatusSave(order.id)}
                            disabled={savingStatusId === order.id}
                            className="bg-[#00C6A2] hover:bg-[#00b08f] text-white px-3 py-1 rounded-lg text-xs font-bold transition-colors shadow-sm disabled:opacity-50 whitespace-nowrap"
                          >
                            {savingStatusId === order.id ? '...' : 'Save'}
                          </button>
                        )}
                      </div>
                    </td>"""

content = re.sub(select_search, select_replace, content)

with open("src/app/admin/orders/page.js", "w") as f:
    f.write(content)

