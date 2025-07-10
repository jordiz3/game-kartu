
'use client';

import { useState, useEffect, useRef } from 'react';
import { Home, Check } from 'lucide-react';
import { cn } from '../../lib/utils';
import Link from 'next/link';

const questions = [
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

    // Love Language & Interaksi
    { a: 'Ngasi Kado', b: 'Dikasih Kado' },
    { a: 'Waktu Berdua', b: 'Sentuhan Fisik' },
    { a: 'Dikasih Semangat', b: 'Dibantuin Langsung' },
    { a: 'Gandengan Tangan', b: 'Dirangkul' },
    { a: 'Dikasih Kejutan', b: 'Ngerencanain Bareng' },
    { a: 'Joget Bareng', b: 'Nyanyi Bareng' },
    { a: 'Ngomong Langsung', b: 'Nulis Surat' },
    { a: 'Minta Maaf Duluan', b: 'Nungguin' },
    { a: 'Dipuji Depan Temen', b: 'Dipuji Pas Berdua' },
    { a: 'Deep Talk', b: 'Gibah Bareng' },

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
    { a: 'Makan Itu Terus', b: 'Dengerin Lagu Itu Terus' },
    
    // Lebih banyak pertanyaan...
    { a: 'Rumah Minimalis', b: 'Rumah Vintage' },
    { a: 'Mobil Sport', b: 'Mobil Off-road' },
    { a: 'OOTD Monokrom', b: 'OOTD Warna-warni' },
    { a: 'Tim Sneakers', b: 'Tim Boots' },
    { a: 'Rambut Gondrong', b: 'Rambut Cepak' },
    { a: 'Nambah Tato', b: 'Nambah Tindik' },
    { a: 'Vibe Musim Semi', b: 'Vibe Musim Gugur' },
    { a: 'Suasana Hujan', b: 'Suasana Salju' },
    { a: 'Sunrise Hunter', b: 'Sunset Hunter' },
    { a: 'Jalan Santai', b: 'Gowes' },
    { a: 'Main Air', b: 'Hiking' },
    { a: 'Yoga/Pilates', b: 'Angkat Beban' },
    { a: 'Cokelat Manis', b: 'Cokelat Pahit' },
    { a: 'Kentang Goreng', b: 'Onion Ring' },
    { a: 'Tim Windows', b: 'Tim Mac' },
    { a: 'Tim Android', b: 'Tim iOS' },
    { a: 'Scrolling Instagram', b: 'Scrolling TikTok' },
    { a: 'WFO', b: 'WFH' },
    { a: 'Jadi Seleb', b: 'Jadi Sultan' },
    { a: 'Pinter', b: 'Bijak' },
    { a: 'Jadi Leader', b: 'Jadi Tim Sukses' },
    { a: 'Public Speaking', b: 'Nulis Konten' },
    { a: 'Ultah Rame-rame', b: 'Ultah Intimate' },
    { a: 'Pakai Jam Tangan', b: 'Liat HP Aja' },
    { a: 'Tinggal di Apartemen', b: 'Tinggal di Rumah Tapak' },
    { a: 'Banyak Kenalan', b: 'Dikit Tapi Bestie' },
    { a: 'Jadi Fotografer', b: 'Jadi Modelnya' },
    { a: 'Museum Seni', b: 'Museum Sains' },
    { a: 'Naik Roller Coaster', b: 'Naik Bianglala' },
    { a: 'Sarapan Manis', b: 'Sarapan Gurih' },
];

export default function ThisOrThatPage() {
    const [shuffledQuestions, setShuffledQuestions] = useState<{a: string, b: string}[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [selection, setSelection] = useState<'a' | 'b' | null>(null);
    const [isFinished, setIsFinished] = useState(false);
    const [animate, setAnimate] = useState(false);
    const gameAreaRef = useRef<HTMLDivElement>(null);
    const choiceARef = useRef<HTMLDivElement>(null);
    const choiceBRef = useRef<HTMLDivElement>(null);


    const shuffleArray = (array: any[]) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    const startGame = () => {
        setIsFinished(false);
        setCurrentQuestionIndex(0);
        setSelection(null);
        setShuffledQuestions(shuffleArray([...questions]));
        setAnimate(true);
    };

    const restartGame = () => {
        startGame();
    }

    const loadQuestion = () => {
        setAnimate(false);
        setSelection(null);
        if (currentQuestionIndex >= shuffledQuestions.length) {
            setIsFinished(true);
        } else {
            setTimeout(() => setAnimate(true), 50); 
        }
    };
    
    const handleChoice = (selectedChoice: 'a' | 'b') => {
        if (isTransitioning) return;
        
        setIsTransitioning(true);
        setSelection(selectedChoice);

        setTimeout(() => {
            setCurrentQuestionIndex(prevIndex => prevIndex + 1);
            setIsTransitioning(false);
        }, 1000); 
    };
    
    useEffect(() => {
        startGame();
    }, []);

    useEffect(() => {
        if (!isTransitioning) {
            loadQuestion();
        }
    }, [currentQuestionIndex]);

    const currentQuestion = shuffledQuestions[currentQuestionIndex];

    return (
        <>
            <style jsx>{`
                .gradient-bg {
                    background: linear-gradient(-45deg, #ff9a9e, #fad0c4, #a1c4fd, #c2e9fb);
                    background-size: 400% 400%;
                    animation: gradient-animation 15s ease infinite;
                }
                @keyframes gradient-animation {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                }
                .choice-card {
                    transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
                    cursor: pointer;
                    position: relative;
                    transform-style: preserve-3d;
                }
                .choice-card:hover {
                    transform: scale(1.05) rotateY(5deg) rotateX(5deg);
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.3);
                }
                .choice-card.selected {
                    transform: scale(1.1) !important;
                    opacity: 1 !important;
                    box-shadow: 0 0 40px rgba(255, 255, 255, 0.8);
                }
                .choice-card.not-selected {
                    transform: scale(0.9);
                    opacity: 0.5;
                    filter: grayscale(80%);
                }
                .game-container {
                    perspective: 1500px;
                }
                .question-transition {
                    animation: flipIn 0.6s forwards;
                }
                @keyframes flipIn {
                    from {
                        transform: rotateX(-90deg) scale(0.9);
                        opacity: 0;
                    }
                    to {
                        transform: rotateX(0deg) scale(1);
                        opacity: 1;
                    }
                }
                .choice-text {
                    transition: opacity 0.2s ease-in-out;
                }
                .checkmark {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%) scale(0.5);
                    opacity: 0;
                    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                    font-size: 6rem;
                    color: white;
                    text-shadow: 0 0 20px rgba(0,0,0,0.3);
                }
                .choice-card.selected .choice-text {
                    opacity: 0;
                }
                .choice-card.selected .checkmark {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                }
                .or-separator {
                    animation: pulse 2s infinite;
                }
            `}</style>
            <div className="gradient-bg min-h-screen flex flex-col items-center justify-center p-4">
                 <div className="game-container w-full max-w-4xl text-center">
                    <header className="mb-10">
                        <h1 className="font-display text-4xl md:text-5xl font-bold text-white" style={{textShadow: '2px 2px 10px rgba(0,0,0,0.2)'}}>This or That</h1>
                        <p className="text-white/80 text-lg mt-2">Edisi Pasangan</p>
                    </header>
                    
                    {!isFinished ? (
                         <main ref={gameAreaRef} className={cn('min-h-[350px] md:min-h-[400px]', { 'question-transition': animate })}>
                            {currentQuestion && (
                                <div id="question-box" className="flex flex-col md:flex-row gap-6 md:gap-10 items-center">
                                    <div 
                                        ref={choiceARef}
                                        onClick={() => handleChoice('a')}
                                        className={cn('choice-card w-full h-64 md:h-80 flex items-center justify-center p-6 rounded-3xl shadow-lg border-2 border-white/50', {
                                            'selected': selection === 'a',
                                            'not-selected': selection === 'b'
                                        })} 
                                        style={{background: 'linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)'}}
                                    >
                                        <h2 className="choice-text font-display text-3xl md:text-4xl text-white font-bold">{currentQuestion.a}</h2>
                                        <div className="checkmark"><Check strokeWidth={2} size={96} /></div>
                                    </div>
                                    
                                    <div className="flex items-center justify-center">
                                        <span className="or-separator font-display text-2xl font-bold text-white">ATAU</span>
                                    </div>

                                    <div 
                                        ref={choiceBRef}
                                        onClick={() => handleChoice('b')}
                                        className={cn('choice-card w-full h-64 md:h-80 flex items-center justify-center p-6 rounded-3xl shadow-lg border-2 border-white/50', {
                                            'selected': selection === 'b',
                                            'not-selected': selection === 'a'
                                        })}
                                        style={{background: 'linear-gradient(135deg, #6a82fb 0%, #fc5c7d 100%)'}}
                                    >
                                        <h2 className="choice-text font-display text-3xl md:text-4xl text-white font-bold">{currentQuestion.b}</h2>
                                        <div className="checkmark"><Check strokeWidth={2} size={96} /></div>
                                    </div>
                                </div>
                            )}
                        </main>
                    ) : null}

                    <footer className="mt-10 h-24">
                        {!isFinished ? (
                            <p className="text-white/80 font-semibold">
                                Pertanyaan {Math.min(currentQuestionIndex + 1, shuffledQuestions.length)} dari {shuffledQuestions.length}
                            </p>
                        ) : (
                            <div className="question-transition">
                                <p className="text-white text-xl mb-4">Game over! Kalian emang se-frekuensi!</p>
                                <button onClick={restartGame} className="bg-white text-pink-500 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-gray-200 transition-transform transform hover:scale-110">
                                   Main Lagi Kuy
                                </button>
                           </div>
                        )}
                         <Link href="/" className="text-white hover:underline inline-flex items-center gap-2 mt-8">
                            <Home size={16}/> Kembali ke Menu Utama
                        </Link>
                    </footer>
                </div>
            </div>
        </>
    );
}
