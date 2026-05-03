"use client";

import { TourCard } from "@/components/ui/TourCard";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { api } from "@/lib/api";
import { Tour } from "@/types";
import { useState, useEffect } from "react";
import { Tag, Clock } from "lucide-react";

export default function DealsPage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDeals = async () => {
      setIsLoading(true);
      const data = await api.getTours({ isDeal: true });
      setTours(data);
      setIsLoading(false);
    };
    fetchDeals();
  }, []);

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <Breadcrumbs />
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-3xl p-8 md:p-12 text-white mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-10">
            <Tag className="w-64 h-64" />
          </div>
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-sm font-bold tracking-wider uppercase mb-6 backdrop-blur-md">
              <Clock className="w-4 h-4" /> Flash Sale Ends Soon
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Exclusive Travel Deals</h1>
            <p className="text-lg text-white/90 mb-8">
              Save up to 40% on selected tours. Don't miss out on these limited-time offers to your dream destinations.
            </p>
          </div>
        </div>

        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Active Promotions ({tours.length})</h2>
        </div>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-800 rounded-2xl aspect-[3/4]"></div>
            ))}
          </div>
        ) : tours.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
            <p className="text-gray-500 dark:text-gray-400">No active deals right now. Check back later!</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {tours.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
