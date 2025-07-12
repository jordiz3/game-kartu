
'use client';

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Mail, Heart, MessageSquare, Flame, StretchHorizontal, Swords, BookText, PenSquare, Puzzle, Star, Map, Wand2, BrainCircuit, Gamepad2, Paintbrush } from 'lucide-react';

const menuItems = [
  {
    href: '/secret-box',
    icon: Mail,
    title: 'Kotak Rahasia',
    description: 'Kirim & jawab pertanyaan rahasia.',
    bgClass: 'from-pink-100 to-rose-100',
    iconColor: 'text-pink-500',
  },
  {
    href: '/wishlist',
    icon: Heart,
    title: 'Wishlist Date',
    description: 'Rencanakan & wujudkan kencan impian.',
    bgClass: 'from-purple-100 to-indigo-100',
    iconColor: 'text-purple-500',
  },
  {
    href: '/deep-talk',
    icon: MessageSquare,
    title: 'Kartu Deep Talk',
    description: 'Mulai percakapan mendalam.',
    bgClass: 'from-blue-100 to-cyan-100',
    iconColor: 'text-blue-500',
  },
  {
    href: '/truth-or-dare',
    icon: Flame,
    title: 'Truth or Dare',
    description: 'Mainkan permainan klasik yang seru.',
    bgClass: 'from-orange-100 to-amber-100',
    iconColor: 'text-orange-500',
  },
  {
    href: '/this-or-that',
    icon: StretchHorizontal,
    title: 'This or That',
    description: 'Lihat seberapa sefrekuensi kalian.',
    bgClass: 'from-teal-100 to-green-100',
    iconColor: 'text-teal-500',
  },
  {
    href: '/choose-adventure',
    icon: Swords,
    title: 'Petualangan Ajaib',
    description: 'Pilih jalan ceritamu sendiri.',
    bgClass: 'from-gray-200 to-slate-200',
    iconColor: 'text-gray-600',
  },
   {
    href: '/bikin-cerita-absurd',
    icon: BookText,
    title: 'Cerita Absurd',
    description: 'Isi kata & lihat hasilnya yang lucu.',
    bgClass: 'from-yellow-100 to-lime-100',
    iconColor: 'text-yellow-600',
  },
  {
    href: '/kartu-nikah',
    icon: PenSquare,
    title: 'Kartu Nikah Digital',
    description: 'Kartu nikah digital Cipa & Jojo.',
    bgClass: 'from-rose-100 to-red-100',
    iconColor: 'text-rose-500',
  },
  {
    href: '/generator-puisi',
    icon: Wand2,
    title: 'Generator Puisi',
    description: 'Buat puisi romantis dengan AI.',
    bgClass: 'from-indigo-100 to-purple-200',
    iconColor: 'text-indigo-500',
  },
   {
    href: '/kuis-pengetahuan',
    icon: BrainCircuit,
    title: 'Kuis Pengetahuan',
    description: 'Uji wawasan dengan kuis seru.',
    bgClass: 'from-blue-100 to-purple-100',
    iconColor: 'text-blue-600'
  },
];

export default function HomePage() {
  // Sort menu items to keep consistent order if new items are added in the middle
  const sortedMenuItems = menuItems.sort((a, b) => a.title.localeCompare(b.title));

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #fde6f1 0%, #e6e9f0 100%)' }}>
      <header className="text-center mb-10 md:mb-12">
        <h1 className="font-handwriting text-6xl md:text-7xl text-pink-500">
          Cipa & Jojo
        </h1>
        <p className="text-gray-600 mt-2 text-lg">Gerbang menuju petualangan nge-date kita!</p>
      </header>

      <main className="w-full max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link href={item.href} key={item.href}>
                <Card className={`hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 ease-in-out cursor-pointer h-full bg-gradient-to-br ${item.bgClass}`}>
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div className={`p-3 rounded-full bg-white shadow-md ${item.iconColor}`}>
                      <Icon size={28} />
                    </div>
                    <div>
                      <CardTitle className={item.titleColor || 'text-gray-800'}>{item.title}</CardTitle>
                      <CardDescription className={item.descColor || 'text-gray-600'}>{item.description}</CardDescription>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      </main>

      <footer className="text-center mt-12 text-gray-500">
        <p>Sebuah tempat spesial untuk kita berdua ♥</p>
      </footer>
    </div>
  );
}
