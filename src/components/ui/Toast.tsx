"use client";

import { useNotificationStore } from "@/store";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

export function ToastContainer() {
  const { notifications, removeNotification } = useNotificationStore();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium shadow-lg transition-all
            ${notification.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900/80 dark:text-green-100' : ''}
            ${notification.type === 'error' ? 'bg-red-100 text-red-800 dark:bg-red-900/80 dark:text-red-100' : ''}
            ${notification.type === 'info' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/80 dark:text-blue-100' : ''}
          `}
        >
          {notification.type === 'success' && <CheckCircle className="h-5 w-5" />}
          {notification.type === 'error' && <AlertCircle className="h-5 w-5" />}
          {notification.type === 'info' && <Info className="h-5 w-5" />}
          
          <span className="flex-1">{notification.message}</span>
          
          <button 
            onClick={() => removeNotification(notification.id)}
            className="rounded-full p-1 hover:bg-black/10 dark:hover:bg-white/10"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
