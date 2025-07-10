
'use client';

import { useState, useMemo, useEffect } from 'react';
import { Home, Heart, Sparkles, Meh } from 'lucide-react';
import { cn } from '../../lib/utils';
import Link from 'next/link';
import { Button } from '../../components/ui/button';
import { Progress } from '../../components/ui/progress';

const allQuestions = [
    // Kebiasaan & Preferensi Harian
    { a: 'Healing ke Pantai', b: 'Nanjak Gunung' },
    { a: 'Netflix & Chill', b: 'Nge-date Bioskop' },
    { a: 'Masak Bareng', b: 'GoFood Aja' },
    { a: 'Ngopi Cantik', b: 'Ngeteh Santai' },
    { a: 'Tim Anjing', b: 'Tim Kucing' },
    { a: 'Anak Pagi', b: 'Anak Malam' },
    { a: 'Mandi Air Anget', b: 'Mandi Air Dingin' },
    { a: 'OOTD Rapi', b: 'OOTD Comfy' },
    { a: 'Tidur Gelap Gulita', b: 'Tidur Pake Lampu Remang' },
    { a: 'KARAOKE di Mobil', b: 'Dengerin Podcast' },
    
    // Makanan & Minuman
    { a: 'Tim Manis', b: 'Tim Asin' },
    { a: 'Hobi Nyari Pedes', b: 'Hobi Nyari Gurih' },
    { a: 'Pizza Dulu', b: 'Burger Dulu' },
    { a: 'Makan Sushi', b: 'Makan Steak' },
    { a: 'Bubur Diaduk', b: 'Bubur Gak Diaduk' },
    { a: 'Jajan di Luar', b: 'Masak Sendiri' },
    { a: 'Sharing Makanan', b: 'Pesen Masing-Masing' },
    { a: 'Fine Dining', b: 'Street Food' },
    { a: 'Makan Es Krim', b: 'Makan Yogurt' },
    { a: 'Minum Jus', b: 'Minum Smoothie' },

    // Hiburan & Media
    { a: 'Film Ngakak', b: 'Film Bikin Takut' },
    { a: 'Film Baku Hantam', b: 'Film Bucin' },
    { a: 'Musik Top 40', b: 'Musik Senja' },
    { a: 'Nonton Konser', b: 'Nonton Teater' },
    { a: 'Baca Buku Kertas', b: 'Baca di Gadget' },
    { a: 'Game Kompetitif', b: 'Game Mabar Santai' },
    { a: 'Nonton Ulang Favorit', b: 'Nonton yang Lagi Viral' },
    { a: 'Series Barat', b: 'Drakoran' },
    { a: 'Tim Marvel', b: 'Tim DC' },
    { a: 'Nonton Stand-up', b: 'Nonton Sulap' },

    // Gaya Hidup & Hubungan
    { a: 'Liburan Sultan', b: 'Liburan Low Budget' },
    { a: 'Backpacker-an', b: 'Koper-an' },
    { a: 'Anak Kota', b: 'Anak Desa' },
    { a: 'Dadakan', b: 'Terencana' },
    { a: 'Rame-rame', b: 'Circle Kecil' },
    { a: 'Nge-date di Luar', b: 'Nge-date di Rumah' },
    { a: 'Chattingan', b: 'Teleponan' },
    { a: 'Panggilan "Sayang"', b: 'Panggil Nama Aja' },
    { a: 'Tidur Nempel', b: 'Tidur Ada Jarak' },
    { a: 'Malming Keluar', b: 'Malming di Rumah Aja' },

    // Hipotetis & Acak
    { a: 'Bisa Terbang', b: 'Jadi Gaib' },
    { a: 'Ke Masa Lalu', b: 'Ke Masa Depan' },
    { a: 'Hidup Tanpa Kuota', b: 'Hidup Tanpa Musik' },
    { a: 'Duit 100 Juta', b: '10 Sahabat Sejati' },
    { a: 'Tahu Kapan Wafat', b: 'Tahu Kenapa Wafat' },
    { a: 'Gerah Dikit', b: 'Kedinginan Dikit' },
    { a: 'Hari yang Sama Terus', b: 'Lompat Setahun' },
    { a: 'Ngobrol sama Hewan', b: 'Bisa Semua Bahasa' },
    { a: 'Duit Gak Abis-abis', b: 'Waktu Gak Abis-abis' },
];

type Player = 'cipa' | 'jojo' | null;
type Answers = Record<number, 'a' | 'b'>;

const SESSION_QUESTIONS = 25;

export default function ThisOrThatPage() {
    const [questions, setQuestions] = useState<{a: string; b: string}[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [cipaAnswers, setCipaAnswers] = useState<Answers>({});
    const [jojoAnswers, setJojoAnswers] = useState<Answers>({});
    const [activePlayer, setActivePlayer] = useState<Player>(null);
    const [gameState, setGameState] = useState<'player_select' | 'playing' | 'results'>('player_select');
    const [transitionState, setTransitionState] = useState<'in' | 'out' | null>(null);

    const shuffleAndTake = (array: any[], num: number) => {
        const shuffled = [...array].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, num);
    };

    const prepareNewSession = () => {
        const newQuestions = shuffleAndTake(allQuestions, SESSION_QUESTIONS);
        setQuestions(newQuestions);
        setCipaAnswers({});
        setJojoAnswers({});
        setCurrentQuestionIndex(0);
        return newQuestions;
    };
    
    useEffect(() => {
        // Prepare questions on initial load
        if (questions.length === 0) {
            setQuestions(shuffleAndTake(allQuestions, SESSION_QUESTIONS));
        }
    }, [questions.length]);


    const startGame = (player: Player) => {
        let sessionQuestions = questions;
        const cipaDone = Object.keys(cipaAnswers).length >= sessionQuestions.length;
        const jojoDone = Object.keys(jojoAnswers).length >= sessionQuestions.length;

        // If both players have played, start a completely new session.
        if (cipaDone && jojoDone) {
            sessionQuestions = prepareNewSession();
        } else if (sessionQuestions.length === 0) {
            sessionQuestions = prepareNewSession();
        }

        setActivePlayer(player);
        setGameState('playing');
        setCurrentQuestionIndex(0);
        setTransitionState('in');
    };

    const handleChoice = (choice: 'a' | 'b') => {
        if (transitionState) return;

        setTransitionState('out');

        setTimeout(() => {
            if (activePlayer === 'cipa') {
                setCipaAnswers(prev => ({ ...prev, [currentQuestionIndex]: choice }));
            } else if (activePlayer === 'jojo') {
                setJojoAnswers(prev => ({ ...prev, [currentQuestionIndex]: choice }));
            }

            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
                setTransitionState('in');
            } else {
                const cipaDone = Object.keys(cipaAnswers).length === questions.length || (activePlayer === 'cipa');
                const jojoDone = Object.keys(jojoAnswers).length === questions.length || (activePlayer === 'jojo');

                if (cipaDone && jojoDone) {
                    setGameState('results');
                } else {
                    setGameState('player_select');
                }
            }
        }, 500); 
    };
    
    const compatibilityScore = useMemo(() => {
        if (gameState !== 'results') return 0;
        let sameAnswers = 0;
        const totalQuestions = Math.min(Object.keys(cipaAnswers).length, Object.keys(jojoAnswers).length, questions.length);
        if (totalQuestions === 0) return 0;
        
        for (let i = 0; i < totalQuestions; i++) {
            if (cipaAnswers[i] && cipaAnswers[i] === jojoAnswers[i]) {
                sameAnswers++;
            }
        }
        return Math.round((sameAnswers / totalQuestions) * 100);
    }, [gameState, cipaAnswers, jojoAnswers, questions.length]);

    const progress = questions.length > 0 ? Math.round(((currentQuestionIndex + 1) / questions.length) * 100) : 0;

    const ResultDisplay = () => {
        let Icon = Meh;
        let message = "Kalian masih dalam tahap penjajakan!";
        let colorClass = "text-yellow-400";

        if (compatibilityScore >= 80) {
            Icon = Heart;
            message = "Sehati banget! Kalian emang jodoh!";
            colorClass = "text-red-400";
        } else if (compatibilityScore >= 50) {
            Icon = Sparkles;
            message = "Cukup sefrekuensi! Banyak kesamaan di antara kalian.";
            colorClass = "text-cyan-400";
        }

        return (
            <div className="flex flex-col items-center justify-center text-center p-8 bg-black/30 rounded-3xl backdrop-blur-sm border border-white/20 animate-fade-in-scale">
                <h2 className="text-2xl font-bold text-white/80 mb-2">Hasil Kekompakan</h2>
                <Icon className={cn("w-24 h-24 my-4", colorClass)} strokeWidth={1.5} />
                <p className={cn("text-6xl font-bold mb-4", colorClass)}>{compatibilityScore}%</p>
                <p className="text-xl text-white/90 mb-8">{message}</p>
                <Button onClick={prepareNewSession} size="lg" className="bg-white/90 text-slate-800 hover:bg-white font-bold text-lg">
                    Main Lagi
                </Button>
            </div>
        );
    };
    
    if (gameState === 'player_select') {
        const cipaPlayed = questions.length > 0 && Object.keys(cipaAnswers).length >= questions.length;
        const jojoPlayed = questions.length > 0 && Object.keys(jojoAnswers).length >= questions.length;

        return (
             <div className="cosmic-bg min-h-screen flex flex-col items-center justify-center p-4 text-white">
                <div className="text-center mb-12 animate-fade-in">
                    <h1 className="font-display text-5xl md:text-6xl font-bold" style={{textShadow: '0 0 15px rgba(255,255,255,0.3)'}}>This or That</h1>
                    <p className="text-white/80 text-lg mt-2">Seberapa sefrekuensi kalian?</p>
                </div>

                <div className="flex flex-col items-center animate-fade-in-scale">
                    <h2 className="text-3xl font-bold mb-6">Siapa yang main?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Button 
                            onClick={() => startGame('cipa')} 
                            disabled={cipaPlayed}
                            className={cn("player-select-btn h-auto p-8 border-2 bg-pink-500/20 border-pink-400 hover:bg-pink-500/40", {'opacity-50 cursor-not-allowed': cipaPlayed})}>
                            <div className="flex flex-col items-center">
                                <span className="text-4xl mb-2">🌸</span>
                                <span className="text-2xl font-bold">Cipa</span>
                                {cipaPlayed && <span className="text-xs mt-1">(Sudah Main)</span>}
                            </div>
                        </Button>
                        <Button 
                            onClick={() => startGame('jojo')}
                            disabled={jojoPlayed}
                            className={cn("player-select-btn h-auto p-8 border-2 bg-blue-500/20 border-blue-400 hover:bg-blue-500/40", {'opacity-50 cursor-not-allowed': jojoPlayed})}>
                             <div className="flex flex-col items-center">
                                <span className="text-4xl mb-2">⭐</span>
                                <span className="text-2xl font-bold">Jojo</span>
                                {jojoPlayed && <span className="text-xs mt-1">(Sudah Main)</span>}
                            </div>
                        </Button>
                    </div>
                </div>
                 <Link href="/" className="text-white/70 hover:text-white transition-colors inline-flex items-center gap-2 mt-16">
                    <Home size={16}/> Kembali ke Menu Utama
                </Link>
             </div>
        )
    }

    if (gameState === 'results') {
        return (
            <div className="cosmic-bg min-h-screen flex flex-col items-center justify-center p-4 text-white">
                <ResultDisplay />
                 <Link href="/" className="text-white/70 hover:text-white transition-colors inline-flex items-center gap-2 mt-12">
                    <Home size={16}/> Kembali ke Menu Utama
                </Link>
            </div>
        )
    }

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <>
            <style jsx>{`
                .cosmic-bg {
                    background: linear-gradient(225deg, #0f0c29, #302b63, #24243e);
                }
                .choice-glow-a:hover { box-shadow: 0 0 20px #f472b6, 0 0 40px #f472b6; }
                .choice-glow-b:hover { box-shadow: 0 0 20px #60a5fa, 0 0 40px #60a5fa; }
                .player-select-btn { transition: transform 0.2s, box-shadow 0.2s; }
                .player-select-btn:hover:not(:disabled) { transform: translateY(-5px) scale(1.05); box-shadow: 0 10px 20px rgba(0,0,0,0.2); }

                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
                
                @keyframes fade-in-scale { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
                .animate-fade-in-scale { animation: fade-in-scale 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }

                .question-container {
                    transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.5s;
                }
                .question-container.out { transform: translateY(50px) scale(0.9); opacity: 0; }
                .question-container.in { transform: translateY(0px) scale(1); opacity: 1; }

                .choice-card {
                    transition: transform 0.3s, box-shadow 0.3s;
                }
                .choice-card:hover {
                    transform: scale(1.03);
                }
            `}</style>
            <div className="cosmic-bg min-h-screen flex flex-col items-center justify-center p-4 text-white overflow-hidden">
                 <div className="w-full max-w-5xl">
                    <header className="text-center mb-8">
                        <p className="text-lg text-white/80">Giliran: <span className={cn("font-bold", activePlayer === 'cipa' ? 'text-pink-400' : 'text-blue-400')}>{activePlayer === 'cipa' ? 'Cipa' : 'Jojo'}</span></p>
                        <h1 className="font-display text-2xl md:text-3xl font-bold mt-1 text-white/90">
                           Pertanyaan {currentQuestionIndex + 1} dari {questions.length}
                        </h1>
                        <div className="w-full max-w-md mx-auto mt-4">
                           <Progress value={progress} className="h-2 bg-white/20 [&>div]:bg-gradient-to-r [&>div]:from-pink-400 [&>div]:to-blue-400"/>
                        </div>
                    </header>
                    
                    <main className={cn('question-container', transitionState)}>
                        {currentQuestion && (
                            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 md:gap-10 items-stretch">
                                {/* Pilihan A */}
                                <button
                                    onClick={() => handleChoice('a')}
                                    className="choice-card group p-8 rounded-3xl flex flex-col items-center justify-center text-center bg-black/20 border border-white/10 choice-glow-a">
                                    <h2 className="text-3xl md:text-4xl font-bold text-white/90 group-hover:text-white">{currentQuestion.a}</h2>
                                </button>
                                
                                <div className="hidden md:flex items-center justify-center text-2xl font-bold text-white/50">OR</div>

                                {/* Pilihan B */}
                                <button
                                    onClick={() => handleChoice('b')}
                                    className="choice-card group p-8 rounded-3xl flex flex-col items-center justify-center text-center bg-black/20 border border-white/10 choice-glow-b">
                                    <h2 className="text-3xl md:text-4xl font-bold text-white/90 group-hover:text-white">{currentQuestion.b}</h2>
                                </button>
                            </div>
                        )}
                    </main>

                     <footer className="mt-12 text-center">
                        <Link href="/" className="text-white/70 hover:text-white transition-colors inline-flex items-center gap-2">
                            <Home size={16}/> Kembali ke Menu Utama
                        </Link>
                    </footer>
                </div>
            </div>
        </>
    );
}
