import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import Image from "next/image";
import { CheckCircle2, Users, Globe2, ShieldCheck } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-white dark:bg-gray-950 pb-20">
      <div className="relative h-[40vh] min-h-[300px] w-full mb-12">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f')" }}
        >
          <div className="absolute inset-0 bg-black/60" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-end pb-12">
          <Breadcrumbs />
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">About TravelGo</h1>
          <p className="text-lg text-gray-200 max-w-2xl">
            We're on a mission to make exploring the world easy, accessible, and unforgettable for everyone.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
              <p>
                Founded in 2023, TravelGo started with a simple idea: booking a tour should be as exciting as the trip itself. 
                We noticed that travelers often felt overwhelmed by the countless options and hidden fees across different platforms.
              </p>
              <p>
                Today, we've partnered with hundreds of local guides and tour operators worldwide to bring you curated, 
                high-quality experiences at transparent prices.
              </p>
            </div>
          </div>
          <div className="relative h-96 rounded-3xl overflow-hidden shadow-xl">
            <Image 
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4" 
              alt="Our Team" 
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div className="mb-20 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12">Why Choose Us</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-2xl">
              <Globe2 className="h-10 w-10 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold dark:text-white mb-2">Global Reach</h3>
              <p className="text-gray-500 dark:text-gray-400">Tours available in over 50 countries worldwide.</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-2xl">
              <ShieldCheck className="h-10 w-10 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold dark:text-white mb-2">Secure Booking</h3>
              <p className="text-gray-500 dark:text-gray-400">Bank-level security for all your transactions.</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-2xl">
              <CheckCircle2 className="h-10 w-10 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold dark:text-white mb-2">Verified Guides</h3>
              <p className="text-gray-500 dark:text-gray-400">Every tour operator is strictly vetted by our team.</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-2xl">
              <Users className="h-10 w-10 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold dark:text-white mb-2">24/7 Support</h3>
              <p className="text-gray-500 dark:text-gray-400">Our customer success team is always here for you.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
