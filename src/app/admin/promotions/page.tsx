"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Tour } from "@/types";
import { Search, Edit2, Trash2, Tag, Percent } from "lucide-react";
import { useNotificationStore } from "@/store";
import Image from "next/image";

export default function AdminPromotionsPage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [search, setSearch] = useState("");
  const { addNotification } = useNotificationStore();

  const loadTours = async () => {
    const data = await api.getTours();
    setTours(data.filter(t => t.isDeal));
  };

  useEffect(() => {
    loadTours();
  }, []);

  const handleRemovePromotion = async (id: string) => {
    if (confirm("Are you sure you want to remove promotion from this tour?")) {
      setTours(tours.filter(t => t.id !== id));
      addNotification("Promotion removed successfully", "success");
    }
  };

  const filteredTours = tours.filter(t => 
    t.title.toLowerCase().includes(search.toLowerCase()) || 
    t.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold dark:text-white">Promotions Management</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage flash sales and promotional tours</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-red-500 to-rose-600 rounded-3xl p-6 text-white shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-red-100">Active Deals</h3>
            <div className="p-2 bg-white/20 rounded-xl">
              <Tag className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-4xl font-bold">{tours.length}</p>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl p-6 text-white shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-amber-100">Avg. Discount</h3>
            <div className="p-2 bg-white/20 rounded-xl">
              <Percent className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-4xl font-bold">
            {tours.length > 0 ? 
              Math.round(tours.reduce((acc, t) => acc + (1 - (t.discountPrice || t.price)/t.price)*100, 0) / tours.length) 
              : 0}%
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search promoted tours..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
            <thead className="bg-gray-50 dark:bg-gray-800/50 text-xs uppercase text-gray-700 dark:text-gray-300">
              <tr>
                <th className="px-6 py-4">Tour</th>
                <th className="px-6 py-4">Original Price</th>
                <th className="px-6 py-4">Sale Price</th>
                <th className="px-6 py-4">Discount</th>
                <th className="px-6 py-4">Badge</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredTours.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">No promotions active</td>
                </tr>
              ) : (
                filteredTours.map((tour) => {
                  const discountPct = Math.round((1 - (tour.discountPrice || tour.price) / tour.price) * 100);
                  return (
                    <tr key={tour.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                            <Image src={tour.images[0] || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800"} alt={tour.title} fill className="object-cover" />
                          </div>
                          <div>
                            <div className="font-bold text-gray-900 dark:text-white line-clamp-1">{tour.title}</div>
                            <div className="text-xs text-gray-500">{tour.location}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 line-through text-gray-400">${tour.price}</td>
                      <td className="px-6 py-4 font-bold text-red-500">${tour.discountPrice}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded-md font-bold text-xs">
                          {discountPct}% OFF
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full font-bold text-xs uppercase tracking-wider">
                          Flash Sale
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 text-gray-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleRemovePromotion(tour.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
