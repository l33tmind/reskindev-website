"use client";

import { useEffect, useState } from "react";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { Package, Clock, CheckCircle, ExternalLink } from "lucide-react";

export default function MyOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      if (!user) return;
      try {
        const q = query(
          collection(db, "orders"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        const snap = await getDocs(q);
        setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e) {
        console.error("Error fetching orders:", e);
      }
      setLoading(false);
    }
    fetchOrders();
  }, [user]);

  if (loading) return <div>Loading orders...</div>;

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <Package size={24} className="text-[#00C6A2]" /> My Orders
      </h1>

      {orders.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 p-10 rounded-2xl border border-gray-200 text-center text-gray-500 dark:text-gray-400">
          <Package size={48} className="mx-auto mb-4 text-gray-300" />
          You haven't placed any orders yet.
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    order.status === 'completed' ? 'bg-green-100 text-green-700' :
                    order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {order.status || 'Pending'}
                  </span>
                  <span className="text-gray-400 text-sm">
                    {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : 'Recent'}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1">{order.gigTitle}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Package: <span className="font-semibold text-gray-700 dark:text-gray-300">{order.packageName}</span></p>
              </div>

              <div className="text-left md:text-right">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Paid</p>
                <div className="font-black text-2xl text-[#00C6A2]">${order.price}.00</div>
              </div>
              
              <Link href={`/gig/${order.gigId}/view`} className="md:ml-4 bg-gray-50 dark:bg-gray-950 hover:bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 p-3 rounded-xl border border-gray-200 transition-colors flex items-center justify-center" title="View Gig">
                <ExternalLink size={20} />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
