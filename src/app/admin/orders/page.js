"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Package, Search, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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
      await updateDoc(doc(db, "orders", orderId), { status: newStatus });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (e) {
      alert("Failed to update status.");
    }
  };

  const filteredOrders = orders.filter(o => 
    o.gigTitle?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    o.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.userEmail?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div>Loading orders...</div>;

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
          <Package size={28} className="text-[#00C6A2]" /> Client Orders
        </h1>
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
                      <select
                        value={order.status || 'pending'}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded outline-none cursor-pointer border ${
                          order.status === 'completed' ? 'bg-green-50 text-green-700 border-green-200' :
                          order.status === 'processing' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
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
