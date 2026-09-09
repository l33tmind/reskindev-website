"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Users, ShoppingBag, DollarSign, Briefcase } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    orders: 0,
    revenue: 0,
    services: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [usersSnap, ordersSnap, servicesSnap] = await Promise.all([
          getDocs(collection(db, "users")),
          getDocs(collection(db, "orders")),
          getDocs(collection(db, "services"))
        ]);

        let totalRevenue = 0;
        ordersSnap.forEach(doc => {
          if (doc.data().status !== 'cancelled') {
            totalRevenue += Number(doc.data().price || 0);
          }
        });

        setStats({
          users: usersSnap.size,
          orders: ordersSnap.size,
          revenue: totalRevenue,
          services: servicesSnap.size
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
      setLoading(false);
    }
    fetchStats();
  }, []);

  const statCards = [
    { title: "Total Revenue", value: `$${stats.revenue}`, icon: DollarSign, color: "text-green-600", bg: "bg-green-100" },
    { title: "Total Orders", value: stats.orders, icon: ShoppingBag, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "Total Users", value: stats.users, icon: Users, color: "text-purple-600", bg: "bg-purple-100" },
    { title: "Active Services", value: stats.services, icon: Briefcase, color: "text-amber-600", bg: "bg-amber-100" },
  ];

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className={`p-4 rounded-xl ${card.bg} ${card.color}`}>
              <card.icon size={28} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 mb-1">{card.title}</p>
              <h3 className="text-2xl font-black text-gray-900">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Welcome to Reskindev Admin</h2>
        <p className="text-gray-600 leading-relaxed">
          From here you can manage all your platform's content. Use the sidebar to navigate through your orders, users, services, and system settings.
          <br /><br />
          Keep an eye on the <strong>Orders</strong> tab to fulfill client requests promptly, and ensure your <strong>Services</strong> are up to date with the latest features and premium screenshots to maximize earnings.
        </p>
      </div>
    </div>
  );
}
