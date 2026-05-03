import { Compass } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-gray-50 py-12 dark:border-gray-800 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-2 text-xl font-bold text-blue-600 dark:text-blue-400">
              <Compass className="h-6 w-6" />
              <span>TravelGo</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Your trusted partner for unforgettable journeys around the world. We make travel booking easy and secure.
            </p>
          </div>
          
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">Explore</h3>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Destinations</a></li>
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Tours</a></li>
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Special Offers</a></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">Company</h3>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">About Us</a></li>
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Contact</a></li>
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Privacy Policy</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">Newsletter</h3>
            <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
              Subscribe to get special offers and travel inspiration.
            </p>
            <form className="flex gap-2">
              <input 
                type="email" 
                placeholder="Email address" 
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800"
              />
              <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        <div className="mt-8 border-t border-gray-200 pt-8 text-center text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400">
          © {new Date().getFullYear()} TravelGo. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
