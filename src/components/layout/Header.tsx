"use client";

import Link from 'next/link';
import { useAuthStore, useThemeStore, useCartStore, useWishlistStore } from '@/store';
import { Button } from '../ui/Button';
import { Compass, User, LogOut, Search, Moon, Sun, Heart, ShoppingCart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function Header() {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const { items: cartItems } = useCartStore();
  const { wishlist } = useWishlistStore();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/tours?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-blue-600 dark:text-blue-400">
          <Compass className="h-6 w-6" />
          <span className="hidden sm:inline">TravelGo</span>
        </Link>
        
        <div className="flex-1 max-w-md px-4 mx-4 hidden md:block">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search destinations, tours..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </form>
        </div>

        <nav className="hidden lg:flex items-center gap-6 mr-6">
          <Link href="/tours" className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400">Tours</Link>
          <Link href="/deals" className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400">Deals</Link>
          <Link href="/blog" className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400">Blog</Link>
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300">
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          
          <Link href="/cart" className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300">
            <ShoppingCart className="h-5 w-5" />
            {isClient && cartItems.length > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-blue-600 rounded-full">
                {cartItems.length}
              </span>
            )}
          </Link>

          {user && (
            <Link href="/wishlist" className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300">
              <Heart className="h-5 w-5" />
              {isClient && wishlist.length > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full">
                  {wishlist.length}
                </span>
              )}
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-2 sm:gap-4">
              <Link href={user.role === 'admin' ? '/admin' : '/profile'} className="flex items-center gap-2 text-sm font-medium">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400">
                  <User className="h-4 w-4" />
                </div>
                <span className="hidden sm:inline">{user.name}</span>
              </Link>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">Log in</Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="hidden sm:inline-flex">Sign up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
