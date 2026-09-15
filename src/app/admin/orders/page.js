"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, getDocs, doc, updateDoc, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Package, Search, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [pendingStatuses, setPendingStatuses] = useState({});
  const [savingStatusId, setSavingStatusId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
    setLoading(false);
  }

  const updateStatus = async (orderId, newStatus) => {
    try {
      const order = orders.find(o => o.id === orderId);
      await updateDoc(doc(db, "orders", orderId), { status: newStatus });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      
      // Notify buyer and freelancer
      if (order) {
        let buyerMessage = `Your order for "${order.gigTitle}" is now marked as: ${newStatus.replace(/_/g, ' ').toUpperCase()}`;
        let sellerMessage = `Order status for "${order.gigTitle}" updated to: ${newStatus.replace(/_/g, ' ').toUpperCase()}`;

        if (newStatus === "requirements") {
          buyerMessage = `✅ Payment Secured! Reskindev has successfully held your escrow payment for "${order.gigTitle}". Please submit your requirements if you haven't already.`;
          sellerMessage = `🎉 Escrow Payment Received! Reskindev has secured the funds for "${order.gigTitle}". You can now safely start working on this order!`;
        } else if (newStatus === "completed") {
          sellerMessage = `🎉 Order Completed! Earnings for "${order.gigTitle}" have been added to your balance.`;
        }

        // Send to Buyer
        if (order.userId) {
          await addDoc(collection(db, "notifications"), {
            userId: order.userId,
            message: buyerMessage,
            read: false,
            createdAt: serverTimestamp()
          });
        }
        
        // Send to Freelancer
        const sellerId = order.freelancerId || order.authorId;
        if (sellerId && sellerId !== order.userId) {
          await addDoc(collection(db, "notifications"), {
            userId: sellerId,
            message: sellerMessage,
            read: false,
            createdAt: serverTimestamp()
          });
        }
      }
    } catch (e) {
      alert("Failed to update status.");
    }
  };

  const handleStatusSelect = (orderId, value) => {
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

  const filteredOrders = orders.filter(o => 
    (searchTerm === 'disputed' ? o.status === 'disputed' : true) &&
    (searchTerm === 'disputed' ? true : (
      o.gigTitle?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      o.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.userEmail?.toLowerCase().includes(searchTerm.toLowerCase())
    ))
  );

  if (loading) return <div>Loading orders...</div>;

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
          <Package size={28} className="text-[#00C6A2]" /> Client Orders
        </h1>
        <div className="flex gap-4">
          <div className="relative w-full md:w-64">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search orders..."
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
          <option value="pending_payment">⏳ Pending Payment</option>
          <option value="disputed">⚠️ Disputes</option>
        </select>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-950 border-b border-gray-200 text-gray-500 dark:text-gray-400 uppercase text-xs font-bold">
              <tr>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Service</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                    No orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50 dark:bg-gray-950 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900 dark:text-white">{order.userName || "Unknown"}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{order.userEmail}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-800 dark:text-gray-200 line-clamp-1">{order.gigTitle}</div>
                      <div className="text-xs text-[#00C6A2] font-bold uppercase">{order.packageName} Pkg</div>
                    </td>
                    <td className="px-6 py-4 font-black text-gray-900 dark:text-white">
                      ${order.price}
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                      {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <select
                          value={pendingStatuses[order.id] || order.status || 'pending'}
                          onChange={(e) => handleStatusSelect(order.id, e.target.value)}
                          className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full outline-none cursor-pointer ${
                            (pendingStatuses[order.id] || order.status) === 'completed' ? 'bg-green-100 text-green-700 border border-green-200' :
                            (pendingStatuses[order.id] || order.status) === 'processing' || (pendingStatuses[order.id] || order.status) === 'review' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                            ['cancelled', 'cancel_requested_by_buyer', 'cancel_requested_by_freelancer', 'disputed'].includes(pendingStatuses[order.id] || order.status) ? 'bg-red-100 text-red-700 border border-red-200' :
                            ['delivered'].includes(pendingStatuses[order.id] || order.status) ? 'bg-purple-100 text-purple-700 border border-purple-200' :
                            'bg-amber-100 text-amber-700 border border-amber-200'
                          }`}
                        >
                          <option value="pending_payment">Pending Payment</option>
                          <option value="pending">Pending</option>
                          <option value="requirements">Requirements</option>
                          <option value="processing">Processing</option>
                          <option value="revision">Revision</option>
                          <option value="delivered">Delivered</option>
                          <option value="completed">Completed</option>
                          <option value="cancel_requested_by_buyer">Cancel Req (Buyer)</option>
                          <option value="cancel_requested_by_freelancer">Cancel Req (Seller)</option>
                          <option value="disputed">Disputed ⚠️</option>
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
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => alert(`Requirements: \n${order.requirements}`)}
                        className="text-[#00C6A2] hover:text-[#00b08f] font-bold text-xs bg-[#E6F9F5] px-3 py-1.5 rounded-lg"
                      >
                        View Req
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
