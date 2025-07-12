
'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Home, Lightbulb, CheckCircle, Plus, Trash2, Wand2, Loader2, X } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { cn } from '../../lib/utils';
import { v4 as uuidv4 } from 'uuid';
import { generateCrossword, GenerateCrosswordOutput } from '../../ai/flows/generate-crossword-flow';
import { useToast } from '../../hooks/use-toast';

type GameState = 'input' | 'generating' | 'playing' | 'completed' | 'error';

type WordInput = {
  id: string;
  question: string;
  answer: string;
};

export default function TtsRomantisPage() {
  const [gameState, setGameState] = useState<GameState>('input');
  const [wordInputs, setWordInputs] = useState<WordInput[]>([
    { id: uuidv4(), question: 'Tempat kencan pertama', answer: 'bioskop' },
    { id: uuidv4(), question: 'Panggilan sayang untuk Cipa', answer: 'ayang' },
    { id: uuidv4(), question: 'Makanan Jepang favorit', answer: 'sushi' },
  ]);
  const [generatedData, setGeneratedData] = useState<GenerateCrosswordOutput | null>(null);
  const [userAnswers, setUserAnswers] = useState<string[][]>([]);
  const { toast } = useToast();
  
  const inputRefs = useRef<(HTMLInputElement | null)[][]>([]);

  useEffect(() => {
    if (generatedData?.grid) {
      const grid = generatedData.grid;
      const emptyAnswers = Array(grid.length).fill(0).map(() => Array(grid[0].length).fill(''));
      setUserAnswers(emptyAnswers);
      inputRefs.current = Array(grid.length).fill(0).map(() => Array(grid[0].length).fill(null));
    }
  }, [generatedData]);

  const handleAddWord = () => {
    if (wordInputs.length >= 10) {
      toast({ variant: 'destructive', title: 'Maksimal 10 kata', description: 'Agar teka-teki tidak terlalu rumit, batasi hingga 10 kata ya.' });
      return;
    }
    setWordInputs([...wordInputs, { id: uuidv4(), question: '', answer: '' }]);
  };

  const handleWordChange = (id: string, field: 'question' | 'answer', value: string) => {
    setWordInputs(
      wordInputs.map((word) =>
        word.id === id ? { ...word, [field]: field === 'answer' ? value.toLowerCase().replace(/[^a-z]/g, '') : value } : word
      )
    );
  };
  
  const handleRemoveWord = (id: string) => {
    setWordInputs(wordInputs.filter((word) => word.id !== id));
  };

  const handleGenerate = async () => {
    const validInputs = wordInputs.filter(w => w.question.trim() && w.answer.trim());
    if (validInputs.length < 2) {
      toast({ variant: 'destructive', title: 'Kurang Kata', description: 'Masukkan setidaknya 2 pertanyaan dan jawaban.' });
      return;
    }
    
    setGameState('generating');
    try {
      const result = await generateCrossword(validInputs.map(({question, answer}) => ({question, answer})));
      if (!result || !result.grid || !result.words) {
         throw new Error("Hasil AI tidak valid.");
      }
      setGeneratedData(result);
      setGameState('playing');
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Gagal Membuat TTS', description: 'AI sepertinya sedang bingung. Coba ganti kata atau coba lagi nanti.' });
      setGameState('input');
    }
  };

  const handleInputChange = (row: number, col: number, value: string) => {
    const newAnswers = userAnswers.map(r => [...r]);
    newAnswers[row][col] = value.toUpperCase().slice(0, 1);
    setUserAnswers(newAnswers);

    if (value && col < (generatedData?.grid[0].length ?? 0) - 1 && generatedData?.grid[row][col + 1] !== ' ') {
      inputRefs.current[row][col + 1]?.focus();
    } else if (value && row < (generatedData?.grid.length ?? 0) - 1) {
      for (let i = row + 1; i < (generatedData?.grid.length ?? 0); i++) {
        if (generatedData?.grid[i][col] !== ' ') {
          inputRefs.current[i][col]?.focus();
          break;
        }
      }
    }
  };

  const checkAnswers = () => {
    if (!generatedData) return;
    let correct = true;
    for (const word of generatedData.words) {
      const answer = word.answer.toUpperCase();
      let userAnswer = '';
      if (word.direction === 'across') {
        for (let i = 0; i < answer.length; i++) {
          userAnswer += userAnswers[word.row][word.col + i];
        }
      } else {
        for (let i = 0; i < answer.length; i++) {
          userAnswer += userAnswers[word.row + i][word.col];
        }
      }
      if (userAnswer !== answer) {
        correct = false;
        break;
      }
    }
    
    if (correct) {
      setGameState('completed');
    } else {
      toast({ variant: 'destructive', title: 'Belum Tepat', description: 'Oops, masih ada jawaban yang salah. Coba periksa lagi!' });
    }
  };

  const startNewGame = () => {
    setGameState('input');
    setGeneratedData(null);
    setUserAnswers([]);
  }

  const renderContent = () => {
    switch (gameState) {
      case 'input':
        return (
          <div className="animate-fade-in space-y-4">
            <div className="space-y-3">
              {wordInputs.map((word, index) => (
                <div key={word.id} className="flex flex-col sm:flex-row gap-2 items-start bg-gray-50 p-3 rounded-lg">
                  <span className="font-bold text-gray-500 text-sm sm:pt-2">#{index + 1}</span>
                  <div className="flex-grow space-y-2">
                    <Input placeholder="Pertanyaan" value={word.question} onChange={(e) => handleWordChange(word.id, 'question', e.target.value)} />
                    <Input placeholder="Jawaban (satu kata, tanpa spasi)" value={word.answer} onChange={(e) => handleWordChange(word.id, 'answer', e.target.value)} />
                  </div>
                  <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-100 h-9 w-9" onClick={() => handleRemoveWord(word.id)} disabled={wordInputs.length <= 1}>
                    <Trash2 size={18} />
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
                <Button variant="outline" onClick={handleAddWord}>
                    <Plus className="mr-2" size={16} /> Tambah Kata
                </Button>
                <Button onClick={handleGenerate} className="flex-grow bg-pink-500 hover:bg-pink-600">
                    <Wand2 className="mr-2" size={16} /> Buat TTS Ajaib!
                </Button>
            </div>
          </div>
        );

      case 'generating':
        return (
          <div className="text-center space-y-4 py-16 animate-pulse">
            <Loader2 className="w-16 h-16 text-pink-500 mx-auto animate-spin" />
            <h2 className="text-2xl font-bold text-gray-800">AI Sedang Merangkai Kata...</h2>
            <p className="text-gray-600">Mohon tunggu sebentar, kami sedang membuat teka-teki spesial untukmu!</p>
          </div>
        );

      case 'playing':
        if (!generatedData) return null;
        return (
          <div className="flex flex-col lg:flex-row gap-6 animate-fade-in">
            <div className="flex-shrink-0 mx-auto">
              <div className="grid bg-gray-700 p-2 rounded-lg gap-1" style={{ gridTemplateColumns: `repeat(${generatedData.grid[0].length}, minmax(0, 1fr))` }}>
                {generatedData.grid.map((row, rIndex) =>
                  row.map((cell, cIndex) => {
                    const wordStart = generatedData.words.find(w => w.row === rIndex && w.col === cIndex);
                    return (
                        <div key={`${rIndex}-${cIndex}`} className={cn("w-8 h-8 md:w-10 md:h-10", cell === ' ' && 'bg-gray-700 rounded-sm')}>
                        {cell !== ' ' && (
                            <div className="relative w-full h-full">
                                <input
                                    ref={el => {
                                        if (!inputRefs.current[rIndex]) inputRefs.current[rIndex] = [];
                                        inputRefs.current[rIndex][cIndex] = el;
                                    }}
                                    type="text"
                                    maxLength={1}
                                    value={userAnswers[rIndex]?.[cIndex] || ''}
                                    onChange={(e) => handleInputChange(rIndex, cIndex, e.target.value)}
                                    className="w-full h-full text-center text-lg md:text-xl font-bold uppercase bg-white border border-gray-400 rounded-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                                />
                                {wordStart && <span className="absolute top-0 left-1 text-xs font-bold text-gray-500">{wordStart.num}</span>}
                            </div>
                        )}
                        </div>
                    );
                }))}
              </div>
            </div>
            <div className="flex-grow bg-gray-50 p-4 rounded-lg border">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 max-h-[350px] overflow-y-auto">
                    <div>
                        <h3 className="font-bold text-lg mb-2 text-gray-700">Mendatar</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            {generatedData.words.filter(q => q.direction === 'across').sort((a,b) => a.num - b.num).map(q => (
                                <li key={q.num}>{q.num}. {q.question}</li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg mb-2 text-gray-700">Menurun</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            {generatedData.words.filter(q => q.direction === 'down').sort((a,b) => a.num - b.num).map(q => (
                                <li key={q.num}>{q.num}. {q.question}</li>
                            ))}
                        </ul>
                    </div>
                </div>
                 <div className="mt-6 flex flex-col sm:flex-row gap-2">
                    <Button onClick={startNewGame} variant="outline" className="w-full sm:w-auto">
                       <X className="mr-2" size={16}/> Mulai Baru
                    </Button>
                    <Button onClick={checkAnswers} className="w-full sm:flex-grow bg-green-500 hover:bg-green-600">
                        <CheckCircle className="mr-2" size={16}/> Cek Jawaban
                    </Button>
                </div>
            </div>
          </div>
        );

      case 'completed':
        return (
          <div className="text-center space-y-4 animate-fade-in py-8">
            <CheckCircle className="w-24 h-24 text-green-500 mx-auto" />
            <h2 className="text-2xl font-bold text-gray-800">Kalian Hebat!</h2>
            <p className="text-gray-600">Semua jawaban benar. Kekompakan kalian luar biasa!</p>
            <Button onClick={startNewGame}>Buat Teka-Teki Baru</Button>
          </div>
        );

      case 'error':
         return (
          <div className="text-center space-y-4 py-8">
            <h2 className="text-2xl font-bold text-red-500">Oops, Terjadi Kesalahan</h2>
            <p className="text-gray-600">AI gagal membuat teka-teki. Silakan coba lagi.</p>
            <Button onClick={startNewGame}>Coba Lagi</Button>
          </div>
        );
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-4xl shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-800">Generator TTS Romantis</CardTitle>
          <CardDescription>
            {gameState === 'input'
              ? 'Masukkan pertanyaan & jawaban tentang hubungan kalian, lalu biarkan AI membuat TTS!'
              : 'Seberapa ingat kalian dengan kenangan bersama?'}
          </CardDescription>
        </CardHeader>
        <CardContent>{renderContent()}</CardContent>
      </Card>

      <footer className="absolute bottom-4 text-center">
        <Link href="/" className="text-pink-500 hover:underline inline-flex items-center gap-2">
          <Home size={16} /> Kembali ke Menu Utama
        </Link>
      </footer>
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
