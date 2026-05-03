import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-[80vh] flex flex-col items-center justify-center py-12 px-4">
      <div className="text-center max-w-lg">
        <div className="mb-6 flex justify-center">
          <div className="h-24 w-24 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <SearchX className="h-12 w-12 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <h1 className="text-6xl font-black text-gray-900 dark:text-white mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Destination Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Looks like you've wandered off the map. The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/">
            <Button size="lg" className="w-full sm:w-auto">Return Home</Button>
          </Link>
          <Link href="/tours">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">Explore Tours</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
