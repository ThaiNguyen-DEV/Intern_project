"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { Booking } from "@/types";
import { Button } from "@/components/ui/Button";
import { CreditCard, Wallet, ShieldCheck, CheckCircle2 } from "lucide-react";
import { useNotificationStore, useBookingStore } from "@/store";

function PaymentContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const router = useRouter();
  
  const [booking, setBooking] = useState<Booking | null>(null);
  const [method, setMethod] = useState<"card" | "wallet">("card");
  const [isLoading, setIsLoading] = useState(false);
  const { addNotification } = useNotificationStore();
  const { bookings, updateBookingStatus } = useBookingStore();

  useEffect(() => {
    if (bookingId) {
      const b = bookings.find(x => x.id === bookingId);
      if (b) setBooking(b);
    }
  }, [bookingId, bookings]);

  const handlePayment = async () => {
    if (!booking) return;
    setIsLoading(true);
    try {
      // Fake processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      updateBookingStatus(booking.id, "confirmed");
      addNotification("Payment successful!", "success");
      router.push(`/payment/success?bookingId=${booking.id}`);
    } catch (e) {
      addNotification("Payment failed. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  if (!booking) return <div className="min-h-screen py-20 text-center dark:text-white">Loading payment details...</div>;

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold dark:text-white mb-2">Complete Payment</h1>
          <p className="text-gray-500 dark:text-gray-400">Choose a payment method to confirm your booking</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-8">
          <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-100 dark:border-gray-800">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Amount</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">${booking.totalPrice}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">Booking ID</p>
              <p className="font-medium dark:text-white">#{booking.id}</p>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <label 
              className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${method === 'card' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
            >
              <input type="radio" name="paymentMethod" checked={method === 'card'} onChange={() => setMethod('card')} className="hidden" />
              <CreditCard className={`w-6 h-6 mr-4 ${method === 'card' ? 'text-blue-500' : 'text-gray-400'}`} />
              <div className="flex-1">
                <p className="font-medium dark:text-white">Credit / Debit Card</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Visa, Mastercard, Amex</p>
              </div>
              {method === 'card' && <CheckCircle2 className="w-5 h-5 text-blue-500" />}
            </label>

            <label 
              className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${method === 'wallet' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
            >
              <input type="radio" name="paymentMethod" checked={method === 'wallet'} onChange={() => setMethod('wallet')} className="hidden" />
              <Wallet className={`w-6 h-6 mr-4 ${method === 'wallet' ? 'text-blue-500' : 'text-gray-400'}`} />
              <div className="flex-1">
                <p className="font-medium dark:text-white">E-Wallet</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">PayPal, Apple Pay, Google Pay</p>
              </div>
              {method === 'wallet' && <CheckCircle2 className="w-5 h-5 text-blue-500" />}
            </label>
          </div>

          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-8">
            <ShieldCheck className="w-4 h-4 text-green-500" />
            Your payment is secure and encrypted.
          </div>

          <Button className="w-full py-4 text-lg" onClick={handlePayment} isLoading={isLoading}>
            Pay ${booking.totalPrice.toFixed(2)}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen py-20 text-center dark:text-white">Loading...</div>}>
      <PaymentContent />
    </Suspense>
  );
}
