"use client";

import { TourCard } from "@/components/ui/TourCard";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { api } from "@/lib/api";
import { Tour } from "@/types";
import { Filter, SlidersHorizontal, Search } from "lucide-react";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function ToursContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const initialSearch = searchParams.get("search") || "";
  const initialLocation = searchParams.get("location") || "";
  const initialMaxPrice = Number(searchParams.get("maxPrice")) || 5000;
  const initialMinRating = Number(searchParams.get("minRating")) || 0;

  const [tours, setTours] = useState<Tour[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filters state
  const [search, setSearch] = useState(initialSearch);
  const [location, setLocation] = useState(initialLocation);
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);
  const [minRating, setMinRating] = useState(initialMinRating);

  const fetchTours = async () => {
    setIsLoading(true);
    const data = await api.getTours({ search, location, maxPrice, minRating });
    setTours(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTours();
    
    // Update URL params
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (location) params.set("location", location);
    if (maxPrice < 5000) params.set("maxPrice", maxPrice.toString());
    if (minRating > 0) params.set("minRating", minRating.toString());
    
    const newUrl = params.toString() ? `?${params.toString()}` : "/tours";
    router.replace(newUrl, { scroll: false });
  }, [search, location, maxPrice, minRating]);

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <Breadcrumbs />
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Explore All Tours</h1>
          <p className="text-gray-600 dark:text-gray-400">Find the perfect destination for your next adventure</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="w-full lg:w-64 shrink-0">
            <div className="sticky top-24 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 space-y-6">
              <div className="flex items-center gap-2 font-bold text-lg dark:text-white border-b border-gray-100 dark:border-gray-800 pb-4">
                <Filter className="h-5 w-5" />
                Filters
              </div>
              
              {/* Search Keyword */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Keyword</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input 
                    type="text" 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="e.g. Bali, Beach..."
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                  />
                </div>
              </div>
              
              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Destination</label>
                <select 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                >
                  <option value="">All Destinations</option>
                  <option value="Bali">Bali</option>
                  <option value="Switzerland">Switzerland</option>
                  <option value="Japan">Japan</option>
                </select>
              </div>
              
              {/* Price Range */}
              <div>
                <label className="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <span>Max Price</span>
                  <span className="text-blue-600 dark:text-blue-400 font-bold">${maxPrice}</span>
                </label>
                <input 
                  type="range" 
                  min="0" 
                  max="5000" 
                  step="100"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
              </div>
              
              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Minimum Rating</label>
                <div className="flex flex-col gap-2">
                  {[4.5, 4.0, 3.0].map(rating => (
                    <label key={rating} className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="rating" 
                        checked={minRating === rating}
                        onChange={() => setMinRating(rating)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm dark:text-gray-300">{rating}+ Stars</span>
                    </label>
                  ))}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="rating" 
                      checked={minRating === 0}
                      onChange={() => setMinRating(0)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm dark:text-gray-300">Any Rating</span>
                  </label>
                </div>
              </div>
              
              <button 
                onClick={() => {
                  setSearch("");
                  setLocation("");
                  setMaxPrice(5000);
                  setMinRating(0);
                }}
                className="w-full py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Clear all filters
              </button>
            </div>
          </div>

          {/* Tours Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-800 rounded-2xl aspect-[3/4]"></div>
                ))}
              </div>
            ) : tours.length === 0 ? (
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-12 text-center border border-gray-100 dark:border-gray-800">
                <Search className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold dark:text-white mb-2">No tours found</h3>
                <p className="text-gray-500 dark:text-gray-400">Try adjusting your filters or search criteria.</p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {tours.map((tour) => (
                  <TourCard key={tour.id} tour={tour} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ToursPage() {
  return (
    <Suspense fallback={<div className="min-h-screen py-20 text-center">Loading...</div>}>
      <ToursContent />
    </Suspense>
  );
}
