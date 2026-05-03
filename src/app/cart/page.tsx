"use client";

import { useCartStore, useNotificationStore, useAuthStore } from "@/store";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import Image from "next/image";
import { Trash2, ShoppingCart, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart } = useCartStore();
  const { addNotification } = useNotificationStore();
  const { user } = useAuthStore();
  const router = useRouter();

  const handleCheckout = () => {
    if (!user) {
      addNotification("Please log in to proceed to checkout", "warning");
      router.push("/login");
      return;
    }
    // We can proceed to a multi-item checkout or pass the first item. 
    // Since the system handles single-tour checkout currently, let's redirect to checkout with the first item's ID.
    // In a real app, you'd have a unified checkout for multiple items.
    if (items.length > 0) {
      router.push(`/checkout?tourId=${items[0].tourId}&guests=${items[0].guests}&date=${items[0].date}`);
    }
  };

  const totalPrice = items.reduce((sum, item) => sum + (item.tour.discountPrice || item.tour.price) * item.guests, 0);

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Your Cart</h1>
        
        {items.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-12 text-center border border-gray-100 dark:border-gray-800 shadow-sm">
            <ShoppingCart className="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600 mb-6" />
            <h2 className="text-2xl font-bold dark:text-white mb-4">Your cart is empty</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Looks like you haven't added any tours to your cart yet. Discover your next adventure!
            </p>
            <Link href="/tours">
              <Button size="lg">Explore Tours</Button>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {items.map((item) => (
                <div key={item.id} className="bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row gap-6">
                  <div className="relative w-full sm:w-48 h-32 rounded-xl overflow-hidden shrink-0">
                    <Image src={item.tour.images[0]} alt={item.tour.title} fill className="object-cover" />
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-bold dark:text-white line-clamp-1">{item.tour.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{item.tour.location} • {item.date}</p>
                      </div>
                      <button 
                        onClick={() => {
                          removeFromCart(item.id);
                          addNotification("Item removed from cart", "info");
                        }}
                        className="text-red-500 hover:text-red-600 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-3">
                        <label className="text-sm font-medium dark:text-gray-300">Guests:</label>
                        <select 
                          value={item.guests} 
                          onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                          className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1 text-sm dark:text-white"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                            <option key={num} value={num}>{num}</option>
                          ))}
                        </select>
                      </div>
                      <div className="text-lg font-bold dark:text-white">
                        ${(item.tour.discountPrice || item.tour.price) * item.guests}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex justify-end">
                <button 
                  onClick={() => {
                    clearCart();
                    addNotification("Cart cleared", "info");
                  }}
                  className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white"
                >
                  Clear all items
                </button>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 sticky top-24">
                <h3 className="text-lg font-bold dark:text-white mb-6">Order Summary</h3>
                
                <div className="space-y-4 mb-6 border-b border-gray-100 dark:border-gray-800 pb-6">
                  {items.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400 max-w-[200px] truncate">{item.tour.title} (x{item.guests})</span>
                      <span className="font-medium dark:text-gray-200">${(item.tour.discountPrice || item.tour.price) * item.guests}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between items-center mb-8">
                  <span className="text-lg font-bold dark:text-white">Total</span>
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">${totalPrice}</span>
                </div>
                
                <Button onClick={handleCheckout} className="w-full py-4" size="lg">
                  Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
