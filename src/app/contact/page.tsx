"use client";

import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { MapPin, Phone, Mail, Send } from "lucide-react";
import { useState } from "react";
import { useNotificationStore } from "@/store";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addNotification } = useNotificationStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      addNotification("Message sent successfully! We'll get back to you soon.", "success");
      (e.target as HTMLFormElement).reset();
    }, 1000);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <Breadcrumbs />
        
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Get in Touch</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Have questions about our tours or need help with a booking? Our team is here to assist you 24/7.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-6">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold dark:text-white mb-2">Our Office</h3>
              <p className="text-gray-600 dark:text-gray-400">123 Travel Street, Suite 456<br/>New York, NY 10001<br/>United States</p>
            </div>
            
            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-6">
                <Phone className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold dark:text-white mb-2">Phone</h3>
              <p className="text-gray-600 dark:text-gray-400">+1 (555) 123-4567<br/>Mon-Fri from 8am to 6pm</p>
            </div>
            
            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-6">
                <Mail className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold dark:text-white mb-2">Email</h3>
              <p className="text-gray-600 dark:text-gray-400">support@travelgo.com<br/>bookings@travelgo.com</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-900 p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold dark:text-white mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Input label="First Name" required />
                  <Input label="Last Name" required />
                </div>
                <Input label="Email Address" type="email" required />
                <Input label="Subject" required />
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea 
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white min-h-[150px]"
                    required
                    placeholder="How can we help you?"
                  ></textarea>
                </div>
                <Button type="submit" size="lg" className="w-full sm:w-auto" isLoading={isSubmitting}>
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
