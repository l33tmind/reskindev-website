"use client";
import { useEffect, useState } from "react";
import { collection, query, orderBy, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import toast from "react-hot-toast";

export default function AdminWithdrawals() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const q = query(collection(db, "withdrawals"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setRequests(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const markPaid = async (id) => {
    try {
      await updateDoc(doc(db, "withdrawals", id), {
        status: "paid",
        paidAt: new Date()
      });
      toast.success("Marked as Paid!");
      fetchRequests();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Withdrawal Requests</h1>
        <p className="text-gray-500 text-sm">Manage and pay freelancer withdrawal requests via Payoneer.</p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-white/10 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-white/10 text-gray-500 font-bold uppercase text-xs">
            <tr>
              <th className="p-4">Freelancer</th>
              <th className="p-4">Payoneer Email</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/5">
            {requests.map(req => (
              <tr key={req.id}>
                <td className="p-4">
                  <div className="font-bold">{req.freelancerName}</div>
                  <div className="text-xs text-gray-500">{req.email}</div>
                </td>
                <td className="p-4 font-mono text-xs">{req.payoneerEmail}</td>
                <td className="p-4 font-black text-gray-900 dark:text-white">${req.amount}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                    req.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {req.status}
                  </span>
                </td>
                <td className="p-4">
                  {req.status === 'pending' && (
                    <button 
                      onClick={() => markPaid(req.id)}
                      className="bg-[#00C6A2] hover:bg-[#00b08f] text-white font-bold py-1 px-3 rounded text-xs transition-colors"
                    >
                      Mark Paid
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {requests.length === 0 && (
              <tr>
                <td colSpan="5" className="p-10 text-center text-gray-500">No withdrawal requests yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
