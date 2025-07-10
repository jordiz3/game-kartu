'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '../../components/ui/skeleton';

// A skeleton loader for the wishlist page
function WishlistSkeleton() {
  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-8 animate-pulse">
      <header className="text-center mb-8">
        <Skeleton className="h-12 w-80 mx-auto" />
        <Skeleton className="h-4 w-96 mx-auto mt-4" />
      </header>
      
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-10 w-48" />
      </div>

      <div className="flex border-b border-gray-200 mb-6">
        <Skeleton className="h-10 w-36" />
        <Skeleton className="h-10 w-36 ml-4" />
      </div>

      <div className="space-y-4">
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    </div>
  );
}

const WishlistPage = dynamic(() => import('../../components/WishlistPage'), {
  ssr: false,
  loading: () => <WishlistSkeleton />,
});

export default function Home() {
  return <WishlistPage />;
}
