"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Tour } from "@/types";
import { Search, Plus, Edit2, Trash2, Eye, Filter } from "lucide-react";
import Link from "next/link";
import { useNotificationStore } from "@/store";
import Image from "next/image";

export default function AdminToursPage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [search, setSearch] = useState("");
  const [filterDest, setFilterDest] = useState("");
  const [filterPromo, setFilterPromo] = useState("");
  const { addNotification } = useNotificationStore();

  const loadTours = async () => {
    const data = await api.getTours();
    setTours(data);
  };

  useEffect(() => {
    loadTours();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this tour?")) {
      // In a real app, call api.deleteTour(id)
      setTours(tours.filter(t => t.id !== id));
      addNotification("Tour deleted successfully", "success");
    }
  };

  const destinations = Array.from(new Set(tours.map(t => t.location)));

  const filteredTours = tours.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) || t.location.toLowerCase().includes(search.toLowerCase());
    const matchDest = filterDest ? t.location === filterDest : true;
    const matchPromo = filterPromo === "promo" ? t.isDeal : filterPromo === "regular" ? !t.isDeal : true;
    return matchSearch && matchDest && matchPromo;
  });

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold dark:text-white">Tours Management</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage your travel tours and packages</p>
        </div>
        <Link 
          href="/admin/tours/new"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add New Tour
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search tours by title or destination..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex gap-4">
            <div className="relative flex items-center">
              <Filter className="absolute left-3 h-4 w-4 text-gray-400" />
              <select 
                value={filterDest}
                onChange={(e) => setFilterDest(e.target.value)}
                className="pl-9 pr-8 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                <option value="">All Destinations</option>
                {destinations.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            
            <select 
              value={filterPromo}
              onChange={(e) => setFilterPromo(e.target.value)}
              className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              <option value="promo">Promotions Only</option>
              <option value="regular">Regular Only</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
            <thead className="bg-gray-50 dark:bg-gray-800/50 text-xs uppercase text-gray-700 dark:text-gray-300">
              <tr>
                <th className="px-6 py-4">Tour</th>
                <th className="px-6 py-4">Destination</th>
                <th className="px-6 py-4">Duration</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredTours.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">No tours found</td>
                </tr>
              ) : (
                filteredTours.map((tour) => (
                  <tr key={tour.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                          <Image src={tour.images[0] || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800"} alt={tour.title} fill className="object-cover" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 dark:text-white line-clamp-1">{tour.title}</div>
                          {tour.isDeal && (
                            <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold bg-red-100 text-red-600 rounded-sm uppercase tracking-wider">Promotion</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{tour.location}</td>
                    <td className="px-6 py-4">{tour.duration}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 dark:text-white">
                        ${tour.discountPrice || tour.price}
                      </div>
                      {tour.isDeal && tour.discountPrice && (
                        <div className="text-xs text-gray-400 line-through">${tour.price}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={`/tours/${tour.id}`} target="_blank" className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link href={`/admin/tours/${tour.id}`} className="p-2 text-gray-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button onClick={() => handleDelete(tour.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
