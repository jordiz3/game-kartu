
'use client';

import Link from 'next/link';
import { Home, Heart } from 'lucide-react';

export default function KartuNikahPage() {
  return (
    <>
      <style jsx>{`
        .bg-gradient-love {
          background: linear-gradient(-45deg, #fbc2eb, #a6c1ee, #fbc2eb, #a6c1ee);
          background-size: 400% 400%;
          animation: gradient 15s ease infinite;
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-fade-in-scale { 
            animation: fade-in-scale 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; 
        }
         @keyframes fade-in-scale { 
            from { opacity: 0; transform: scale(0.9); } 
            to { opacity: 1; transform: scale(1); } 
        }
      `}</style>
      <div className="bg-gradient-love min-h-screen flex flex-col items-center justify-center p-4 font-poppins text-white">
        <main className="text-center animate-fade-in-scale">
          <div className="mb-6">
            <Heart className="w-20 h-20 mx-auto text-white/80" fill="currentColor" />
          </div>
          <h1 className="font-display text-6xl md:text-8xl font-bold" style={{ textShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
            Cipa & Jojo
          </h1>
          <p className="mt-4 text-xl md:text-2xl text-white/90">
            Bersama selamanya.
          </p>
        </main>
        <footer className="absolute bottom-8 text-center">
            <Link href="/" className="text-white/80 hover:text-white transition-colors inline-flex items-center gap-2">
                <Home size={16}/> Kembali ke Menu Utama
            </Link>
        </footer>
      </div>
    </>
  );
}
