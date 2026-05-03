"use client";

import { useWishlistStore } from "@/store";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Tour } from "@/types";
import { TourCard } from "@/components/ui/TourCard";
import { HeartCrack } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function WishlistPage() {
  const { wishlist } = useWishlistStore();
  const [tours, setTours] = useState<Tour[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      setIsLoading(true);
      const allTours = await api.getTours();
      setTours(allTours.filter(t => wishlist.includes(t.id)));
      setIsLoading(false);
    };
    fetchWishlist();
  }, [wishlist]);

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">My Wishlist</h1>
        
        {isLoading ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-800 rounded-2xl aspect-[3/4]"></div>
            ))}
          </div>
        ) : tours.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-24 w-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
              <HeartCrack className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mb-8">
              Looks like you haven't added any tours to your wishlist yet. Explore our destinations and find your next adventure!
            </p>
            <Link href="/tours">
              <Button size="lg">Explore Tours</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {tours.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
