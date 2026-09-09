"use client";

import { useEffect, useState, use } from "react";
import { doc, getDoc, collection, addDoc, serverTimestamp, updateDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function OrderPage({ params }) {
  // Unwrap params using React.use() to avoid the async params warning in Next.js 15+ client components
  const unwrappedParams = use(params);
  const gigId = unwrappedParams.gigId;
  const pkgName = unwrappedParams.pkg; // basic, standard, premium

  const { user } = useAuth();
  const router = useRouter();

  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requirements, setRequirements] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchGig() {
      const docRef = doc(db, "services", gigId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setGig(docSnap.data());
      }
      setLoading(false);
    }
    fetchGig();
  }, [gigId]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!gig) return <div className="min-h-screen flex items-center justify-center">Service not found.</div>;

  const activeTabName = pkgName === 'basic' ? 'Basic' : pkgName === 'standard' ? 'Standard' : 'Premium';
  const pkgData = (gig.packages || []).find(p => p.name === activeTabName) || {};
  const basePrice = pkgData.price || 0;
  
  const [couponCode, setCouponCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [appliedCouponId, setAppliedCouponId] = useState(null);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setApplyingCoupon(true);
    setCouponError("");
    try {
      const q = query(collection(db, "coupons"), where("code", "==", couponCode.toUpperCase()));
      const snap = await getDocs(q);
      if (snap.empty) {
        setCouponError("Invalid coupon code");
      } else {
        const coupon = snap.docs[0].data();
        if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
          setCouponError("Coupon limit reached");
        } else {
          setDiscountAmount(coupon.discount || 0);
          setAppliedCouponId(snap.docs[0].id);
        }
      }
    } catch (e) {
      setCouponError("Error applying coupon");
    }
    setApplyingCoupon(false);
  };

  const finalPrice = Math.max(0, basePrice - discountAmount);

  const handleOrder = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please Sign In first to place an order.");
      return;
    }
    if (!requirements.trim()) {
      alert("Please provide order requirements.");
      return;
    }

    setSubmitting(true);
    try {
      await addDoc(collection(db, "orders"), {
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName,
        gigId: gigId,
        gigTitle: gig.title,
        packageName: pkgName,
        price: finalPrice,
        basePrice: basePrice,
        discountAmount: discountAmount,
        status: "pending", 
        requirements: requirements,
        createdAt: serverTimestamp(),
      });
      
      // Update coupon usage count if one was applied
      if (appliedCouponId) {
        const couponRef = doc(db, "coupons", appliedCouponId);
        const cSnap = await getDoc(couponRef);
        if (cSnap.exists()) {
          await updateDoc(couponRef, { usageCount: (cSnap.data().usageCount || 0) + 1 });
        }
      }

      setSuccess(true);
    } catch (error) {
      console.error("Order failed:", error);
      alert("Failed to place order. Try again.");
    }
    setSubmitting(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <CheckCircle2 size={80} className="text-green-500 mb-6" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
        <p className="text-gray-600 mb-8">We will review your requirements and start working on it.</p>
        <Link href="/profile/orders" className="bg-[#00C6A2] text-white px-8 py-3 rounded-full font-bold hover:bg-[#00b08f] transition-colors">
          View My Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-10">
        <button onClick={() => router.back()} className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-gray-900 mb-8">
          <ArrowLeft size={16} className="mr-2" /> Back
        </button>

        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Order Form */}
          <div className="md:col-span-2">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Requirements</h2>
              {!user && (
                <div className="bg-amber-50 text-amber-800 p-4 rounded-lg mb-6 text-sm font-semibold border border-amber-200">
                  ⚠️ You need to sign in using the top-right button before submitting.
                </div>
              )}
              
              <div className="bg-[#FEF3C7] border border-[#FDE68A] rounded-xl p-4 mb-6 flex items-start gap-3">
                <div className="text-[#D97706] mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
                </div>
                <p className="text-[#92400E] text-sm leading-relaxed">
                  <strong>This is a real-world service.</strong> After placing your order, our team will contact you to discuss project details and finalize payment arrangements offline.
                </p>
              </div>

              <form onSubmit={handleOrder}>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Please provide all necessary details for this order (App links, credentials, specifics):
                </label>
                <textarea
                  required
                  rows="6"
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-[#00C6A2] focus:border-transparent outline-none mb-6"
                  placeholder="I need..."
                />
                
                <button 
                  type="submit" 
                  disabled={submitting || !user}
                  className={`w-full py-4 rounded-xl font-bold text-white transition-colors text-lg ${
                    submitting || !user ? "bg-gray-400 cursor-not-allowed" : "bg-[#00C6A2] hover:bg-[#00b08f]"
                  }`}
                >
                  {submitting ? "Placing Order..." : `Place Order • $${finalPrice}.00`}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-4">Order Summary</h2>
              
              <div className="flex gap-4 mb-4">
                {gig.imageUrl && (
                  <img src={gig.imageUrl} alt="Gig" className="w-16 h-16 object-cover rounded-lg" />
                )}
                <div className="flex-1">
                  <h3 className="font-bold text-sm text-gray-900 line-clamp-2">{gig.title}</h3>
                  <p className="text-xs text-green-600 font-bold uppercase mt-1">{pkgName} Package</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center text-sm mb-2 text-gray-600">
                <span>Subtotal</span>
                <span>${basePrice}.00</span>
              </div>
              
              {/* Coupon Field */}
              <div className="mb-4 mt-2">
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Coupon Code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={discountAmount > 0}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#00C6A2] disabled:bg-gray-50"
                  />
                  <button 
                    onClick={handleApplyCoupon}
                    disabled={applyingCoupon || discountAmount > 0}
                    className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold disabled:opacity-50"
                  >
                    Apply
                  </button>
                </div>
                {couponError && <p className="text-red-500 text-xs mt-1 font-semibold">{couponError}</p>}
                {discountAmount > 0 && <p className="text-green-600 text-xs mt-1 font-bold">Coupon applied! (${discountAmount} off)</p>}
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between items-center text-sm mb-2 text-green-600 font-bold">
                  <span>Discount</span>
                  <span>-${discountAmount}.00</span>
                </div>
              )}
              
              <div className="flex justify-between items-center text-sm mb-4 text-gray-600">
                <span>Service Fee</span>
                <span>$0.00</span>
              </div>
              
              <div className="flex justify-between items-center font-black text-lg text-gray-900 border-t border-gray-100 pt-4">
                <span>Total</span>
                <span>${finalPrice}.00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
