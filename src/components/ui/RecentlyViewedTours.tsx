"use client";

import { useRecentlyViewedStore } from "@/store";
import { useEffect, useState } from "react";
import { Tour } from "@/types";
import { api } from "@/lib/api";
import { TourCard } from "./TourCard";
import { History } from "lucide-react";

export function RecentlyViewedTours() {
  const { viewedTourIds } = useRecentlyViewedStore();
  const [tours, setTours] = useState<Tour[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (viewedTourIds.length > 0) {
      Promise.all(viewedTourIds.map(id => api.getTourById(id)))
        .then(results => {
          setTours(results.filter((t): t is Tour => t !== undefined));
        });
    }
  }, [viewedTourIds]);

  if (!isClient || tours.length === 0) return null;

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 mb-8">
          <History className="w-6 h-6 text-blue-500" />
          <h2 className="text-3xl font-bold dark:text-white">Recently Viewed</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {tours.map(tour => (
            <TourCard key={`recent-${tour.id}`} tour={tour} />
          ))}
        </div>
      </div>
    </section>
  );
}
