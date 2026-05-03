"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useNotificationStore } from "@/store";
import { ChevronLeft, Save, Plus, Trash2, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";
import { use } from "react";

export default function AdminEditTourPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { addNotification } = useNotificationStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    duration: "",
    price: "",
    discountPrice: "",
    description: "",
    isDeal: false,
    maxGuests: 10,
    rating: 5.0,
  });

  const [itinerary, setItinerary] = useState([{ day: 1, activity: "" }]);

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const tour = await api.getTourById(resolvedParams.id);
        if (tour) {
          setFormData({
            title: tour.title,
            location: tour.location,
            duration: tour.duration,
            price: tour.price.toString(),
            discountPrice: tour.discountPrice?.toString() || "",
            description: tour.description,
            isDeal: tour.isDeal || false,
            maxGuests: 10,
            rating: tour.rating,
          });
          setItinerary(tour.itinerary.length ? tour.itinerary : [{ day: 1, activity: "" }]);
        }
      } catch (error) {
        addNotification("Failed to load tour details", "error");
      } finally {
        setIsFetching(false);
      }
    };
    fetchTour();
  }, [resolvedParams.id, addNotification]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleItineraryChange = (index: number, activity: string) => {
    const newItinerary = [...itinerary];
    newItinerary[index].activity = activity;
    setItinerary(newItinerary);
  };

  const addDay = () => {
    setItinerary(prev => [...prev, { day: prev.length + 1, activity: "" }]);
  };

  const removeDay = (index: number) => {
    if (itinerary.length > 1) {
      setItinerary(prev => {
        const newItin = prev.filter((_, i) => i !== index);
        return newItin.map((item, i) => ({ ...item, day: i + 1 }));
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      addNotification("Tour updated successfully!", "success");
      router.push("/admin/tours");
    } catch (error) {
      addNotification("Failed to update tour", "error");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex items-center gap-4">
        <Link href="/admin/tours" className="p-2 border border-gray-200 dark:border-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <ChevronLeft className="w-5 h-5 dark:text-gray-300" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold dark:text-white">Edit Tour</h1>
          <p className="text-gray-500 dark:text-gray-400">Update travel package details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid md:grid-cols-3 gap-8">
          
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 space-y-6">
              <h2 className="text-xl font-bold dark:text-white border-b border-gray-100 dark:border-gray-800 pb-4">Basic Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tour Title *</label>
                  <input required name="title" value={formData.title} onChange={handleChange} type="text" className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Destination *</label>
                    <input required name="location" value={formData.location} onChange={handleChange} type="text" className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duration *</label>
                    <input required name="duration" value={formData.duration} onChange={handleChange} type="text" className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description *</label>
                  <textarea required name="description" value={formData.description} onChange={handleChange} rows={5} className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 space-y-6">
              <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-4">
                <h2 className="text-xl font-bold dark:text-white">Itinerary</h2>
                <button type="button" onClick={addDay} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium">
                  <Plus className="w-4 h-4" /> Add Day
                </button>
              </div>
              
              <div className="space-y-4">
                {itinerary.map((item, index) => (
                  <div key={index} className="flex gap-4 items-start bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
                    <div className="w-16 flex-shrink-0 font-bold text-gray-500 pt-2">Day {item.day}</div>
                    <textarea 
                      value={item.activity}
                      onChange={(e) => handleItineraryChange(index, e.target.value)}
                      className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white min-h-[80px]"
                    />
                    <button type="button" onClick={() => removeDay(index)} disabled={itinerary.length === 1} className="p-2 text-gray-400 hover:text-red-500 disabled:opacity-50">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 space-y-6">
              <h2 className="text-xl font-bold dark:text-white border-b border-gray-100 dark:border-gray-800 pb-4">Pricing & Promotion</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Regular Price ($) *</label>
                  <input required name="price" value={formData.price} onChange={handleChange} type="number" min="0" step="0.01" className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
                </div>
                
                <label className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                  <input type="checkbox" name="isDeal" checked={formData.isDeal} onChange={handleChange} className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="font-medium dark:text-white">Is this a Promotion?</span>
                </label>

                {formData.isDeal && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Discount Price ($)</label>
                    <input name="discountPrice" value={formData.discountPrice} onChange={handleChange} type="number" min="0" step="0.01" className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Max Guests Limit</label>
                  <input name="maxGuests" value={formData.maxGuests} onChange={handleChange} type="number" min="1" className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 space-y-6">
              <h2 className="text-xl font-bold dark:text-white border-b border-gray-100 dark:border-gray-800 pb-4">Media</h2>
              
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-8 text-center hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer flex flex-col items-center justify-center">
                <ImageIcon className="w-10 h-10 text-gray-400 mb-2" />
                <p className="text-sm font-medium dark:text-white mb-1">Click to change images</p>
              </div>
            </div>

            <div className="pt-4">
              <Button type="submit" className="w-full py-4 text-lg" isLoading={isLoading}>
                <Save className="w-5 h-5 mr-2" />
                Update Tour
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
