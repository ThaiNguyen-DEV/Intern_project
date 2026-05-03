export interface Tour {
  id: string;
  title: string;
  price: number;
  location: string;
  duration: string;
  images: string[];
  rating: number;
  reviewsCount?: number;
  description: string;
  itinerary: { day: number; activity: string }[];
  isDeal?: boolean;
  discountPrice?: number;
  destinationSlug?: string;
}

export interface Booking {
  id: string;
  tourId: string;
  userId: string;
  guests: number;
  date: string;
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled";
  customerDetails: {
    name: string;
    email: string;
    phone: string;
  };
  tourTitle?: string; // added for profile history
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  phone?: string;
  token?: string;
}

export interface Review {
  id: string;
  tourId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string; // short description
  content: string;
  coverImage: string; // changed from image to coverImage
  category: string;
  date: string; // publish date
  author: string;
  status?: "draft" | "published";
  isFeatured?: boolean;
  tags?: string[];
}

export interface CartItem {
  id: string; // unique id for cart item
  tourId: string;
  tour: Tour;
  guests: number;
  date: string;
}

export interface Coupon {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
}
