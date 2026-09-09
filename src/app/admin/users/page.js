"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const fetchedUsers = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
      setLoading(false);
    }
    fetchUsers();
  }, []);

  if (loading) return <div>Loading users...</div>;

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-2">User Management</h1>
      <p className="text-gray-500 mb-8 text-sm">Manage registered users and their access.</p>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex flex-col">
          {users.map((u, i) => (
            <div key={u.id} className={`flex items-center justify-between p-5 ${i !== users.length - 1 ? 'border-b border-gray-100' : ''}`}>
              <div className="flex items-center gap-4">
                {u.photoURL ? (
                  <img src={u.photoURL} alt={u.displayName} className="w-12 h-12 rounded-full" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#00C6A2] text-white flex items-center justify-center font-bold text-lg">
                    {(u.displayName || u.email || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-gray-900">{u.displayName || "Unknown User"}</h3>
                  <p className="text-sm text-gray-500">{u.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">Active</span>
                <button className="bg-[#FF4D4F] hover:bg-[#ff3030] text-white px-6 py-2 rounded-lg font-bold text-sm transition-colors shadow-sm">
                  Block
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
