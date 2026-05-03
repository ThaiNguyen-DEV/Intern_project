"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { CheckCircle } from "lucide-react";
import confetti from "canvas-confetti";
import { useEffect } from "react";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");

  useEffect(() => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#3b82f6', '#10b981', '#f59e0b']
    });
  }, []);

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen py-20">
      <div className="container mx-auto px-4 max-w-lg text-center">
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800 p-10">
          <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="w-12 h-12" />
          </div>
          <h1 className="text-3xl font-bold dark:text-white mb-2">Payment Successful!</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Your booking #{bookingId} has been confirmed. A confirmation email has been sent to your address.
          </p>
          
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 mb-8 text-sm text-gray-600 dark:text-gray-300">
            <p>You can view your full itinerary and manage your booking in your profile.</p>
          </div>

          <div className="space-y-4">
            <Link href="/profile" className="block">
              <Button className="w-full">View My Bookings</Button>
            </Link>
            <Link href="/" className="block">
              <Button variant="outline" className="w-full">Return Home</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
