import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./Providers";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import LiveChatWidget from "@/components/LiveChatWidget";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Reskindev - Premium Services",
  description: "Professional app development services tailored to your digital needs.",
  openGraph: {
    title: "Reskindev - Premium Services",
    description: "Professional app development services tailored to your digital needs.",
    images: ["https://img.youtube.com/vi/FdmW6ZaYWyU/maxresdefault.jpg"],
  }
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col relative bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
        <Providers>
          {children}
          <FloatingWhatsApp />
          <LiveChatWidget />
        </Providers>
      </body>
    </html>
  );
}
