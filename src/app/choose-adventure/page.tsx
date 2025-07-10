
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Home, Loader2, Sparkles } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { useToast } from '../../hooks/use-toast';
import { continueAdventure, AdventureOutput } from '../../ai/flows/choose-adventure-flow';
import { cn } from '../../lib/utils';

const INITIAL_PROMPT = 'Mulai Petualangan';
const INITIAL_CHOICE = 'Mulai';

export default function ChooseAdventurePage() {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'error'>('start');
  const [story, setStory] = useState<AdventureOutput | null>(null);
  const [fullStory, setFullStory] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleStartGame = async () => {
    setIsLoading(true);
    setGameState('playing');
    setFullStory([]);
    try {
      const result = await continueAdventure({
        previousStory: INITIAL_PROMPT,
        choice: INITIAL_CHOICE,
      });
      setStory(result);
      setFullStory([result.storySegment]);
    } catch (error) {
      console.error('Error starting adventure:', error);
      toast({
        variant: 'destructive',
        title: 'Gagal Memulai Petualangan',
        description: 'Sepertinya penyihir cerita sedang istirahat. Coba lagi nanti.',
      });
      setGameState('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMakeChoice = async (choice: string) => {
    if (!story) return;

    setIsLoading(true);
    const previousStoryText = story.storySegment;

    try {
      const result = await continueAdventure({
        previousStory: previousStoryText,
        choice: choice,
      });
      setStory(result);
      setFullStory(prev => [...prev, result.storySegment]);
    } catch (error) {
      console.error('Error continuing adventure:', error);
      toast({
        variant: 'destructive',
        title: 'Cerita Tersendat',
        description: 'Alur cerita sepertinya buntu. Coba buat pilihan lain atau mulai ulang.',
      });
      setGameState('error');
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    if (isLoading && gameState === 'start') {
        return (
             <div className="text-center text-white">
                <Loader2 className="mx-auto h-12 w-12 animate-spin mb-4" />
                <p className="text-lg">Pena ajaib sedang menulis awal petualanganmu...</p>
            </div>
        )
    }

    if (gameState === 'start') {
      return (
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white font-display" style={{ textShadow: '0 0 20px rgba(0,0,0,0.3)' }}>
            Petualangan Ajaib
          </h1>
          <p className="text-xl text-white/80 mt-4 mb-8">Pilih jalan ceritamu sendiri, Cipa & Jojo!</p>
          <Button onClick={handleStartGame} size="lg" className="bg-white/90 text-slate-800 hover:bg-white font-bold text-xl py-8 px-10 rounded-full shadow-lg transition-transform hover:scale-105">
            <Sparkles className="mr-3" /> Mulai Petualangan
          </Button>
        </div>
      );
    }

    if (gameState === 'error') {
        return (
            <div className="text-center text-white bg-red-500/30 p-8 rounded-2xl">
                <h2 className="text-3xl font-bold mb-4">Oops, Ada Naga!</h2>
                <p className="mb-6">Terjadi kesalahan saat memuat cerita. Silakan mulai petualangan baru.</p>
                <Button onClick={() => setGameState('start')} size="lg" variant="secondary">
                    Kembali ke Awal
                </Button>
            </div>
        )
    }
    
    if (story) {
      return (
        <div className="w-full animate-fade-in-scale">
            <Card className="bg-black/30 backdrop-blur-sm border-white/20 text-white shadow-2xl">
                <CardContent className="p-6 md:p-8">
                    <div className="story-display mb-8">
                       {fullStory.map((segment, index) => (
                           <p key={index} className={cn("leading-relaxed text-lg mb-4 text-white/90", {'font-bold text-white': index === fullStory.length - 1, 'opacity-70': index < fullStory.length - 1})}>
                               {segment}
                           </p>
                       ))}
                    </div>

                    <div className="relative border-t-2 border-dashed border-white/20 my-6 pt-6">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#2a2a3e] px-3 text-white/80">PILIH LANGKAHMU</div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button onClick={() => handleMakeChoice(story.choiceA)} disabled={isLoading} size="lg" className="choice-button h-auto min-h-[68px] py-3">
                            <span className="flex items-center gap-2">
                                {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
                                {story.choiceA}
                            </span>
                        </Button>
                        <Button onClick={() => handleMakeChoice(story.choiceB)} disabled={isLoading} size="lg" className="choice-button h-auto min-h-[68px] py-3">
                             <span className="flex items-center gap-2">
                                {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
                                {story.choiceB}
                             </span>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
      );
    }

    return null;
  };

  return (
    <>
        <style jsx>{`
            .adventure-bg {
                background: linear-gradient(180deg, #1d2b4a 0%, #4a4260 100%);
            }
             @keyframes fade-in-scale { 
                from { opacity: 0; transform: scale(0.95); } 
                to { opacity: 1; transform: scale(1); } 
            }
            .animate-fade-in-scale { 
                animation: fade-in-scale 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; 
            }
            .choice-button {
                background-color: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                color: white;
                white-space: normal;
                line-height: 1.4;
                text-align: center;
                transition: all 0.2s ease-in-out;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .choice-button:hover:not(:disabled) {
                background-color: rgba(255, 255, 255, 0.2);
                transform: translateY(-3px);
                box-shadow: 0 8px 25px rgba(0,0,0,0.2);
            }
        `}</style>
        <div className="adventure-bg min-h-screen flex flex-col items-center justify-center p-4 font-nunito">
          <div className="w-full max-w-2xl">
            {renderContent()}
          </div>
          <footer className="text-center mt-8">
            <Link href="/" className="text-white/70 hover:text-white transition-colors inline-flex items-center gap-2">
                <Home size={16}/> Kembali ke Menu Utama
            </Link>
          </footer>
        </div>
    </>
  );
}
