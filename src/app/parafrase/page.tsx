
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Home, RefreshCw, Clipboard, Loader2, Wand2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Textarea } from '../../components/ui/textarea';
import { useToast } from '../../hooks/use-toast';
import { paraphraseParagraph } from './actions';

type ParaphraseInput = {
  text: string;
};

type ParaphraseOutput = {
  model1: string;
  model2: string;
  model3: string;
};


export default function ParafrasePage() {
  const [originalText, setOriginalText] = useState('');
  const [paraphrasedResults, setParaphrasedResults] = useState<ParaphraseOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleParaphrase = async () => {
    if (originalText.trim().length < 10) {
      toast({
        variant: 'destructive',
        title: 'Teks Terlalu Pendek',
        description: 'Harap masukkan setidaknya 10 karakter untuk diparafrase.',
      });
      return;
    }

    setIsLoading(true);
    setParaphrasedResults(null);

    try {
      const result: ParaphraseOutput = await paraphraseParagraph({ text: originalText });
      if (!result) {
        throw new Error('AI did not return a result.');
      }
      setParaphrasedResults(result);
    } catch (error) {
      console.error('Paraphrasing error:', error);
      toast({
        variant: 'destructive',
        title: 'Gagal Membuat Parafrase',
        description: 'Terjadi kesalahan saat menghubungi AI. Coba lagi nanti.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Teks Disalin!',
      description: 'Hasil parafrase berhasil disalin ke clipboard.',
    });
  };

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800">Alat Parafrase AI (Skripsi)</h1>
          <p className="text-slate-500 mt-2 text-lg">Dapatkan tiga pilihan parafrase dalam gaya formal untuk tugas akhirmu.</p>
        </header>

        <Card className="w-full shadow-lg mb-8">
          <CardContent className="p-6">
            <Textarea
              value={originalText}
              onChange={(e) => setOriginalText(e.target.value)}
              placeholder="Masukkan teks atau paragraf yang ingin Anda parafrase di sini..."
              className="min-h-[150px] text-base"
              rows={6}
            />
            <Button
              onClick={handleParaphrase}
              disabled={isLoading}
              className="w-full mt-4 text-lg py-6 bg-indigo-600 hover:bg-indigo-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Sedang Memproses...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-5 w-5" />
                  Buat Parafrase Sekarang
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {isLoading && (
          <div className="text-center">
            <Wand2 className="h-12 w-12 text-indigo-500 mx-auto animate-pulse" />
            <p className="mt-4 text-slate-600">AI sedang meracik kata-kata baru untukmu...</p>
          </div>
        )}

        {paraphrasedResults && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Model 1</CardTitle>
                <CardDescription>Pilihan parafrase pertama.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 mb-4 min-h-[100px]">{paraphrasedResults.model1}</p>
                <Button variant="outline" size="sm" onClick={() => handleCopyToClipboard(paraphrasedResults.model1)}>
                  <Clipboard className="mr-2 h-4 w-4" />
                  Salin
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Model 2</CardTitle>
                <CardDescription>Pilihan parafrase kedua.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 mb-4 min-h-[100px]">{paraphrasedResults.model2}</p>
                <Button variant="outline" size="sm" onClick={() => handleCopyToClipboard(paraphrasedResults.model2)}>
                  <Clipboard className="mr-2 h-4 w-4" />
                  Salin
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Model 3</CardTitle>
                <CardDescription>Pilihan parafrase ketiga.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 mb-4 min-h-[100px]">{paraphrasedResults.model3}</p>
                <Button variant="outline" size="sm" onClick={() => handleCopyToClipboard(paraphrasedResults.model3)}>
                  <Clipboard className="mr-2 h-4 w-4" />
                  Salin
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <footer className="absolute bottom-4 text-center">
        <Link href="/" className="text-pink-500 hover:underline inline-flex items-center gap-2">
          <Home size={16}/> Kembali ke Menu Utama
        </Link>
      </footer>

      <style jsx>{`
        @keyframes fade-in {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
            animation: fade-in 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
