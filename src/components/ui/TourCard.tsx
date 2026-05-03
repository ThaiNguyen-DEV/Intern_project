"use client";

import Link from 'next/link';
import { Tour } from '@/types';
import { MapPin, Star, Clock, Heart } from 'lucide-react';
import Image from 'next/image';
import { useWishlistStore, useAuthStore, useNotificationStore } from '@/store';

export function TourCard({ tour }: { tour: Tour }) {
  const { wishlist, toggleWishlist } = useWishlistStore();
  const { user } = useAuthStore();
  const { addNotification } = useNotificationStore();

  const isWished = wishlist.includes(tour.id);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      addNotification("Please login to add to wishlist", "info");
      return;
    }
    toggleWishlist(tour.id);
    if (!isWished) {
      addNotification(`Added ${tour.title} to wishlist`, "success");
    }
  };

  return (
    <Link href={`/tours/${tour.id}`} className="block group overflow-hidden rounded-2xl bg-white shadow-md transition-all hover:shadow-xl dark:bg-gray-800">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={tour.images[0]}
          alt={tour.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {tour.isDeal && (
          <div className="absolute top-4 left-4 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white uppercase tracking-wider">
            Sale
          </div>
        )}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <button
            onClick={handleWishlist}
            className={`flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm transition-colors hover:bg-white dark:bg-gray-900/90 dark:hover:bg-gray-900 ${isWished ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}
          >
            <Heart className={`h-4 w-4 ${isWished ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      <div className="p-5">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <MapPin className="mr-1 h-4 w-4 text-blue-500" />
            {tour.location}
          </div>
          <div className="flex items-center text-sm font-medium text-yellow-500">
            <Star className="mr-1 h-4 w-4 fill-current" />
            {tour.rating}
            {tour.reviewsCount && <span className="ml-1 text-gray-400 font-normal">({tour.reviewsCount})</span>}
          </div>
        </div>

        <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white line-clamp-1">
          {tour.title}
        </h3>

        <div className="mb-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
          <Clock className="mr-1 h-4 w-4" />
          {tour.duration}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-4">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 dark:text-gray-400">Starting from</span>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                ${tour.discountPrice || tour.price}
              </span>
              {tour.isDeal && tour.discountPrice && (
                <span className="text-sm text-gray-400 line-through">${tour.price}</span>
              )}
            </div>
          </div>
          <span className="rounded-lg bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            View Details
          </span>
        </div>
      </div>
    </Link>
  );
}
