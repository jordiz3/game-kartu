import TruthOrDareGame from '../../components/TruthOrDareGame';
import Link from 'next/link';

export default function TruthOrDarePage() {
  return (
    <div className="bg-[#1a1a2e] text-[#e0e0e0] min-h-screen flex flex-col items-center justify-center p-4">
      <div className="container mx-auto flex-grow flex items-center justify-center">
        <TruthOrDareGame />
      </div>
      <footer className="text-center py-4">
        <Link href="/" className="text-pink-500 hover:underline">
          Kembali ke Kotak Rahasia 💌
        </Link>
        <span className="mx-2 text-gray-400">|</span>
        <Link href="/wishlist" className="text-pink-500 hover:underline">
          Lihat Wishlist Date Kita 💕
        </Link>
        <span className="mx-2 text-gray-400">|</span>
        <Link href="/deep-talk" className="text-pink-500 hover:underline">
          Main Kartu Deep Talk 🎴
        </Link>
      </footer>
    </div>
  );
}
