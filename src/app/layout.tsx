import type { Metadata } from 'next';
import { Poppins, Caveat, Playfair_Display } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from "@/components/ui/toaster"

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

const caveat = Caveat({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-caveat',
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-playfair-display',
});


export const metadata: Metadata = {
  title: 'Kotak Rahasia - Cipa & Jojo',
  description: 'Sebuah kotak rahasia untuk Cipa & Jojo',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={cn('antialiased', poppins.variable, caveat.variable, playfairDisplay.variable)}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
