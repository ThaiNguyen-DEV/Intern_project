"use client";

import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { api } from "@/lib/api";
import { BlogPost } from "@/types";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, User } from "lucide-react";

export default function BlogListPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      setIsLoading(true);
      const data = await api.getBlogs();
      setBlogs(data);
      setIsLoading(false);
    };
    fetchBlogs();
  }, []);

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <Breadcrumbs />
        
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Travel Guide & Blog</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">Discover tips, guides, and stories for your next adventure.</p>
        </div>

        {isLoading ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-800 rounded-2xl h-96"></div>
            ))}
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <Link key={blog.id} href={`/blog/${blog.slug}`} className="group bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-xl transition-all">
                <div className="relative h-60 overflow-hidden">
                  <Image 
                    src={blog.image} 
                    alt={blog.title} 
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110" 
                  />
                  <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {blog.category}
                  </div>
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {blog.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-3">
                    {blog.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-500">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" /> {blog.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" /> {blog.date}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
