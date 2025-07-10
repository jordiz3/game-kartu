
import TruthOrDareGame from '../../components/TruthOrDareGame';
import Link from 'next/link';
import { Home } from 'lucide-react';

export default function TruthOrDarePage() {
  return (
    <div className="bg-[#1a1a2e] text-[#e0e0e0] min-h-screen flex flex-col items-center justify-center p-4">
      <div className="container mx-auto flex-grow flex items-center justify-center">
        <TruthOrDareGame />
      </div>
      <footer className="text-center py-4">
        <Link href="/" className="text-pink-500 hover:underline inline-flex items-center gap-2">
            <Home size={16}/> Kembali ke Menu Utama
        </Link>
      </footer>
    </div>
  );
}
