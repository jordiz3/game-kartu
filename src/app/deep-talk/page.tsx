import DeepTalkGame from '../../components/DeepTalkGame';
import Link from 'next/link';

export default function DeepTalkPage() {
  return (
    <div className="gradient-bg min-h-screen flex flex-col items-center justify-center p-4">
      <div className="container mx-auto flex-grow flex items-center justify-center">
        <DeepTalkGame />
      </div>
       <footer className="text-center pt-4 pb-4">
        <Link href="/" className="text-pink-500 hover:underline">
          Kembali ke Kotak Rahasia 💌
        </Link>
        <span className="mx-2 text-gray-400">|</span>
        <Link href="/wishlist" className="text-pink-500 hover:underline">
          Lihat Wishlist Date Kita 💕
        </Link>
        <span className="mx-2 text-gray-400">|</span>
        <Link href="/truth-or-dare" className="text-pink-500 hover:underline">
          Main Truth or Dare 🔥
        </Link>
      </footer>
    </div>
  );
}
