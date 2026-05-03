"use client";

import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { api } from "@/lib/api";
import { BlogPost } from "@/types";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Calendar, User, Tag } from "lucide-react";

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      setIsLoading(true);
      const data = await api.getBlogBySlug(slug);
      if (data) setBlog(data);
      setIsLoading(false);
    };
    fetchBlog();
  }, [slug]);

  if (isLoading) {
    return <div className="min-h-screen py-20 text-center dark:text-white">Loading post...</div>;
  }

  if (!blog) {
    return <div className="min-h-screen py-20 text-center dark:text-white">Blog post not found.</div>;
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen pb-12">
      {/* Hero Image */}
      <div className="relative h-[50vh] min-h-[400px] w-full">
        <Image 
          src={blog.image} 
          alt={blog.title} 
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute bottom-0 left-0 w-full p-8 text-white container mx-auto">
          <div className="mb-4 flex items-center gap-4 text-sm font-medium">
            <span className="flex items-center gap-1 rounded-full bg-blue-600 px-3 py-1">
              <Tag className="h-4 w-4" /> {blog.category}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" /> {blog.date}
            </span>
            <span className="flex items-center gap-1">
              <User className="h-4 w-4" /> {blog.author}
            </span>
          </div>
          <h1 className="text-4xl font-bold md:text-5xl lg:text-6xl max-w-4xl">{blog.title}</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8 max-w-4xl">
        <Breadcrumbs />
        
        <article className="bg-white dark:bg-gray-900 p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 mt-8 prose prose-lg dark:prose-invert max-w-none">
          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed font-medium mb-8 border-l-4 border-blue-500 pl-6">
            {blog.excerpt}
          </p>
          <div className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
            {blog.content}
            
            {/* Mock content extension to make it look longer */}
            <h3 className="text-2xl font-bold mt-8 mb-4">Why you should visit now</h3>
            <p className="mb-6">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <h3 className="text-2xl font-bold mt-8 mb-4">What to bring</h3>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Comfortable walking shoes</li>
              <li>Weather-appropriate clothing</li>
              <li>A good camera</li>
              <li>An adventurous spirit</li>
            </ul>
          </div>
        </article>
      </div>
    </div>
  );
}
