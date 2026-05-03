"use client";

import { useState, useEffect } from "react";
import { useCartStore, useNotificationStore, useAuthStore, useRecentlyViewedStore } from "@/store";
import { Tour } from "@/types";
import { Button } from "@/components/ui/Button";
import { Clock, Calendar, CheckCircle, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

export function TourBookingSidebar({ tour }: { tour: Tour }) {
  const [guests, setGuests] = useState(1);
  const [date, setDate] = useState("");
  const { addToCart } = useCartStore();
  const { addNotification } = useNotificationStore();
  const { user } = useAuthStore();
  const { addTour } = useRecentlyViewedStore();
  const router = useRouter();

  useEffect(() => {
    addTour(tour.id);
  }, [tour.id, addTour]);

  // Simple date constraint
  const today = new Date().toISOString().split("T")[0];

  const handleAddToCart = () => {
    if (!date) {
      addNotification("Please select a date", "warning");
      return;
    }
    
    addToCart({
      id: Math.random().toString(36).substring(2, 9),
      tourId: tour.id,
      tour: tour,
      guests,
      date
    });
    
    addNotification("Added to cart successfully!", "success");
  };

  const handleBookNow = () => {
    if (!date) {
      addNotification("Please select a date", "warning");
      return;
    }
    if (!user) {
      addNotification("Please log in to book", "warning");
      router.push("/login");
      return;
    }
    router.push(`/checkout?tourId=${tour.id}&guests=${guests}&date=${date}`);
  };

  return (
    <div className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-6 border-b border-gray-200 pb-6 dark:border-gray-800">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Price per person</p>
        <div className="flex items-end gap-2">
          <div className="text-4xl font-bold text-gray-900 dark:text-white">
            ${tour.discountPrice || tour.price}
          </div>
          {tour.isDeal && tour.discountPrice && (
            <span className="text-lg text-gray-400 line-through mb-1">${tour.price}</span>
          )}
        </div>
      </div>
      
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
          <input 
            type="date" 
            min={today}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Guests</label>
          <select 
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
              <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="space-y-4 mb-8 text-sm">
        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
          <Clock className="h-4 w-4 text-blue-500" />
          <span>Duration: {tour.duration}</span>
        </div>
        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
          <Calendar className="h-4 w-4 text-blue-500" />
          <span>Available dates: Multiple dates</span>
        </div>
        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
          <CheckCircle className="h-4 w-4 text-blue-500" />
          <span>Free cancellation up to 48 hours</span>
        </div>
      </div>
      
      <div className="flex flex-col gap-3">
        <Button onClick={handleBookNow} className="w-full py-4 text-lg">
          Book Now
        </Button>
        <Button onClick={handleAddToCart} variant="outline" className="w-full py-4 text-lg">
          <ShoppingCart className="w-5 h-5 mr-2" /> Add to Cart
        </Button>
      </div>
    </div>
  );
}
