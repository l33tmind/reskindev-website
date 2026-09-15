"use client";

import { useEffect, useState } from "react";
import { collection, query, where, orderBy, getDocs, addDoc, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { Package, ExternalLink, Star } from "lucide-react";
import ContactUserButton from "@/components/ContactUserButton";

export default function MyOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Review Modal State
  const [reviewOrder, setReviewOrder] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  // New Modals State
  const [reqOrder, setReqOrder] = useState(null);
  const [reqText, setReqText] = useState("");
  const [submittingReq, setSubmittingReq] = useState(false);

  const [revOrder, setRevOrder] = useState(null);
  const [revText, setRevText] = useState("");

  const [cancelModal, setCancelModal] = useState(null);
  const [canceling, setCanceling] = useState(false);
  const [submittingRev, setSubmittingRev] = useState(false);

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

  const STAGES = ["payment", "requirements", "processing", "delivered", "completed"];

  const getStageIndex = (status) => {
    let s = (status || "requirements").toLowerCase();
    if (s === "pending_payment") s = "payment";
    if (s === "pending") s = "requirements";
    if (s === "revision") s = "processing";
    const idx = STAGES.indexOf(s);
    return idx === -1 ? 0 : idx;
  };


  const handleSubmitReq = async (e) => {
    e.preventDefault();
    if (!reqText.trim()) return;
    setSubmittingReq(true);
    try {
      await updateDoc(doc(db, "orders", reqOrder.id), { 
        status: "processing", 
        requirementsText: reqText,
        requirementsProvided: true,
        updatedAt: serverTimestamp()
      });
      setOrders(orders.map(o => o.id === reqOrder.id ? { ...o, status: "processing" } : o));
      toast.success("Requirements submitted successfully!");
      setReqOrder(null);
      setReqText("");
    } catch (error) {
      toast.error("Failed to submit requirements.");
      console.error(error);
    }
    setSubmittingReq(false);
  };

  const submitCancellation = async () => {
    if (!cancelModal) return;
    setCanceling(true);
    try {
      await updateDoc(doc(db, "orders", cancelModal.id), { 
        status: "cancel_requested_by_buyer",
        updatedAt: serverTimestamp()
      });
      setOrders(orders.map(o => o.id === cancelModal.id ? { ...o, status: "cancel_requested_by_buyer" } : o));
      toast.success("Cancellation request sent to seller.");
      setCancelModal(null);
    } catch (error) {
      toast.error("Failed to request cancellation.");
      console.error(error);
    }
    setCanceling(false);
  };

  const handleAction = async (orderId, actionType) => {
    try {
      let newStatus = '';
      if (actionType === 'decline') newStatus = 'processing';
      if (actionType === 'accept_cancel') newStatus = 'cancelled';
      if (actionType === 'admin') newStatus = 'disputed';
      
      if (!newStatus) return;

      await updateDoc(doc(db, "orders", orderId), { 
        status: newStatus,
        updatedAt: serverTimestamp()
      });
      
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      toast.success("Action completed.");
    } catch (error) {
      toast.error("Action failed.");
      console.error(error);
    }
  };

  const handleRequestRev = async (e) => {
    e.preventDefault();
    if (!revText.trim()) return;
    try {
      await updateDoc(doc(db, "orders", revOrder.id), { 
        status: "revision",
        revisionNote: revText,
        updatedAt: serverTimestamp()
      });
      setOrders(orders.map(o => o.id === revOrder.id ? { ...o, status: "revision" } : o));
      toast.success("Revision requested successfully!");
      setRevOrder(null);
      setRevText("");
    } catch (error) {
      toast.error("Failed to request revision.");
      console.error(error);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!reviewOrder || !user) return;
    setSubmittingReview(true);

    try {
      await addDoc(collection(db, "services", reviewOrder.gigId, "reviews"), {
        orderId: reviewOrder.id,
        userId: user.uid,
        userName: user.displayName || "Client",
        userImage: user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || "Client")}`,
        rating: Number(rating),
        comment,
        createdAt: serverTimestamp()
      });

      // Mark order as completed and reviewed
      await updateDoc(doc(db, "orders", reviewOrder.id), {
        status: "completed",
        hasReview: true,
        completedAt: serverTimestamp()
      });

      setOrders(orders.map(o => o.id === reviewOrder.id ? { ...o, status: "completed", hasReview: true } : o));
      setReviewOrder(null);
      setComment("");
      setRating(5);
      alert("Review submitted successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to submit review.");
    }
    setSubmittingReview(false);
  };

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
          {orders.map(order => {
            const currentStageIdx = getStageIndex(order.status);
            
            return (
              <div key={order.id} className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm flex flex-col gap-6">
                
                {/* Top Info */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1">{order.gigTitle}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Package: <span className="font-semibold text-gray-700 dark:text-gray-300">{order.packageName}</span> | Ordered on: {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : 'Recent'}</p>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Paid</p>
                      <div className="font-black text-2xl text-[#00C6A2]">${order.price}.00</div>
                    </div>
                    <ContactUserButton 
                      targetUserId={order.freelancerId || order.authorId} 
                      targetUserName={order.freelancerName || order.authorName || "Seller"} 
                      label="Message" 
                      className="bg-[#00C6A2] hover:bg-[#00b08f] text-white p-3 rounded-xl border border-transparent transition-colors font-bold text-sm"
                    />
                    <Link href={`/gig/${order.gigId}/view`} className="bg-gray-50 dark:bg-gray-950 hover:bg-gray-100 text-gray-700 dark:text-gray-300 p-3 rounded-xl border border-gray-200 transition-colors" title="View Gig">
                      <ExternalLink size={20} />
                    </Link>
                  </div>
                </div>

                {/* Progress Timeline */}
                <div className="relative pt-4 pb-2">
                  <div className="absolute top-7 left-0 w-full h-1 bg-gray-100 dark:bg-gray-800 rounded-full z-0"></div>
                  <div 
                    className="absolute top-7 left-0 h-1 bg-[#00C6A2] rounded-full z-0 transition-all duration-500"
                    style={{ width: `${(currentStageIdx / (STAGES.length - 1)) * 100}%` }}
                  ></div>
                  
                  <div className="relative z-10 flex justify-between">
                    {STAGES.map((stage, idx) => {
                      const isCompleted = idx <= currentStageIdx;
                      const isCurrent = idx === currentStageIdx;
                      return (
                        <div key={stage} className="flex flex-col items-center gap-2 w-1/5">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center bg-white dark:bg-gray-900 transition-colors duration-300 ${
                            isCompleted ? 'border-[#00C6A2]' : 'border-gray-200 dark:border-gray-700'
                          }`}>
                            {isCompleted && <div className={`w-2.5 h-2.5 rounded-full bg-[#00C6A2] ${isCurrent ? 'animate-pulse' : ''}`}></div>}
                          </div>
                          <span className={`text-[10px] md:text-xs font-bold uppercase tracking-wider text-center ${
                            isCurrent ? 'text-[#00C6A2]' : (isCompleted ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400')
                          }`}>
                            {stage}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 mt-4 border-t border-gray-100 dark:border-white/5 flex flex-wrap gap-2 justify-end">
                  
                  
                  {order.status === 'pending_payment' && (
                    <span className="bg-amber-100 text-amber-800 font-bold py-2 px-4 rounded-xl text-xs flex items-center shadow-sm">
                      Waiting for Payment
                    </span>
                  )}
                  {['requirements', 'pending'].includes(order.status) && (
                    <button onClick={() => setReqOrder(order)} className="bg-amber-400 hover:bg-amber-500 text-amber-900 font-bold py-2 px-5 rounded-xl text-xs transition-colors shadow-sm">
                      Submit Requirements
                    </button>
                  )}

                  {order.status === 'delivered' && (
                    <>
                      <button onClick={() => setRevOrder(order)} className="bg-white border border-orange-200 text-orange-600 hover:bg-orange-50 font-bold py-2 px-5 rounded-xl text-xs transition-colors">
                        Request Revision
                      </button>
                      <button onClick={() => setReviewOrder(order)} className="bg-[#00C6A2] hover:bg-[#00b08f] text-white font-bold py-2 px-5 rounded-xl text-xs transition-colors shadow-sm">
                        Accept & Complete
                      </button>
                    </>
                  )}

                  {['processing', 'revision', 'requirements'].includes(order.status) && (
                    <button onClick={() => setCancelModal(order)} className="bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 font-bold py-2 px-4 rounded-xl text-xs transition-colors">
                      Cancel Order
                    </button>
                  )}

                  {order.status === 'cancel_requested_by_freelancer' && (
                    <div className="flex gap-2">
                      <button onClick={() => handleAction(order.id, 'decline')} className="bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 font-bold py-2 px-4 rounded-xl text-xs transition-colors">
                        Decline Cancel
                      </button>
                      <button onClick={() => handleAction(order.id, 'accept_cancel')} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-xl text-xs transition-colors">
                        Accept Cancellation
                      </button>
                    </div>
                  )}

                  {['processing', 'delivered', 'revision'].includes(order.status) && (
                    <button onClick={() => { if(confirm('Involve Admin?')) handleAction(order.id, 'admin') }} className="bg-red-50 hover:bg-red-100 border border-red-100 text-red-600 font-bold py-2 px-4 rounded-xl text-xs transition-colors">
                      Involve Admin
                    </button>
                  )}
                  
                  {order.status === 'completed' && !order.hasReview && (
                    <button onClick={() => setReviewOrder(order)} className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold py-2 px-6 rounded-xl text-xs flex items-center gap-2 transition-colors shadow-sm">
                      <Star size={14} className="fill-yellow-900" /> Leave a Review
                    </button>
                  )}
                  
                  {order.hasReview && (
                    <span className="text-green-500 font-bold text-xs flex items-center gap-1">
                      <Star size={14} className="fill-green-500" /> Review Submitted
                    </span>
                  )}
                </div>
                {order.hasReview && (
                  <div className="pt-4 border-t border-gray-100 dark:border-white/5 flex justify-end">
                    <span className="text-green-500 font-bold text-sm flex items-center gap-1">
                      <Star size={16} className="fill-green-500" /> Review Submitted
                    </span>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

      {/* Review Modal */}
      {reviewOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-3xl p-6 shadow-2xl border border-white/10 animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-black text-gray-900 dark:text-white mb-2">Rate your experience</h2>
            <p className="text-gray-500 text-sm mb-6">How was your order for <span className="font-bold">{reviewOrder.gigTitle}</span>?</p>
            
            <form onSubmit={submitReview}>
              <div className="flex justify-center gap-2 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button 
                    key={star} 
                    type="button" 
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star size={36} className={`${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-700'}`} />
                  </button>
                ))}
              </div>
              
              <div className="mb-6">
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Your Review</label>
                <textarea 
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-white/10 rounded-xl p-4 text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-[#00C6A2]"
                  placeholder="Tell us what you liked about this service..."
                ></textarea>
              </div>

              <div className="flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setReviewOrder(null)}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={submittingReview}
                  className="flex-1 py-3 bg-[#00C6A2] hover:bg-[#00b08f] text-white font-bold rounded-xl transition-colors neon-glow disabled:opacity-50"
                >
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* Requirements Modal */}
      {reqOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-white/10 animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-black text-gray-900 dark:text-white mb-2">Submit Requirements</h2>
            <p className="text-gray-500 text-sm mb-6">Please provide all necessary details for <span className="font-bold">{reqOrder.gigTitle}</span>.</p>
            <form onSubmit={handleSubmitReq}>
              <div className="mb-6">
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Project Details & Links</label>
                <textarea 
                  required
                  rows="6"
                  value={reqText}
                  onChange={(e) => setReqText(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#00C6A2]"
                  placeholder="Describe your requirements, add Google Drive links, credentials, etc..."
                ></textarea>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setReqOrder(null)} className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors">Cancel</button>
                <button type="submit" disabled={submittingReq} className="flex-1 py-3 bg-[#00C6A2] hover:bg-[#00b08f] text-white font-bold rounded-xl transition-colors disabled:opacity-50">
                  {submittingReq ? 'Submitting...' : 'Start Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Revision Modal */}
      {revOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-white/10 animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-black text-gray-900 dark:text-white mb-2">Request Revision</h2>
            <p className="text-gray-500 text-sm mb-6">What needs to be changed in this delivery?</p>
            <form onSubmit={handleRequestRev}>
              <div className="mb-6">
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Revision Notes</label>
                <textarea 
                  required
                  rows="4"
                  value={revText}
                  onChange={(e) => setRevText(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="E.g. Please change the logo color to blue..."
                ></textarea>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setRevOrder(null)} className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors">Cancel</button>
                <button type="submit" disabled={submittingRev} className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors disabled:opacity-50">
                  {submittingRev ? 'Sending...' : 'Send Revision Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancel Order Modal */}
      {cancelModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-gray-200 dark:border-white/10 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            </div>
            <h2 className="text-xl font-black text-center text-gray-900 dark:text-white mb-2">Cancel Order?</h2>
            <p className="text-gray-500 text-sm text-center mb-6">
              Are you sure you want to request cancellation for <strong>{cancelModal.gigTitle}</strong>? The seller will need to approve this request.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setCancelModal(null)} 
                disabled={canceling}
                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl transition-colors disabled:opacity-50"
              >
                Go Back
              </button>
              <button 
                onClick={submitCancellation} 
                disabled={canceling}
                className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-colors disabled:opacity-50 shadow-md"
              >
                {canceling ? 'Sending...' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
