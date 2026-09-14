"use client";

import { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { Star } from "lucide-react";
import toast from "react-hot-toast";

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

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
    : 0;

  return (
    <div className="mt-12 bg-white dark:bg-gray-900 p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
        Client Reviews
        {reviews.length > 0 && (
          <span className="text-sm font-semibold bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-gray-700 dark:text-gray-300 flex items-center gap-1">
            <Star size={14} className="text-amber-400 fill-amber-400" />
            {avgRating} ({reviews.length})
          </span>
        )}
      </h2>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map(review => (
            <div key={review.id} className="flex gap-4 pb-6 border-b border-gray-100 last:border-0 last:pb-0">
              <img src={review.userImage} alt={review.userName} className="w-10 h-10 rounded-full object-cover" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm">{review.userName}</h4>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
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
                <p className="text-gray-700 dark:text-gray-300 text-sm">{review.comment}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
