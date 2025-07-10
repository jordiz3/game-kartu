import DeepTalkGame from '@/components/DeepTalkGame';
import Link from 'next/link';

export default function DeepTalkPage() {
  return (
    <div className="gradient-bg min-h-screen flex flex-col items-center justify-center p-4">
      <DeepTalkGame />
       <footer className="text-center mt-12 pt-4">
        <Link href="/" className="text-pink-500 hover:underline">
          Kembali ke Kotak Rahasia 💌
        </Link>
        <span className="mx-2 text-gray-400">|</span>
        <Link href="/wishlist" className="text-pink-500 hover:underline">
          Lihat Wishlist Date Kita 💕
        </Link>
      </footer>
    </div>
  );
}
