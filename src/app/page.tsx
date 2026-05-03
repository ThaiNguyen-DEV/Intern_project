import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { TourCard } from "@/components/ui/TourCard";
import { RecentlyViewedTours } from "@/components/ui/RecentlyViewedTours";
import { api } from "@/lib/api";
import { Search } from "lucide-react";

export default async function Home() {
  const tours = await api.getTours();
  const featuredTours = tours.slice(0, 3);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] w-full">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800')" }}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>
        
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center text-white">
          <h1 className="mb-6 text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
            Discover Your Next <span className="text-blue-400">Adventure</span>
          </h1>
          <p className="mb-10 max-w-2xl text-lg sm:text-xl text-gray-200">
            Explore the world's most beautiful destinations with our curated tours. 
            Book your dream vacation today and create memories that last a lifetime.
          </p>
          
          <div className="flex w-full max-w-3xl flex-col gap-4 sm:flex-row p-2 bg-white/10 backdrop-blur-md rounded-2xl">
            <div className="flex-1 bg-white rounded-xl overflow-hidden flex items-center px-4">
              <Search className="h-5 w-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Where do you want to go?" 
                className="w-full bg-transparent px-4 py-3 text-gray-900 focus:outline-none placeholder-gray-500"
              />
            </div>
            <Link href="/tours">
              <Button size="lg" className="w-full sm:w-auto py-3 px-8 text-lg rounded-xl">
                Search Tours
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Tours Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">Featured Destinations</h2>
            <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-400">
              Hand-picked tours to some of the most stunning locations around the globe.
            </p>
          </div>
          
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {featuredTours.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link href="/tours">
              <Button variant="outline" size="lg">
                View All Tours
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Recently Viewed */}
      <RecentlyViewedTours />
      
      {/* Why Choose Us */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mb-4 text-xl font-bold dark:text-white">Worldwide Coverage</h3>
              <p className="text-gray-600 dark:text-gray-400">Access to thousands of destinations and exclusive experiences across the globe.</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="mb-4 text-xl font-bold dark:text-white">Secure Booking</h3>
              <p className="text-gray-600 dark:text-gray-400">Safe and secure payment processing with flexible cancellation policies.</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h3 className="mb-4 text-xl font-bold dark:text-white">Best Reviews</h3>
              <p className="text-gray-600 dark:text-gray-400">Trusted by millions of travelers worldwide with a 4.9/5 average rating.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
