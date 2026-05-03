"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useNotificationStore } from "@/store";
import { ChevronLeft, Save, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";

export default function AdminEditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { addNotification } = useNotificationStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "",
    author: "",
    date: "",
    excerpt: "",
    content: "",
    status: "published",
    isFeatured: false,
    tags: "",
  });

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const blogs = await api.getBlogs();
        const blog = blogs.find(b => b.id === resolvedParams.id);
        if (blog) {
          setFormData({
            title: blog.title,
            slug: blog.slug,
            category: blog.category,
            author: blog.author,
            date: blog.date,
            excerpt: blog.excerpt,
            content: blog.content,
            status: blog.status || "published",
            isFeatured: blog.isFeatured || false,
            tags: blog.tags?.join(", ") || "",
          });
        }
      } catch (error) {
        addNotification("Failed to load blog details", "error");
      } finally {
        setIsFetching(false);
      }
    };
    fetchBlog();
  }, [resolvedParams.id, addNotification]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const generateSlug = () => {
    if (formData.title && !formData.slug) {
      setFormData(prev => ({
        ...prev,
        slug: prev.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      addNotification("Blog post updated successfully!", "success");
      router.push("/admin/blogs");
    } catch (error) {
      addNotification("Failed to update blog post", "error");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex items-center gap-4">
        <Link href="/admin/blogs" className="p-2 border border-gray-200 dark:border-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <ChevronLeft className="w-5 h-5 dark:text-gray-300" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold dark:text-white">Edit Post</h1>
          <p className="text-gray-500 dark:text-gray-400">Update blog article</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid md:grid-cols-3 gap-8">
          
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 space-y-6">
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Post Title *</label>
                  <input required name="title" value={formData.title} onChange={handleChange} onBlur={generateSlug} type="text" className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Slug *</label>
                  <input required name="slug" value={formData.slug} onChange={handleChange} type="text" className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white font-mono text-sm" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Short Description (Excerpt) *</label>
                  <textarea required name="excerpt" value={formData.excerpt} onChange={handleChange} rows={3} className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content *</label>
                  <textarea required name="content" value={formData.content} onChange={handleChange} rows={15} className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white font-mono text-sm" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 space-y-6">
              <h2 className="text-xl font-bold dark:text-white border-b border-gray-100 dark:border-gray-800 pb-4">Publish Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                  <select name="status" value={formData.status} onChange={handleChange} className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Publish Date</label>
                  <input name="date" value={formData.date} onChange={handleChange} type="date" className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
                </div>
                
                <label className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                  <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="font-medium dark:text-white">Featured Post</span>
                </label>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 space-y-6">
              <h2 className="text-xl font-bold dark:text-white border-b border-gray-100 dark:border-gray-800 pb-4">Post Details</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category *</label>
                  <select required name="category" value={formData.category} onChange={handleChange} className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                    <option value="">Select Category</option>
                    <option value="Travel Guides">Travel Guides</option>
                    <option value="Tips & Tricks">Tips & Tricks</option>
                    <option value="Destinations">Destinations</option>
                    <option value="News">News</option>
                    <option value="Guides">Guides</option>
                    <option value="Tips">Tips</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Author *</label>
                  <input required name="author" value={formData.author} onChange={handleChange} type="text" className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tags</label>
                  <input name="tags" value={formData.tags} onChange={handleChange} type="text" className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white" placeholder="Comma separated tags" />
                </div>
              </div>
            </div>

            <div className="pt-4 flex gap-4">
              <Button type="button" variant="outline" className="flex-1 py-4" onClick={() => setFormData({...formData, status: 'draft'})}>
                Save as Draft
              </Button>
              <Button type="submit" className="flex-1 py-4" isLoading={isLoading} onClick={() => setFormData({...formData, status: 'published'})}>
                <Save className="w-5 h-5 mr-2" />
                Update Post
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
