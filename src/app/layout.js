import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./Providers";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col relative">
        <Providers>
          {children}
          <FloatingWhatsApp />
        </Providers>
      </body>
    </html>
  );
}
