
'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '../../components/ui/skeleton';

function AppSkeleton() {
  return (
    <div className="container mx-auto max-w-2xl p-4 md:p-8 animate-pulse">
      <header className="text-center mb-8">
        <Skeleton className="h-14 w-64 mx-auto" />
        <Skeleton className="h-4 w-48 mx-auto mt-4" />
      </header>

      <div className="flex justify-center mb-8 bg-white p-1.5 rounded-full shadow-inner">
        <Skeleton className="h-10 w-1/2 rounded-full bg-pink-100" />
        <Skeleton className="h-10 w-1/2 rounded-full bg-white ml-1.5" />
      </div>

      <div className="space-y-10">
        <section id="ask-form-section" className="mb-10">
          <Skeleton className="h-8 w-80 mx-auto mb-4" />
          <div className="bg-white p-6 rounded-2xl shadow-md space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </section>

        <section id="unanswered-section" className="mb-10">
          <Skeleton className="h-8 w-64 mx-auto mb-4" />
          <div className="bg-white p-5 rounded-xl shadow-md space-y-4">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-20 w-full mt-2" />
            <Skeleton className="h-10 w-full mt-2" />
          </div>
        </section>

        <section id="answered-section">
          <Skeleton className="h-8 w-48 mx-auto mb-4" />
          <div className="bg-white p-5 rounded-xl shadow-md space-y-3">
             <Skeleton className="h-4 w-1/3" />
             <Skeleton className="h-5 w-2/3" />
             <div className="border-b my-3"></div>
             <Skeleton className="h-4 w-1/3" />
             <Skeleton className="h-5 w-3/4" />
          </div>
        </section>
      </div>
    </div>
  );
}

const SecretBox = dynamic(() => import('../../components/SecretBox'), {
  ssr: false,
  loading: () => <AppSkeleton />,
});

export default function SecretBoxPage() {
  return <SecretBox />;
}
