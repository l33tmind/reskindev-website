"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc, addDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Trash2, Plus } from "lucide-react";

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState("");
  const [limit, setLimit] = useState("");

  const fetchCoupons = async () => {
    try {
      const snap = await getDocs(collection(db, "coupons"));
      setCoupons(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleSave = async () => {
    if (!code || !discount) return;
    
    try {
      await addDoc(collection(db, "coupons"), {
        code: code.trim().toUpperCase(),
        discount: parseFloat(discount) || 0,
        usageLimit: parseInt(limit) || 0,
        usageCount: 0,
      });
      setIsModalOpen(false);
      setCode("");
      setDiscount("");
      setLimit("");
      fetchCoupons();
    } catch (e) {
      alert("Error saving coupon");
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this coupon?")) {
      await deleteDoc(doc(db, "coupons", id));
      setCoupons(coupons.filter(c => c.id !== id));
    }
  };

  if (loading) return <div>Loading coupons...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Coupons</h1>
          <p className="text-gray-500 text-sm">Create and manage discount coupons.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#00C6A2] hover:bg-[#00b08f] text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-md flex items-center gap-2"
        >
          <Plus size={18} /> Add Coupon
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-900">
            <tr>
              <th className="px-6 py-4 font-bold">Code</th>
              <th className="px-6 py-4 font-bold">Discount</th>
              <th className="px-6 py-4 font-bold">Usage</th>
              <th className="px-6 py-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-6 py-4 font-black text-[#00C6A2] tracking-wider">{c.code}</td>
                <td className="px-6 py-4 font-bold text-gray-900">${c.discount}</td>
                <td className="px-6 py-4">{c.usageCount || 0} / {c.usageLimit || '∞'}</td>
                <td className="px-6 py-4 flex justify-end">
                  <button onClick={() => handleDelete(c.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-full">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {coupons.length === 0 && (
              <tr>
                <td colSpan="4" className="p-8 text-center text-gray-400">No coupons active.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-6">Create Coupon</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1">Coupon Code</label>
                <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} className="w-full border rounded-lg p-3 uppercase font-bold" placeholder="e.g. SUMMER50" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Discount Amount ($)</label>
                <input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} className="w-full border rounded-lg p-3" placeholder="50" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Usage Limit (0 for unlimited)</label>
                <input type="number" value={limit} onChange={(e) => setLimit(e.target.value)} className="w-full border rounded-lg p-3" placeholder="10" />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-2 rounded-lg font-bold text-gray-500 hover:bg-gray-100">Cancel</button>
              <button onClick={handleSave} className="px-6 py-2 rounded-lg font-bold bg-[#00C6A2] text-white hover:bg-[#00b08f]">Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
