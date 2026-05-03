import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { MapPin, Star, Clock, Calendar, CheckCircle, MessageSquare } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TourBookingSidebar } from "@/components/ui/TourBookingSidebar";

export default async function TourDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const tour = await api.getTourById(resolvedParams.id);
  const reviews = await api.getReviewsByTourId(resolvedParams.id);
  
  if (!tour) {
    notFound();
  }

  return (
    <div className="bg-white dark:bg-gray-950 pb-20">
      {/* Hero Image */}
      <div className="relative h-[50vh] min-h-[400px] w-full">
        <Image 
          src={tour.images[0]} 
          alt={tour.title} 
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full p-8 text-white container mx-auto">
          <div className="mb-4 flex items-center gap-4 text-sm font-medium">
            <span className="flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 backdrop-blur-md">
              <MapPin className="h-4 w-4" /> {tour.location}
            </span>
            <span className="flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 backdrop-blur-md">
              <Star className="h-4 w-4 text-yellow-400 fill-current" /> {tour.rating}
              {tour.reviewsCount && ` (${tour.reviewsCount} reviews)`}
            </span>
          </div>
          <h1 className="text-4xl font-bold md:text-5xl lg:text-6xl max-w-4xl">{tour.title}</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-12">
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-4 dark:text-white">Overview</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed text-lg">
              {tour.description}
            </p>
            
            <h2 className="text-2xl font-bold mb-6 dark:text-white">Itinerary</h2>
            <div className="space-y-6 mb-12">
              {tour.itinerary.map((item) => (
                <div key={item.day} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold dark:bg-blue-900/50 dark:text-blue-400 z-10">
                      {item.day}
                    </div>
                    <div className="w-0.5 h-full bg-gray-200 dark:bg-gray-800 -mt-2"></div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 flex-1 shadow-sm border border-gray-100 dark:border-gray-800">
                    <h3 className="font-bold text-lg mb-2 dark:text-white">Day {item.day}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{item.activity}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Map Section */}
            <h2 className="text-2xl font-bold mb-6 dark:text-white flex items-center gap-2">
              <MapPin className="h-6 w-6 text-blue-500" />
              Location Map
            </h2>
            <div className="w-full h-[400px] rounded-2xl overflow-hidden mb-12 shadow-sm border border-gray-100 dark:border-gray-800">
              <iframe 
                width="100%" 
                height="100%" 
                frameBorder="0" 
                style={{ border: 0 }} 
                src={`https://maps.google.com/maps?q=${encodeURIComponent(tour.location)}&t=&z=13&ie=UTF8&iwloc=&output=embed`} 
                allowFullScreen
              ></iframe>
            </div>

            {/* Reviews Section */}
            <h2 className="text-2xl font-bold mb-6 dark:text-white flex items-center gap-2">
              <MessageSquare className="h-6 w-6 text-blue-500" />
              Guest Reviews
            </h2>
            
            <div className="space-y-6 mb-8">
              {reviews.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">No reviews yet. Be the first to review this tour!</p>
              ) : (
                reviews.map((review) => (
                  <div key={review.id} className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                          {review.userName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold dark:text-white">{review.userName}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{review.date}</p>
                        </div>
                      </div>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-700'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">{review.comment}</p>
                  </div>
                ))
              )}
            </div>

            {/* Simple Add Review Button for UI demonstration */}
            <Button variant="outline" className="w-full sm:w-auto">Write a Review</Button>
          </div>
          
          {/* Sidebar */}
          <div>
            <TourBookingSidebar tour={tour} />
          </div>
        </div>
      </div>
    </div>
  );
}
