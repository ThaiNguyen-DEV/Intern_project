"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { api } from "@/lib/api";
import { Tour, Coupon } from "@/types";
import { useAuthStore, useNotificationStore, useBookingStore } from "@/store";
import { Tag } from "lucide-react";

const checkoutSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Valid phone number is required"),
  guests: z.number().min(1).max(10),
  date: z.string().min(1, "Date is required"),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

function CheckoutContent() {
  const searchParams = useSearchParams();
  const tourId = searchParams.get("tourId");
  const initGuests = Number(searchParams.get("guests")) || 1;
  const initDate = searchParams.get("date") || "";
  
  const router = useRouter();
  const { user } = useAuthStore();
  const { addNotification } = useNotificationStore();
  const { addBooking } = useBookingStore();
  
  const [tour, setTour] = useState<Tour | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      guests: initGuests,
      date: initDate,
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || ""
    }
  });

  const guests = watch("guests", 1);
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (!user) {
      addNotification("Please log in to continue booking", "warning");
      router.push("/login");
      return;
    }
    
    if (tourId) {
      api.getTourById(tourId).then(t => {
        if (t) setTour(t);
        else router.push("/tours");
      });
    } else {
      router.push("/tours");
    }
  }, [tourId, user, router]);

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setIsApplyingCoupon(true);
    try {
      const coupon = await api.validateCoupon(couponCode);
      setAppliedCoupon({ code: couponCode, ...coupon });
      addNotification("Coupon applied successfully!", "success");
    } catch (error) {
      addNotification("Invalid coupon code", "error");
      setAppliedCoupon(null);
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const onSubmit = async (data: CheckoutForm) => {
    if (!tour || !user) return;
    setIsLoading(true);
    try {
      const basePrice = (tour.discountPrice || tour.price) * data.guests;
      let finalPrice = basePrice;
      if (appliedCoupon) {
        if (appliedCoupon.discountType === "percentage") {
          finalPrice = basePrice * (1 - appliedCoupon.discountValue / 100);
        } else {
          finalPrice = Math.max(0, basePrice - appliedCoupon.discountValue);
        }
      }

      const booking = await api.createBooking({
        tourId: tour.id,
        userId: user.id,
        guests: data.guests,
        date: data.date,
        totalPrice: finalPrice,
        customerDetails: {
          name: data.name,
          email: data.email,
          phone: data.phone
        },
        tourTitle: tour.title
      });
      
      // Save locally to reflect in user profile history
      addBooking(booking);
      
      router.push(`/payment?bookingId=${booking.id}`);
    } catch (error) {
      addNotification("Something went wrong", "error");
    } finally {
      setIsLoading(false);
    }
  };

  if (!tour) return <div className="p-20 text-center dark:text-white">Loading...</div>;

  const basePrice = (tour.discountPrice || tour.price) * guests;
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === "percentage") {
      discountAmount = basePrice * (appliedCoupon.discountValue / 100);
    } else {
      discountAmount = appliedCoupon.discountValue;
    }
  }
  const tax = basePrice * 0.05; // Fake 5% tax
  const totalPrice = Math.max(0, basePrice - discountAmount) + tax;

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-bold mb-8 dark:text-white">Complete Your Booking</h1>
        
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Personal Details */}
              <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                <h2 className="text-xl font-bold mb-6 dark:text-white">Traveler Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="Full Name" {...register("name")} error={errors.name?.message} />
                  <Input label="Email Address" type="email" {...register("email")} error={errors.email?.message} />
                  <Input label="Phone Number" {...register("phone")} error={errors.phone?.message} />
                  <div className="flex gap-4">
                    <Input label="Number of Guests" type="number" min="1" max="10" {...register("guests", { valueAsNumber: true })} error={errors.guests?.message} />
                    <Input label="Date" type="date" min={today} {...register("date")} error={errors.date?.message} />
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <div className="sticky top-24 bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 space-y-6">
              <h2 className="text-xl font-bold dark:text-white">Booking Summary</h2>
              
              <div className="flex gap-4">
                <img src={tour.images[0]} alt={tour.title} className="w-20 h-20 object-cover rounded-lg" />
                <div>
                  <h3 className="font-bold dark:text-white line-clamp-2">{tour.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{tour.location}</p>
                </div>
              </div>

              {/* Coupon */}
              <div className="border-t border-gray-100 dark:border-gray-800 pt-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Discount Code</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="e.g. TRAVEL20"
                    disabled={!!appliedCoupon}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white disabled:opacity-50"
                  />
                  {!appliedCoupon ? (
                    <Button type="button" onClick={handleApplyCoupon} isLoading={isApplyingCoupon} disabled={!couponCode}>Apply</Button>
                  ) : (
                    <Button type="button" variant="outline" onClick={() => { setAppliedCoupon(null); setCouponCode(""); }}>Remove</Button>
                  )}
                </div>
                {appliedCoupon && (
                  <p className="text-sm text-green-500 mt-2 flex items-center gap-1">
                    <Tag className="w-4 h-4" /> Coupon applied successfully
                  </p>
                )}
              </div>

              <div className="border-t border-b border-gray-100 dark:border-gray-800 py-4 space-y-3">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Base Price ({guests}x)</span>
                  <span>${basePrice.toFixed(2)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-green-500">
                    <span>Discount ({appliedCoupon.code})</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Taxes & Fees (5%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between text-xl font-bold dark:text-white">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>

              <Button type="submit" form="checkout-form" className="w-full py-4 text-lg" isLoading={isLoading}>
                Continue to Payment
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center dark:text-white">Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
