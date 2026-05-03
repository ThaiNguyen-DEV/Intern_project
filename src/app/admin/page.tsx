"use client";

import { useAuthStore, useBookingStore, useNotificationStore } from "@/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Booking } from "@/types";
import { Search, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', revenue: 4000 },
  { name: 'Feb', revenue: 3000 },
  { name: 'Mar', revenue: 5000 },
  { name: 'Apr', revenue: 4500 },
  { name: 'May', revenue: 6000 },
  { name: 'Jun', revenue: 7000 },
];

export default function AdminPage() {
  const { user } = useAuthStore();
  const { bookings, updateBookingStatus } = useBookingStore();
  const { addNotification } = useNotificationStore();
  const router = useRouter();
  
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (!user || user.role !== "admin") {
      router.push("/");
    }
  }, [user, router]);

  if (!isClient || !user || user.role !== "admin") return null;

  const filteredBookings = bookings.filter(b => 
    b.customerDetails.name.toLowerCase().includes(search.toLowerCase()) || 
    b.id.toLowerCase().includes(search.toLowerCase())
  ).reverse();
  
  const totalPages = Math.max(1, Math.ceil(filteredBookings.length / itemsPerPage));
  const currentBookings = filteredBookings.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleStatusChange = (id: string, status: Booking['status']) => {
    updateBookingStatus(id, status);
    addNotification(`Booking #${id} status updated to ${status}`, "success");
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this booking?")) {
      updateBookingStatus(id, "cancelled");
      addNotification("Booking cancelled", "info");
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold dark:text-white">Admin Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400">Manage bookings, revenue, and tours</p>
      </div>
      
      {/* Stats & Charts */}
      <div className="grid lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
          <h2 className="text-xl font-bold dark:text-white mb-6">Revenue Overview</h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#3b82f6', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">Total Bookings</h3>
            <p className="text-4xl font-bold text-gray-900 dark:text-white">{bookings.length}</p>
            <p className="text-sm text-green-500 mt-2 flex items-center">
              +12% from last month
            </p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">Total Revenue</h3>
            <p className="text-4xl font-bold text-gray-900 dark:text-white">
              ${bookings.reduce((sum, b) => sum + b.totalPrice, 0).toLocaleString()}
            </p>
            <p className="text-sm text-green-500 mt-2 flex items-center">
              +8% from last month
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-xl font-bold dark:text-white">Manage Bookings</h2>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by ID or name..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
            <thead className="bg-gray-50 dark:bg-gray-800/50 text-xs uppercase text-gray-700 dark:text-gray-300">
              <tr>
                <th className="px-6 py-4">Booking ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Tour</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {currentBookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">No bookings found</td>
                </tr>
              ) : (
                currentBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium dark:text-white">#{booking.id}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium dark:text-white">{booking.customerDetails.name}</div>
                      <div className="text-xs">{booking.customerDetails.email}</div>
                    </td>
                    <td className="px-6 py-4 truncate max-w-[150px]">{booking.tourTitle || `Tour: ${booking.tourId}`}</td>
                    <td className="px-6 py-4">{booking.date}</td>
                    <td className="px-6 py-4 font-medium dark:text-white">${booking.totalPrice.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <select 
                        value={booking.status}
                        onChange={(e) => handleStatusChange(booking.id, e.target.value as Booking['status'])}
                        className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border-none outline-none cursor-pointer appearance-none ${
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                          'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}
                      >
                        <option value="pending">PENDING</option>
                        <option value="confirmed">CONFIRMED</option>
                        <option value="cancelled">CANCELLED</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => handleDelete(booking.id)} className="text-red-500 hover:text-red-700 p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Showing {((page - 1) * itemsPerPage) + 1} to {Math.min(page * itemsPerPage, filteredBookings.length)} of {filteredBookings.length} entries
            </span>
            <div className="flex gap-2">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
