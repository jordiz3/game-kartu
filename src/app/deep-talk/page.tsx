
import DeepTalkGame from '../../components/DeepTalkGame';
import Link from 'next/link';
import { Home } from 'lucide-react';

export default function DeepTalkPage() {
  return (
    <div className="gradient-bg min-h-screen flex flex-col items-center justify-center p-4">
      <div className="container mx-auto flex-grow flex items-center justify-center">
        <DeepTalkGame />
      </div>
       <footer className="text-center pt-4 pb-4">
        <Link href="/" className="text-pink-500 hover:underline inline-flex items-center gap-2">
            <Home size={16}/> Kembali ke Menu Utama
        </Link>
      </footer>
    </div>
  );
}
