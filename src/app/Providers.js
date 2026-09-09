"use client";

import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";

export default function Providers({ children }) {
  return (
    <AuthProvider>
      <Toaster position="bottom-right" reverseOrder={false} />
      {children}
    </AuthProvider>
  );
}
