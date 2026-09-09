"use client";

import { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { Star } from "lucide-react";

export default function GigReviews({ gigId }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const q = query(
      collection(db, "services", gigId, "reviews"),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(q, (snap) => {
      setReviews(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsubscribe();
  }, [gigId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please login to submit a review.");
    if (!comment.trim()) return alert("Please enter a comment.");

    setSubmitting(true);
    try {
      await addDoc(collection(db, "services", gigId, "reviews"), {
        userId: user.uid,
        userName: user.displayName || "Anonymous",
        userImage: user.photoURL || `https://ui-avatars.com/api/?name=User`,
        rating: rating,
        comment: comment.trim(),
        createdAt: serverTimestamp(),
      });
      setComment("");
      setRating(5);
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review.");
    }
    setSubmitting(false);
  };

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
    : 0;

  return (
    <div className="mt-12 bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
        Client Reviews
        {reviews.length > 0 && (
          <span className="text-sm font-semibold bg-gray-100 px-3 py-1 rounded-full text-gray-700 flex items-center gap-1">
            <Star size={14} className="text-amber-400 fill-amber-400" />
            {avgRating} ({reviews.length})
          </span>
        )}
      </h2>

      {/* Review Submission Form */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-10 bg-gray-50 p-6 rounded-xl border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-3">Leave a Review</h3>
          <div className="flex items-center gap-2 mb-4">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="focus:outline-none"
              >
                <Star 
                  size={24} 
                  className={star <= rating ? "text-amber-400 fill-amber-400" : "text-gray-300"} 
                />
              </button>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            rows="3"
            placeholder="Share your experience with this service..."
            className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#00C6A2] mb-3"
          />
          <button 
            type="submit" 
            disabled={submitting}
            className="bg-[#00C6A2] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#00b08f] transition-colors disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      ) : (
        <div className="mb-10 bg-amber-50 p-4 rounded-xl border border-amber-200 text-amber-800 text-sm font-semibold">
          Please sign in to leave a review.
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map(review => (
            <div key={review.id} className="flex gap-4 pb-6 border-b border-gray-100 last:border-0 last:pb-0">
              <img src={review.userImage} alt={review.userName} className="w-10 h-10 rounded-full object-cover" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-gray-900 text-sm">{review.userName}</h4>
                  <span className="text-xs text-gray-500">
                    {review.createdAt?.toDate ? review.createdAt.toDate().toLocaleDateString() : 'Just now'}
                  </span>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={12} 
                      className={i < review.rating ? "text-amber-400 fill-amber-400" : "text-gray-300"} 
                    />
                  ))}
                </div>
                <p className="text-gray-700 text-sm">{review.comment}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
