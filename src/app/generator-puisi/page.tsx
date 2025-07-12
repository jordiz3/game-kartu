'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Home, Loader2, Wand2, Sparkles, Send, Trash2, Clipboard } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { useToast } from '../../hooks/use-toast';
import { generatePoem, GeneratePoemOutput } from '../../ai/flows/generate-poem-flow';
import { Badge } from '../../components/ui/badge';

export default function GeneratorPuisiPage() {
  const [keywords, setKeywords] = useState<string[]>([]);
  const [currentKeyword, setCurrentKeyword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GeneratePoemOutput | null>(null);
  const { toast } = useToast();

  const handleAddKeyword = () => {
    if (currentKeyword.trim() && !keywords.includes(currentKeyword.trim())) {
      if (keywords.length >= 5) {
        toast({ variant: 'destructive', title: 'Maksimal 5 Kata Kunci' });
        return;
      }
      setKeywords([...keywords, currentKeyword.trim()]);
      setCurrentKeyword('');
    }
  };

  const handleRemoveKeyword = (keywordToRemove: string) => {
    setKeywords(keywords.filter(keyword => keyword !== keywordToRemove));
  };

  const handleGeneratePoem = async () => {
    if (keywords.length === 0) {
      toast({ variant: 'destructive', title: 'Kata Kunci Kosong', description: 'Masukkan minimal satu kata kunci inspirasi.' });
      return;
    }
    setIsLoading(true);
    setResult(null);
    try {
      const poemResult = await generatePoem({
        keywords,
        coupleNames: { person1: 'Cipa', person2: 'Jojo' },
      });
      setResult(poemResult);
    } catch (error) {
      console.error('Gagal membuat puisi:', error);
      toast({
        variant: 'destructive',
        title: 'Pena Sang Penyair Patah',
        description: 'AI-nya lagi butuh inspirasi. Coba lagi beberapa saat ya.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!result) return;
    const textToCopy = `${result.title}\n\n${result.poem}`;
    navigator.clipboard.writeText(textToCopy);
    toast({ title: 'Puisi disalin!' });
  };


  return (
    <div className="bg-gradient-to-br from-indigo-100 to-rose-100 flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-2xl">
        <Card className="w-full shadow-2xl backdrop-blur-sm bg-white/60">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-2">
              <Wand2 className="text-purple-500" />
              Generator Puisi Romantis
            </CardTitle>
            <CardDescription>Beri AI beberapa kata, dan ia akan merangkai puisi untukmu & pasangan.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label htmlFor="keyword-input" className="font-medium text-gray-700">
                  Masukkan Kata Kunci Inspirasi (maks. 5)
                </label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="keyword-input"
                    value={currentKeyword}
                    onChange={(e) => setCurrentKeyword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddKeyword()}
                    placeholder="e.g., senja, kopi, hujan..."
                  />
                  <Button onClick={handleAddKeyword} variant="secondary" disabled={!currentKeyword.trim()}>
                    <Send size={16} />
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 min-h-[2.5rem]">
                {keywords.map(keyword => (
                  <Badge key={keyword} variant="outline" className="text-base py-1 px-3 bg-white shadow-sm">
                    {keyword}
                    <button onClick={() => handleRemoveKeyword(keyword)} className="ml-2 text-gray-400 hover:text-red-500">
                      <Trash2 size={12} />
                    </button>
                  </Badge>
                ))}
              </div>

              <Button onClick={handleGeneratePoem} className="w-full text-lg py-6" disabled={isLoading || keywords.length === 0}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 animate-spin" /> Merangkai Kata...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2" /> Buatkan Puisi!
                  </>
                )}
              </Button>
            </div>

            {result && (
              <div className="mt-8 pt-6 border-t border-dashed animate-fade-in space-y-4 bg-white/50 p-6 rounded-lg">
                <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-bold font-display text-gray-800">{result.title}</h3>
                    <Button variant="ghost" size="icon" onClick={copyToClipboard}>
                        <Clipboard className="text-gray-500" />
                    </Button>
                </div>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed italic">{result.poem}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <footer className="text-center mt-8">
          <Link href="/" className="text-purple-600 hover:underline inline-flex items-center gap-2">
            <Home size={16} /> Kembali ke Menu Utama
          </Link>
        </footer>
      </div>

       <style jsx>{`
            @keyframes fade-in {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in {
                animation: fade-in 0.5s ease-out forwards;
            }
        `}</style>
    </div>
  );
}
