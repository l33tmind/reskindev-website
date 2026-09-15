"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { collection, query, where, getDocs, deleteDoc, doc, updateDoc, onSnapshot, orderBy, serverTimestamp, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { Plus, Edit2, List, DollarSign, CheckCircle2, Trash2, Video, Inbox, X, Star } from "lucide-react";
import toast from "react-hot-toast";
import ContactUserButton from "@/components/ContactUserButton";

export default function FreelancerDashboard() {
  const { user, dbUser, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({ gigs: 0, orders: 0, earnings: 0, pendingClearance: 0, availableForWithdrawal: 0 });
  const [activeTab, setActiveTab] = useState('gigs');


  useEffect(() => {
    if (!loading && (!user || dbUser?.role !== "freelancer")) {
      router.push("/");
    }
  }, [user, dbUser, loading, router]);

  useEffect(() => {
    if (!user) return;
    async function fetchStats() {
      try {
        // Fetch Platform Fee first
        const { doc, getDoc } = require("firebase/firestore");
        const settingsSnap = await getDoc(doc(db, "settings", "global"));
        const platformFeePercentage = settingsSnap.exists() ? (Number(settingsSnap.data().platformFee) || 10) : 10;

        const gigsQ = query(collection(db, "services"), where("authorId", "==", user.uid));
        const gigsSnap = await getDocs(gigsQ);
        const gigsCount = gigsSnap.size;

        const ordersQ = query(collection(db, "orders"), where("authorId", "==", user.uid));
        const ordersSnap = await getDocs(ordersQ);
        let completed = 0;
        let totalEarnings = 0;
        let pending = 0;
        let available = 0;
        
        const now = Date.now();
        const FIFTEEN_DAYS_MS = 15 * 24 * 60 * 60 * 1000;

        ordersSnap.forEach(d => {
          const data = d.data();
          if (data.status === "completed") {
            completed++;
            const price = parseFloat(data.price) || 0;
            const freelancerShare = price - (price * (platformFeePercentage / 100));
            totalEarnings += freelancerShare;
            
            // Check clearance (15 days)
            const completedTime = data.completedAt ? data.completedAt.toMillis() : 0;
            if (completedTime > 0 && (now - completedTime) < FIFTEEN_DAYS_MS) {
                pending += freelancerShare;
            } else {
                available += freelancerShare;
            }
          }
        });

        setStats({ 
            gigs: gigsCount, 
            orders: completed, 
            earnings: totalEarnings.toFixed(2),
            pendingClearance: pending.toFixed(2),
            availableForWithdrawal: available.toFixed(2)
        });
      } catch (err) {
        console.error(err);
      }
    }
    fetchStats();
  }, [user]);

  if (loading || !user) return <div className="min-h-screen p-20 text-center">Loading Dashboard...</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <div className="max-w-6xl mx-auto p-8">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white">Seller Dashboard</h1>
            <p className="text-gray-500">Welcome back, {user.displayName}</p>
          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4"><List size={24} /></div>
            <div className="text-3xl font-black text-gray-900 dark:text-white">{stats.gigs}</div>
            <div className="text-sm font-bold text-gray-500 uppercase">Active Gigs</div>
          </div>
          
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-[#00C6A2]/20 text-[#00C6A2] rounded-full flex items-center justify-center mb-4"><Edit2 size={24} /></div>
            <div className="text-3xl font-black text-gray-900 dark:text-white">{stats.orders}</div>
            <div className="text-sm font-bold text-gray-500 uppercase">Completed Orders</div>
          </div>
          
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-4"><DollarSign size={24} /></div>
            <div className="text-3xl font-black text-gray-900 dark:text-white">${stats.earnings}</div>
            <div className="text-sm font-bold text-gray-500 uppercase">Total Earnings</div>
            <button className="mt-4 border border-gray-300 text-gray-700 px-4 py-1 rounded-full text-xs font-bold hover:bg-gray-100">Withdraw Funds</button>
          </div>
        </div>
        
        
        {/* Tabs */}
        <div className="flex gap-4 border-b border-gray-200 dark:border-gray-800 mb-6">
          <button 
            onClick={() => setActiveTab('gigs')} 
            className={`pb-4 px-2 font-bold text-sm transition-colors border-b-2 ${activeTab === 'gigs' ? 'border-[#00C6A2] text-[#00C6A2]' : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
          >
            Manage Gigs
          </button>
          <button 
            onClick={() => setActiveTab('orders')} 
            className={`pb-4 px-2 font-bold text-sm transition-colors border-b-2 ${activeTab === 'orders' ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
          >
            Manage Orders
          </button>
          <button 
            onClick={() => setActiveTab('earnings')} 
            className={`pb-4 px-2 font-bold text-sm transition-colors border-b-2 ${activeTab === 'earnings' ? 'border-green-500 text-green-500' : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
          >
            Earnings
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'gigs' ? <FreelancerGigs /> : <FreelancerOrders />}
      </div>
    </div>
  );
}

function FreelancerGigs() {
  const { user, dbUser, loading } = useAuth();
  const [gigs, setGigs] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!user) return;
    async function fetchGigs() {
      try {
        const q = query(collection(db, "services"), where("authorId", "==", user.uid));
        const snap = await getDocs(q);
        setGigs(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error(err);
      }
      setFetching(false);
    }
    fetchGigs();
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this gig?")) return;
    try {
      await deleteDoc(doc(db, "services", id));
      setGigs(gigs.filter(g => g.id !== id));
      toast.success("Gig deleted.");
    } catch (err) {
      toast.error("Failed to delete gig.");
      console.error(err);
    }
  };

  if (loading || fetching) return <div className="p-20 text-center text-gray-500">Loading your gigs...</div>;

  if (dbUser?.role !== "freelancer") {
    return <div className="p-20 text-center text-red-500 font-bold">Access Denied. You must be a Seller to view this page.</div>;
  }

  return (
    <div className="w-full">
      
      <div className="pt-6">
        <div className="flex justify-between items-center mb-8">
          <div>
          </div>
          <Link href="/freelancer/gigs/edit/new">
            <button className="bg-[#00C6A2] hover:bg-[#00b08f] text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-md flex items-center gap-2 transition-colors">
              <Plus size={18} /> Create New Gig
            </button>
          </Link>
        </div>

        {gigs.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 p-10 rounded-2xl border border-gray-200 dark:border-white/10 text-center text-gray-500 dark:text-gray-400">
            You haven't created any gigs yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gigs.map(gig => (
              <div key={gig.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm flex flex-col">
                <div className="w-full aspect-video bg-gray-100 dark:bg-gray-800 relative">
                  {gig.youtubeUrl ? (
                    <img 
                      src={`https://img.youtube.com/vi/${gig.youtubeUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i)?.[1]}/maxresdefault.jpg`} 
                      className="w-full h-full object-cover" 
                      alt={gig.title} 
                    />
                  ) : gig.youtubeUrls && gig.youtubeUrls[0] ? (
                    <img 
                      src={`https://img.youtube.com/vi/${gig.youtubeUrls[0].match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i)?.[1]}/maxresdefault.jpg`} 
                      className="w-full h-full object-cover" 
                      alt={gig.title} 
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-gray-400">
                      <Video size={32} />
                    </div>
                  )}
                  <div className={`absolute top-2 right-2 px-2 py-1 rounded text-[10px] font-bold uppercase ${gig.status === 'active' ? 'bg-green-500 text-white' : 'bg-orange-500 text-white'}`}>
                    {gig.status || 'pending'}
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white line-clamp-2 mb-2">{gig.title || "Untitled Gig"}</h3>
                  </div>
                  <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-white/10">
                    <Link href={`/freelancer/gigs/edit/${gig.id}`} className="flex-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 text-center py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2">
                      <Edit2 size={16} /> Edit
                    </Link>
                    <button onClick={() => handleDelete(gig.id)} className="bg-red-50 hover:bg-red-100 text-red-500 p-2 rounded-lg">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


function FreelancerOrders() {
  const { user, dbUser, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [platformFee, setPlatformFee] = useState(10);
  const [activeTab, setActiveTab] = useState('all');

  // Delivery Modal State
  const [deliveryModal, setDeliveryModal] = useState(null);
  const [deliveryMessage, setDeliveryMessage] = useState("");
  const [deliveryLink, setDeliveryLink] = useState("");

  // Rating Modal State
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && (!user || dbUser?.role !== "freelancer")) {
      router.push("/");
    }
  }, [user, dbUser, loading, router]);

  useEffect(() => {
    if (!user) return;
    async function fetchOrders() {
      try {
        // Fetch Platform Fee
        const { getDoc } = require("firebase/firestore");
        const settingsSnap = await getDoc(doc(db, "settings", "global"));
        if (settingsSnap.exists()) {
          setPlatformFee(Number(settingsSnap.data().platformFee) || 10);
        }
        
        const q = query(collection(db, "orders"), where("authorId", "==", user.uid));
        const snap = await getDocs(q);
        setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a,b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0)));
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
      setFetching(false);
    }
    fetchOrders();
  }, [user]);

  const submitDelivery = async (e) => {
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
  };

  const submitReviewAndComplete = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;
    
    setSubmitting(true);
    try {
      // Create a review on the buyer's profile
      if (selectedOrder.userId) {
        await addDoc(collection(db, "users", selectedOrder.userId, "reviews"), {
          freelancerId: user.uid,
          freelancerName: user.displayName || "Freelancer",
          freelancerImage: user.photoURL || "",
          orderId: selectedOrder.id,
          rating: rating,
          comment: reviewText,
          createdAt: serverTimestamp()
        });
      }

      // Mark order as completed
      await updateDoc(doc(db, "orders", selectedOrder.id), { status: "completed" });
      setOrders(orders.map(o => o.id === selectedOrder.id ? { ...o, status: "completed" } : o));
      toast.success("Order completed and review submitted!");
      setSelectedOrder(null);
      setRating(5);
      setReviewText("");
    } catch (error) {
      toast.error("Failed to complete order.");
      console.error(error);
    }
    setSubmitting(false);
  };

  if (loading || fetching) return <div className="p-20 text-center">Loading orders...</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans">
      
      <div className="max-w-7xl mx-auto p-4 md:p-8 relative">
      <div className="flex justify-between items-center mb-8">
        <div>
          <Link href="/freelancer" className="text-[#00C6A2] font-bold text-sm flex items-center mb-2 hover:underline">
            <ArrowLeft size={16} className="mr-1" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">My Assigned Orders</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Manage orders placed for your gigs.</p>
        </div>
      </div>

      <div className="flex gap-3 mb-8 overflow-x-auto hide-scrollbar pb-2">
        {['all', 'active', 'delivered', 'completed', 'cancelled'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 rounded-full text-sm font-bold tracking-wide uppercase transition-all whitespace-nowrap ${activeTab === tab ? 'bg-[#00C6A2] text-white shadow-lg shadow-[#00C6A2]/20' : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/10 hover:border-[#00C6A2] hover:text-[#00C6A2]'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100/50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider text-xs">
            <tr>
              <th className="p-4">Gig Info</th>
              <th className="p-4">Buyer</th>
              <th className="p-4">Price</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/5">
            {orders.filter(o => {
              if (activeTab === 'all') return true;
              if (activeTab === 'active') return ['pending_payment', 'pending', 'requirements', 'processing', 'revision', 'cancel_requested_by_buyer', 'cancel_requested_by_freelancer', 'disputed'].includes(o.status);
              if (activeTab === 'delivered') return o.status === 'delivered';
              if (activeTab === 'completed') return o.status === 'completed';
              if (activeTab === 'cancelled') return o.status === 'cancelled';
              return true;
            }).map(order => (
              <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-950/50 transition-colors">
                <td className="p-4">
                  <div className="font-bold text-gray-900 dark:text-white line-clamp-1">{order.gigTitle}</div>
                  <div className="text-xs text-[#00C6A2] font-bold uppercase mt-1">{order.packageName} Package</div>
                  {order.requirements && (
                    <details className="mt-2 text-xs text-gray-500">
                      <summary className="cursor-pointer font-bold text-gray-700 dark:text-gray-300 hover:text-[#00C6A2]">View Requirements</summary>
                      <p className="mt-2 p-3 bg-gray-50 dark:bg-gray-950 rounded border border-gray-100 dark:border-white/5 whitespace-pre-wrap">{order.requirements}</p>
                    </details>
                  )}
                  {order.appLinks && (
                    <div className="mt-2 text-xs">
                      <span className="font-bold text-gray-700 dark:text-gray-300">App Links:</span>
                      <p className="mt-1 p-2 bg-gray-50 dark:bg-gray-950 rounded border border-gray-100 dark:border-white/5 break-all">{order.appLinks}</p>
                    </div>
                  )}
                  {order.credentials && (
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
                  )}
                </td>
                <td className="p-4">
                  <div className="font-bold">{order.userName || "Unknown"}</div>
                  <div className="text-xs text-gray-500">{order.userEmail}</div>
                </td>
                <td className="p-4">
                  <div className="font-black text-gray-900 dark:text-white">${order.price}</div>
                  <div className="text-[10px] font-bold text-[#00C6A2]">Earn: ${(order.price - (order.price * (platformFee/100))).toFixed(2)}</div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${
                    ['completed'].includes(order.status) ? 'bg-green-50 text-green-600 border-green-200' :
                    ['delivered'].includes(order.status) ? 'bg-purple-50 text-purple-600 border-purple-200' :
                    ['cancelled', 'disputed'].includes(order.status) ? 'bg-red-50 text-red-600 border-red-200' :
                    ['pending_payment'].includes(order.status) ? 'bg-orange-100 text-orange-800 border-orange-300' :
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
                </td>
                <td className="p-4 flex flex-col gap-2">
                  {(!order.status || order.status === 'pending' || order.status === 'requirements') && (
                    <span className="text-[10px] text-orange-600 font-bold bg-orange-50 px-2 py-1.5 rounded-lg text-center border border-orange-100">Waiting for Client Requirements or Admin</span>
                  )}
                  {order.status === 'processing' && (
                    <button 
                      onClick={() => setDeliveryModal(order)}
                      className="bg-blue-600 text-white font-bold py-2 px-4 rounded-xl hover:bg-blue-700 transition-colors text-xs"
                    >
                      Deliver Work
                    </button>
                  )}
                  {order.status === 'delivered' && (
                    <button 
                      onClick={() => setSelectedOrder(order)}
                      className="bg-[#00C6A2] text-white font-bold py-2 px-4 rounded-xl hover:bg-[#00b08f] transition-colors text-xs"
                    >
                      Rate & Complete
                    </button>
                  )}
                  {order.status === 'completed' && (
                    <span className="text-xs text-green-600 font-bold bg-green-50 px-3 py-2 rounded-xl text-center border border-green-100 flex items-center justify-center gap-1">
                      <CheckCircle2 size={14} /> Completed
                    </span>
                  )}

                  <ContactUserButton 
                    targetUserId={order.userId} 
                    targetUserName={order.userName} 
                    label="Message Buyer" 
                    className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold py-2 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-700 text-xs transition-colors mt-1"
                  />
                </td>
              </tr>
            ))}
            {orders.filter(o => {
              if (activeTab === 'all') return true;
              if (activeTab === 'active') return ['pending_payment', 'pending', 'requirements', 'processing', 'revision', 'cancel_requested_by_buyer', 'cancel_requested_by_freelancer', 'disputed'].includes(o.status);
              if (activeTab === 'delivered') return o.status === 'delivered';
              if (activeTab === 'completed') return o.status === 'completed';
              if (activeTab === 'cancelled') return o.status === 'cancelled';
              return true;
            }).length === 0 && (
              <tr>
                <td colSpan="5" className="p-16">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
                      <Inbox size={48} className="text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Orders Found</h3>
                    <p className="text-gray-500 max-w-sm mx-auto">You don't have any orders in this category yet. Keep optimizing your gigs to attract more clients!</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delivery Modal */}
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

      {/* Rating & Complete Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-3xl p-8 shadow-2xl relative">
            <button 
              onClick={() => setSelectedOrder(null)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-[#00C6A2]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star size={32} className="text-[#00C6A2] fill-[#00C6A2]" />
              </div>
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Rate Buyer</h2>
              <p className="text-sm text-gray-500 mt-2">Leave a review for {selectedOrder.userName} to complete this order.</p>
            </div>

            <form onSubmit={submitReviewAndComplete} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Rating</label>
                <div className="flex gap-2 justify-center">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="focus:outline-none transform hover:scale-110 transition-transform"
                    >
                      <Star 
                        size={32} 
                        className={star <= rating ? "text-[#00C6A2] fill-[#00C6A2]" : "text-gray-300 dark:text-gray-700"} 
                      />
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Your Review</label>
                <textarea
                  required
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#00C6A2] resize-none h-32 text-sm"
                  placeholder="Great buyer! Very clear requirements..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#00C6A2] hover:bg-[#00b08f] text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50 text-sm"
              >
                {submitting ? "Submitting..." : "Submit Review & Complete"}
              </button>
            </form>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
