
'use client';

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Mail, Heart, Flame, StretchHorizontal, BookText, PenSquare, MessageSquare, Ticket, RefreshCw } from 'lucide-react';

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
    href: '/deep-talk',
    icon: MessageSquare,
    title: 'Deep Talk',
    description: 'Kartu pertanyaan untuk obrolan mendalam.',
    bgClass: 'from-blue-100 to-cyan-100',
    iconColor: 'text-blue-500',
  },
  {
    href: '/spin-wheel',
    icon: Ticket,
    title: 'Spin Wheel',
    description: 'Putar roda keberuntungan untuk menentukan pilihan.',
    bgClass: 'from-amber-100 to-orange-100',
    iconColor: 'text-amber-600'
  },
  {
    href: '/parafrase',
    icon: RefreshCw,
    title: 'Alat Parafrase',
    description: 'Tulis ulang paragraf dengan AI.',
    bgClass: 'from-cyan-100 to-sky-100',
    iconColor: 'text-cyan-600'
  }
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
                      <CardTitle className={'text-gray-800'}>{item.title}</CardTitle>
                      <CardDescription className={'text-gray-600'}>{item.description}</CardDescription>
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
