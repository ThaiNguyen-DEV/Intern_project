"use client";

import { useAuthStore, useBookingStore, useNotificationStore } from "@/store";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { MapPin, Calendar, Users, DollarSign, Settings, Lock, X } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuthStore();
  const { bookings } = useBookingStore();
  const { addNotification } = useNotificationStore();
  const router = useRouter();
  
  // Use a client-side flag to prevent hydration mismatch since bookings come from localStorage
  const [isClient, setIsClient] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      addNotification("Password changed successfully", "success");
      setIsPasswordModalOpen(false);
    }, 500);
  };

  useEffect(() => {
    setIsClient(true);
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  const userBookings = useMemo(() => {
    if (!user) return [];
    return bookings.filter(b => b.userId === user.id).reverse();
  }, [bookings, user]);

  if (!isClient || !user) return null;

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm p-8 mb-8 border border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="h-24 w-24 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-3xl font-bold dark:bg-blue-900/50 dark:text-blue-400">
              {user.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-3xl font-bold dark:text-white">{user.name}</h1>
              <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{user.phone}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-gray-100 dark:bg-gray-800 text-sm rounded-full capitalize text-gray-700 dark:text-gray-300">
                {user.role} Account
              </span>
            </div>
          </div>
          <div>
            <button 
              onClick={() => setIsPasswordModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl transition-colors"
            >
              <Settings className="w-4 h-4" />
              Change Password
            </button>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-6 dark:text-white">My Bookings</h2>
        
        {userBookings.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <h3 className="text-xl font-bold mb-2 dark:text-white">No bookings yet</h3>
            <p className="text-gray-500 dark:text-gray-400">You haven't booked any tours yet. Start exploring!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {userBookings.map((booking) => (
              <div key={booking.id} className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold dark:text-white mb-1">{booking.tourTitle || `Tour ID: ${booking.tourId}`}</h3>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {booking.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 flex items-center"><Calendar className="h-3 w-3 mr-1" /> Date</p>
                      <p className="font-medium dark:text-white">{booking.date}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 flex items-center"><Users className="h-3 w-3 mr-1" /> Guests</p>
                      <p className="font-medium dark:text-white">{booking.guests}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 flex items-center"><DollarSign className="h-3 w-3 mr-1" /> Total</p>
                      <p className="font-medium dark:text-white">${booking.totalPrice.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Booking ID</p>
                      <p className="font-medium dark:text-white truncate">#{booking.id}</p>
                    </div>
                  </div>
                  
                  {booking.status === 'pending' && (
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 text-right">
                       <button 
                         onClick={() => router.push(`/payment?bookingId=${booking.id}`)}
                         className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                       >
                         Complete Payment &rarr;
                       </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Change Password Modal */}
        {isPasswordModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
              <button 
                onClick={() => setIsPasswordModalOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="flex justify-center mb-4">
                <Lock className="w-12 h-12 text-blue-500" />
              </div>
              
              <h2 className="text-2xl font-bold text-center mb-6 dark:text-white">Change Password</h2>
              
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
                  <input type="password" required className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                  <input type="password" required minLength={8} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
                  <input type="password" required minLength={8} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
                </div>
                
                <div className="pt-4 flex gap-4">
                  <button 
                    type="button" 
                    onClick={() => setIsPasswordModalOpen(false)}
                    className="flex-1 py-2 rounded-xl border border-gray-200 font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-2 rounded-xl bg-blue-600 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
