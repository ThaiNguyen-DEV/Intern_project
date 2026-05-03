"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { usePathname } from "next/navigation";

export function Breadcrumbs() {
  const pathname = usePathname();
  
  if (pathname === "/") return null;
  
  const pathSegments = pathname.split("/").filter(Boolean);
  
  return (
    <nav className="flex mb-6" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
            <Home className="w-4 h-4 mr-2" />
            Home
          </Link>
        </li>
        {pathSegments.map((segment, index) => {
          const isLast = index === pathSegments.length - 1;
          const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
          const formattedSegment = segment.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
          
          return (
            <li key={segment}>
              <div className="flex items-center">
                <ChevronRight className="w-4 h-4 text-gray-400" />
                {isLast ? (
                  <span className="ml-1 text-sm font-medium text-gray-800 md:ml-2 dark:text-gray-300">
                    {formattedSegment}
                  </span>
                ) : (
                  <Link href={href} className="ml-1 text-sm font-medium text-gray-500 hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-white">
                    {formattedSegment}
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
