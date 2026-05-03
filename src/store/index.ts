import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Tour, CartItem, Booking } from '@/types';

// AUTH STORE
interface AuthState {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      login: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    { name: 'travelgo-auth' }
  )
);

// TOUR FILTERS STORE
interface TourStore {
  tours: Tour[];
  setTours: (tours: Tour[]) => void;
  filters: {
    location: string;
    maxPrice: number;
    duration: string;
    minRating: number;
    keywords: string;
  };
  setFilters: (filters: Partial<TourStore['filters']>) => void;
}

export const useTourStore = create<TourStore>((set) => ({
  tours: [],
  setTours: (tours) => set({ tours }),
  filters: { location: '', maxPrice: 5000, duration: '', minRating: 0, keywords: '' },
  setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
}));

// WISHLIST STORE
interface WishlistStore {
  wishlist: string[];
  toggleWishlist: (tourId: string) => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set) => ({
      wishlist: [],
      toggleWishlist: (tourId) => set((state) => ({
        wishlist: state.wishlist.includes(tourId)
          ? state.wishlist.filter(id => id !== tourId)
          : [...state.wishlist, tourId]
      })),
    }),
    { name: 'travelgo-wishlist' }
  )
);

// THEME STORE
interface ThemeStore {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: 'light',
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
    }),
    { name: 'travelgo-theme' }
  )
);

// NOTIFICATION STORE
export interface AppNotification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface NotificationStore {
  notifications: AppNotification[];
  addNotification: (message: string, type: AppNotification['type']) => void;
  removeNotification: (id: string) => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  addNotification: (message, type) => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({
      notifications: [...state.notifications, { id, message, type }]
    }));
    setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id)
      }));
    }, 4000);
  },
  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter(n => n.id !== id)
  })),
}));

// CART STORE
interface CartStore {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, guests: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      addToCart: (item) => set((state) => {
        const existing = state.items.find(i => i.tourId === item.tourId && i.date === item.date);
        if (existing) {
          return {
            items: state.items.map(i => i.id === existing.id ? { ...i, guests: i.guests + item.guests } : i)
          };
        }
        return { items: [...state.items, item] };
      }),
      removeFromCart: (id) => set((state) => ({ items: state.items.filter(i => i.id !== id) })),
      updateQuantity: (id, guests) => set((state) => ({
        items: state.items.map(i => i.id === id ? { ...i, guests } : i)
      })),
      clearCart: () => set({ items: [] }),
    }),
    { name: 'travelgo-cart' }
  )
);

// BOOKING STORE (Local persistence for fake API)
interface BookingStore {
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  updateBookingStatus: (id: string, status: Booking['status']) => void;
  setBookings: (bookings: Booking[]) => void;
}

export const useBookingStore = create<BookingStore>()(
  persist(
    (set) => ({
      bookings: [],
      addBooking: (booking) => set((state) => ({ bookings: [...state.bookings, booking] })),
      updateBookingStatus: (id, status) => set((state) => ({
        bookings: state.bookings.map(b => b.id === id ? { ...b, status } : b)
      })),
      setBookings: (bookings) => set({ bookings })
    }),
    { name: 'travelgo-bookings' }
  )
);

// RECENTLY VIEWED STORE
interface RecentlyViewedStore {
  viewedTourIds: string[];
  addTour: (id: string) => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedStore>()(
  persist(
    (set) => ({
      viewedTourIds: [],
      addTour: (id) => set((state) => {
        const filtered = state.viewedTourIds.filter(t => t !== id);
        return { viewedTourIds: [id, ...filtered].slice(0, 6) };
      }),
    }),
    { name: 'travelgo-recently-viewed' }
  )
);
