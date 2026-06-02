"use client";

import { useState } from "react";
import Image from "next/image";
import { Image as ImageIcon, X, ChevronLeft, ChevronRight } from "lucide-react";

export function TourGallery({ images }: { images: string[] }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (!images || images.length <= 1) return null;

  return (
    <>
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 dark:text-white flex items-center gap-2">
          <ImageIcon className="h-6 w-6 text-blue-500" />
          Tour Gallery
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-[400px]">
          {/* First image spans 2 rows and 2 cols */}
          <div 
            className="col-span-2 row-span-2 relative rounded-2xl overflow-hidden group cursor-pointer"
            onClick={() => setSelectedIndex(images.length > 1 ? 1 : 0)}
          >
            <Image src={images[1] || images[0]} alt="Gallery 1" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
          </div>
          {/* Next 4 images */}
          {images.slice(2, 6).map((img, idx) => (
            <div 
              key={idx + 2} 
              className="relative rounded-2xl overflow-hidden group cursor-pointer"
              onClick={() => setSelectedIndex(idx + 2)}
            >
              <Image src={img} alt={`Gallery ${idx + 2}`} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedIndex !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm" onClick={() => setSelectedIndex(null)}>
          <button 
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10"
            onClick={() => setSelectedIndex(null)}
          >
            <X className="w-6 h-6" />
          </button>
          
          {/* Prev Button */}
          <button 
            className="absolute left-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedIndex((prev) => prev !== null ? (prev === 0 ? images.length - 1 : prev - 1) : null);
            }}
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          {/* Next Button */}
          <button 
            className="absolute right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedIndex((prev) => prev !== null ? (prev === images.length - 1 ? 0 : prev + 1) : null);
            }}
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          <div className="relative w-full max-w-5xl h-[80vh]" onClick={(e) => e.stopPropagation()}>
            <Image 
              src={images[selectedIndex]} 
              alt="Expanded Gallery Image" 
              fill 
              className="object-contain" 
            />
          </div>
        </div>
      )}
    </>
  );
}
