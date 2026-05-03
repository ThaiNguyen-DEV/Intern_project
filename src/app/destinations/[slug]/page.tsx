"use client";

import { TourCard } from "@/components/ui/TourCard";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { api } from "@/lib/api";
import { Tour } from "@/types";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

const destinationInfo: Record<string, { title: string, desc: string, image: string }> = {
  bali: {
    title: "Bali, Indonesia",
    desc: "Discover the Island of the Gods with its varied landscape of hills and mountains, rugged coastlines and sandy beaches, lush rice terraces and barren volcanic hillsides.",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4"
  },
  switzerland: {
    title: "Switzerland",
    desc: "Experience the majestic Alps, pristine lakes, and charming villages. A paradise for nature lovers and adventure seekers alike.",
    image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99"
  },
  tokyo: {
    title: "Tokyo, Japan",
    desc: "Dive into a mesmerizing mix of the ultramodern and the traditional, from neon-lit skyscrapers to historic temples.",
    image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26"
  }
};

export default function DestinationPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [tours, setTours] = useState<Tour[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const info = destinationInfo[slug] || {
    title: slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    desc: "Explore the best tours and experiences in this amazing destination.",
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800"
  };

  useEffect(() => {
    const fetchTours = async () => {
      setIsLoading(true);
      const data = await api.getTours({ destinationSlug: slug });
      setTours(data);
      setIsLoading(false);
    };
    fetchTours();
  }, [slug]);

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen pb-12">
      {/* Banner */}
      <div className="relative h-[40vh] min-h-[300px] w-full mb-8">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${info.image}')` }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-end pb-12">
          <Breadcrumbs />
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{info.title}</h1>
          <p className="text-lg text-gray-200 max-w-2xl">{info.desc}</p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Tours in {info.title}</h2>
        </div>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-800 rounded-2xl aspect-[3/4]"></div>
            ))}
          </div>
        ) : tours.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
            <p className="text-gray-500 dark:text-gray-400">No tours available for this destination yet.</p>
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
