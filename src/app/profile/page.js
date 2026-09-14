"use client";

import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { Clock, CheckCircle, Package } from "lucide-react";

export default function ProfileOverview() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ pending: 0, in_progress: 0, completed: 0, total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      if (!user) return;
      try {
        const q = query(collection(db, "orders"), where("userId", "==", user.uid));
        const snap = await getDocs(q);
        
        let p = 0, i = 0, c = 0;
        snap.forEach(doc => {
          const s = doc.data().status;
          if (s === 'pending') p++;
          if (s === 'in_progress') i++;
          if (s === 'completed') c++;
        });

        setStats({ pending: p, in_progress: i, completed: c, total: snap.size });
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    }
    fetchStats();
  }, [user]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-6">Welcome back, {user?.displayName || "User"}!</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-500 flex items-center justify-center">
            <Clock size={24} />
          </div>
          <div>
            <div className="text-3xl font-black text-gray-900 dark:text-white">{stats.pending}</div>
            <div className="text-sm font-bold text-gray-500 dark:text-gray-400">Pending Orders</div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center">
            <Package size={24} />
          </div>
          <div>
            <div className="text-3xl font-black text-gray-900 dark:text-white">{stats.in_progress}</div>
            <div className="text-sm font-bold text-gray-500 dark:text-gray-400">In Progress</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-500 flex items-center justify-center">
            <CheckCircle size={24} />
          </div>
          <div>
            <div className="text-3xl font-black text-gray-900 dark:text-white">{stats.completed}</div>
            <div className="text-sm font-bold text-gray-500 dark:text-gray-400">Completed</div>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">About Your Profile</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
          Welcome to your personal dashboard. Use the sidebar to track your orders, view saved services, and update your account settings. If you need any assistance, feel free to contact support.
        </p>
      </div>
    </div>
  );
}
