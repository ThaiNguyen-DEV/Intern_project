"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { BlogPost } from "@/types";
import { Search, Plus, Edit2, Trash2, Eye, Filter } from "lucide-react";
import Link from "next/link";
import { useNotificationStore } from "@/store";
import Image from "next/image";

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const { addNotification } = useNotificationStore();

  const loadBlogs = async () => {
    const data = await api.getBlogs();
    setBlogs(data);
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this blog post?")) {
      setBlogs(blogs.filter(b => b.id !== id));
      addNotification("Blog post deleted successfully", "success");
    }
  };

  const categories = Array.from(new Set(blogs.map(b => b.category)));

  const filteredBlogs = blogs.filter(b => {
    const matchSearch = b.title.toLowerCase().includes(search.toLowerCase());
    const matchCategory = filterCategory ? b.category === filterCategory : true;
    return matchSearch && matchCategory;
  });

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold dark:text-white">Blog Management</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage your travel guides and articles</p>
        </div>
        <Link 
          href="/admin/blogs/new"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add New Post
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search posts by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex gap-4">
            <div className="relative flex items-center">
              <Filter className="absolute left-3 h-4 w-4 text-gray-400" />
              <select 
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="pl-9 pr-8 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                <option value="">All Categories</option>
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
            <thead className="bg-gray-50 dark:bg-gray-800/50 text-xs uppercase text-gray-700 dark:text-gray-300">
              <tr>
                <th className="px-6 py-4">Post</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Author</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredBlogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">No posts found</td>
                </tr>
              ) : (
                filteredBlogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-12 rounded-lg overflow-hidden flex-shrink-0">
                          <Image src={blog.image} alt={blog.title} fill className="object-cover" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 dark:text-white line-clamp-1 max-w-[250px]">{blog.title}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 max-w-[250px]">{blog.excerpt}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                        {blog.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">{blog.author}</td>
                    <td className="px-6 py-4">{blog.date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        blog.status === 'draft' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      }`}>
                        {blog.status || 'PUBLISHED'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={`/blog/${blog.slug}`} target="_blank" className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link href={`/admin/blogs/${blog.id}`} className="p-2 text-gray-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button onClick={() => handleDelete(blog.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
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
