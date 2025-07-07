import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Swords } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 font-pixel">
      <header className="text-center mb-8">
        <h1 className="text-5xl md:text-6xl text-yellow-400 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
          Game Kartu
        </h1>
        <p className="text-gray-400 mt-2">Selamat Datang di Arena Pertarungan!</p>
      </header>

      <main className="w-full max-w-4xl">
        <Card className="bg-gray-800/50 border-2 border-yellow-500 shadow-lg shadow-yellow-500/10">
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center h-64 border-4 border-dashed border-gray-600 rounded-lg">
              <p className="text-gray-500 text-2xl mb-4">Arena Permainan</p>
              <Swords className="h-16 w-16 text-gray-500" />
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 flex justify-center">
          <Button size="lg" className="bg-yellow-500 text-gray-900 font-bold hover:bg-yellow-400 text-xl px-10 py-6 rounded-lg shadow-lg hover:shadow-yellow-400/20 transition-all duration-300 transform hover:-translate-y-1">
            Mulai Permainan Baru
          </Button>
        </div>
      </main>

      <footer className="mt-12 text-center text-gray-500 text-sm">
        <p>Dibuat dengan Next.js & Tailwind CSS</p>
      </footer>
    </div>
  );
}
