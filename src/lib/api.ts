import axios from "axios";
import { Tour, Booking, User, BlogPost, Review } from "@/types";

// MOCK DATA
const mockTours: Tour[] = [
  {
    id: "1",
    title: "Bali Tropical Paradise",
    price: 899,
    location: "Bali, Indonesia",
    duration: "7 Days",
    images: [
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4",
      "https://images.unsplash.com/photo-1555400038-63f5ba517a47",
      "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2",
      "https://images.unsplash.com/photo-1573790387438-4da90503f5ce",
      "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1"
    ],
    rating: 4.8,
    reviewsCount: 124,
    description: "Experience the ultimate tropical getaway with our 7-day Bali tour. Visit ancient temples, relax on pristine beaches, and immerse yourself in the rich local culture.",
    itinerary: [
      { day: 1, activity: "Arrival and check-in to resort" },
      { day: 2, activity: "Ubud Monkey Forest & Rice Terraces" },
      { day: 3, activity: "Water sports at Nusa Dua" },
      { day: 4, activity: "Free day for leisure or optional tours" },
      { day: 5, activity: "Uluwatu Temple & Kecak Fire Dance" },
      { day: 6, activity: "Shopping in Seminyak" },
      { day: 7, activity: "Departure" },
    ],
    isDeal: true,
    discountPrice: 799,
    destinationSlug: "bali",
    availableDates: ["2026-07-10", "2026-07-25", "2026-08-05", "2026-08-20"]
  },
  {
    id: "2",
    title: "Swiss Alps Adventure",
    price: 1499,
    location: "Zurich, Switzerland",
    duration: "5 Days",
    images: [
      "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99",
      "https://images.unsplash.com/photo-1528901166007-3784c7dd3653",
      "https://images.unsplash.com/photo-1469796466635-455efeec0962",
      "https://images.unsplash.com/photo-1520108398188-fb2ce87e7f6e",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af"
    ],
    rating: 4.9,
    reviewsCount: 89,
    description: "Discover the breathtaking beauty of the Swiss Alps. Enjoy scenic train rides, guided mountain hikes, and indulge in world-famous Swiss chocolate and cheese.",
    itinerary: [
      { day: 1, activity: "Arrival in Zurich & City Tour" },
      { day: 2, activity: "Train to Interlaken" },
      { day: 3, activity: "Jungfraujoch - Top of Europe" },
      { day: 4, activity: "Lucerne Lake Cruise" },
      { day: 5, activity: "Departure from Zurich" },
    ],
    destinationSlug: "switzerland",
    availableDates: ["2026-06-15", "2026-07-01", "2026-07-15", "2026-08-01"]
  },
  {
    id: "3",
    title: "Tokyo Highlights",
    price: 1200,
    location: "Tokyo, Japan",
    duration: "6 Days",
    images: [
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26",
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf",
      "https://images.unsplash.com/photo-1554797589-7241f49ce83d",
      "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc",
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e"
    ],
    rating: 4.7,
    reviewsCount: 210,
    description: "Explore the bustling metropolis of Tokyo. From neon-lit streets to serene temples, this tour offers a perfect blend of modern and traditional Japan.",
    itinerary: [
      { day: 1, activity: "Arrival & Welcome Dinner" },
      { day: 2, activity: "Senso-ji Temple & Akihabara" },
      { day: 3, activity: "Shibuya Crossing & Harajuku" },
      { day: 4, activity: "Day trip to Mount Fuji" },
      { day: 5, activity: "Tsukiji Outer Market & Sushi Making" },
      { day: 6, activity: "Departure" },
    ],
    isDeal: true,
    discountPrice: 1050,
    destinationSlug: "tokyo",
    availableDates: ["2026-06-20", "2026-07-05", "2026-09-10", "2026-10-01"]
  },
];

let mockBookings: Booking[] = [];
let mockUsers: User[] = [
  { id: "1", name: "Admin", email: "admin@example.com", role: "admin" },
  { id: "2", name: "User", email: "user@example.com", role: "user" }
];

const mockBlogs: BlogPost[] = [
  {
    id: "1",
    slug: "top-10-bali-beaches",
    title: "Top 10 Hidden Beaches in Bali",
    excerpt: "Discover the most beautiful and secluded beaches in Bali that tourists often miss.",
    content: "Bali is famous for its beaches, but beyond Kuta and Seminyak lie hidden gems... (Detailed content goes here)",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4",
    category: "Guides",
    date: "2023-10-15",
    author: "Jane Doe"
  },
  {
    id: "2",
    slug: "swiss-alps-packing-list",
    title: "Ultimate Packing List for the Swiss Alps",
    excerpt: "Everything you need to pack for a comfortable and safe adventure in the Swiss mountains.",
    content: "When traveling to the Alps, layering is key... (Detailed content goes here)",
    image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99",
    category: "Tips",
    date: "2023-11-02",
    author: "John Smith"
  }
];

let mockReviews: Review[] = [
  { id: "1", tourId: "1", userName: "Alice", rating: 5, comment: "Absolutely breathtaking experience!", date: "2023-09-20" },
  { id: "2", tourId: "1", userName: "Bob", rating: 4, comment: "Great tour, but the flight was long.", date: "2023-10-01" },
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // Tours
  getTours: async (params?: any): Promise<Tour[]> => {
    await delay(300);
    let result = [...mockTours];
    if (params?.search) {
      const q = params.search.toLowerCase();
      result = result.filter(t => t.title.toLowerCase().includes(q) || t.location.toLowerCase().includes(q));
    }
    if (params?.location) {
      result = result.filter(t => t.location.toLowerCase().includes(params.location.toLowerCase()));
    }
    if (params?.maxPrice) {
      result = result.filter(t => t.price <= params.maxPrice);
    }
    if (params?.minRating) {
      result = result.filter(t => t.rating >= params.minRating);
    }
    if (params?.isDeal) {
      result = result.filter(t => t.isDeal);
    }
    if (params?.destinationSlug) {
      result = result.filter(t => t.destinationSlug === params.destinationSlug);
    }
    if (params?.date) {
      result = result.filter(t => t.availableDates.includes(params.date));
    }
    return result;
  },
  getTourById: async (id: string): Promise<Tour | undefined> => {
    await delay(300);
    return mockTours.find(t => t.id === id);
  },

  // Bookings
  createBooking: async (bookingData: Omit<Booking, 'id' | 'status'>): Promise<Booking> => {
    await delay(800);
    const newBooking: Booking = {
      ...bookingData,
      id: Math.random().toString(36).substring(2, 9),
      status: "pending" // starts as pending until payment
    };
    mockBookings.push(newBooking);
    return newBooking;
  },
  updateBookingStatus: async (id: string, status: Booking['status']): Promise<Booking> => {
    await delay(500);
    const booking = mockBookings.find(b => b.id === id);
    if (!booking) throw new Error("Not found");
    booking.status = status;
    return booking;
  },
  getUserBookings: async (userId: string): Promise<Booking[]> => {
    await delay(500);
    return mockBookings.filter(b => b.userId === userId);
  },
  getAllBookings: async (): Promise<Booking[]> => {
    await delay(500);
    return mockBookings;
  },

  // Auth
  login: async (email: string): Promise<User> => {
    await delay(500);
    const user = mockUsers.find(u => u.email === email);
    if (!user) throw new Error("Invalid credentials");
    return { ...user, token: Math.random().toString(36).substring(2) }; // Fake token
  },

  // Blogs
  getBlogs: async (): Promise<BlogPost[]> => {
    await delay(300);
    return mockBlogs;
  },
  getBlogBySlug: async (slug: string): Promise<BlogPost | undefined> => {
    await delay(300);
    return mockBlogs.find(b => b.slug === slug);
  },

  // Reviews
  getReviewsByTourId: async (tourId: string): Promise<Review[]> => {
    await delay(300);
    return mockReviews.filter(r => r.tourId === tourId);
  },
  addReview: async (review: Omit<Review, 'id' | 'date'>): Promise<Review> => {
    await delay(500);
    const newReview = {
      ...review,
      id: Math.random().toString(36).substring(2, 9),
      date: new Date().toISOString().split('T')[0]
    };
    mockReviews.push(newReview);
    return newReview;
  },

  // Coupons
  validateCoupon: async (code: string) => {
    await delay(500);
    const mockCoupons: Record<string, { discountType: "percentage" | "fixed"; discountValue: number }> = {
      "TRAVEL20": { discountType: "percentage", discountValue: 20 },
      "SAVE50": { discountType: "fixed", discountValue: 50 }
    };
    if (mockCoupons[code.toUpperCase()]) {
      return mockCoupons[code.toUpperCase()];
    }
    throw new Error("Invalid coupon code");
  }
};
