"use client";

import { useState } from "react";
import { Search, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function HeroSearch() {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location) params.append("search", location);
    if (date) params.append("date", date);
    
    router.push(`/tours?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="flex w-full max-w-4xl flex-col gap-4 sm:flex-row p-2 bg-white/10 backdrop-blur-md rounded-2xl">
      <div className="flex-1 bg-white rounded-xl overflow-hidden flex items-center px-4">
        <Search className="h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Where do you want to go?"
          className="w-full bg-transparent px-4 py-3 text-gray-900 focus:outline-none placeholder-gray-500"
        />
      </div>
      
      <div className="sm:w-48 bg-white rounded-xl overflow-hidden flex items-center px-4">
        <Calendar className="h-5 w-5 text-gray-400" />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          min={new Date().toISOString().split("T")[0]}
          className="w-full bg-transparent px-2 py-3 text-gray-900 focus:outline-none"
        />
      </div>

      <Button type="submit" size="lg" className="w-full sm:w-auto py-3 px-8 text-lg rounded-xl">
        Search Tours
      </Button>
    </form>
  );
}
