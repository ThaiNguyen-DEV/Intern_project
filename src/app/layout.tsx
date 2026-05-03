import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ToastContainer } from "@/components/ui/Toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TravelGo | Book Your Next Adventure",
  description: "Find and book the best tours worldwide with TravelGo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100`}>
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <ToastContainer />
      </body>
    </html>
  );
}
