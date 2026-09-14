import "./globals.css";
import Providers from "./Providers";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import TopProgressBar from "@/components/TopProgressBar";

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
      className="h-full antialiased font-sans"
    >
      <body className="min-h-full flex flex-col relative bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
        <Providers>
          <TopProgressBar />
          {children}
          <FloatingWhatsApp />
        </Providers>
      </body>
    </html>
  );
}
