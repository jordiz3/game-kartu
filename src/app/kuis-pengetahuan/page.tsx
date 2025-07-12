'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Home, Loader2, Award, BrainCircuit, Shuffle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '../../components/ui/card';
import { useToast } from '../../hooks/use-toast';
import { generateQuizQuestion, QuizQuestionOutput } from '../../ai/flows/generate-quiz-flow';
import { cn } from '../../lib/utils';

type AnswerStatus = 'idle' | 'correct' | 'incorrect';

export default function KuisPengetahuanPage() {
  const [quizData, setQuizData] = useState<QuizQuestionOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answerStatus, setAnswerStatus] = useState<AnswerStatus>('idle');
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const { toast } = useToast();

  const fetchQuestion = useCallback(async () => {
    setIsLoading(true);
    setSelectedAnswer(null);
    setAnswerStatus('idle');
    try {
      const data = await generateQuizQuestion();
      setQuizData(data);
    } catch (error) {
      console.error('Gagal memuat pertanyaan:', error);
      toast({
        variant: 'destructive',
        title: 'Gagal Memuat Pertanyaan',
        description: 'AI sepertinya sedang butuh istirahat. Coba lagi nanti.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchQuestion();
  }, [fetchQuestion]);

  const handleAnswerSelect = (option: string) => {
    if (answerStatus !== 'idle') return;

    setSelectedAnswer(option);
    setQuestionsAnswered(prev => prev + 1);

    if (option === quizData?.correctAnswer) {
      setAnswerStatus('correct');
      setScore(prev => prev + 1);
    } else {
      setAnswerStatus('incorrect');
    }
  };

  const getButtonClass = (option: string) => {
    if (answerStatus === 'idle') {
      return 'bg-white hover:bg-gray-100 text-gray-800';
    }
    if (option === selectedAnswer) {
      return answerStatus === 'correct' ? 'bg-green-500 text-white' : 'bg-red-500 text-white';
    }
    if (option === quizData?.correctAnswer) {
      return 'bg-green-500/50 text-white';
    }
    return 'bg-gray-200 text-gray-500 cursor-not-allowed';
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 to-purple-50 flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-2xl shadow-2xl backdrop-blur-sm bg-white/70">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-2">
            <BrainCircuit className="text-blue-500" />
            Kuis Pengetahuan
          </CardTitle>
          <CardDescription>Uji wawasanmu bersama Cipa & Jojo!</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center bg-white p-3 rounded-lg shadow-inner mb-6">
            <div className="text-lg font-bold text-gray-700">Skor: <span className="text-blue-600">{score}</span></div>
            <div className="text-sm text-gray-500">Terjawab: {questionsAnswered}</div>
          </div>
          
          {isLoading ? (
            <div className="flex flex-col items-center justify-center min-h-[250px] text-gray-500">
              <Loader2 className="h-10 w-10 animate-spin mb-4" />
              <p>Sedang menyiapkan pertanyaan...</p>
            </div>
          ) : quizData ? (
            <div className="space-y-4">
              <p className="text-center text-xl font-semibold text-gray-800 min-h-[60px] flex items-center justify-center">
                {quizData.question}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {quizData.options.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => handleAnswerSelect(option)}
                    disabled={answerStatus !== 'idle'}
                    className={cn('h-auto py-4 text-base whitespace-normal text-center justify-center transition-all duration-300', getButtonClass(option))}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
             <div className="text-center text-red-500 min-h-[250px] flex items-center justify-center">
                Gagal memuat pertanyaan. Silakan coba lagi.
             </div>
          )}
          
          {answerStatus !== 'idle' && (
             <div className="mt-6 text-center animate-fade-in">
                <Button onClick={fetchQuestion} className="w-full text-lg py-6" disabled={isLoading}>
                    <Shuffle className="mr-2"/> Pertanyaan Berikutnya
                </Button>
             </div>
          )}
        </CardContent>
      </Card>
      <footer className="absolute bottom-4 text-center">
        <Link href="/" className="text-blue-600 hover:underline inline-flex items-center gap-2">
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