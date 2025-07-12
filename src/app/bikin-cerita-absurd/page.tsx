
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Home, Rocket, ChevronRight, PartyPopper } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Progress } from '../../components/ui/progress';
import { cn } from '../../lib/utils';

// --- Bank Template Cerita ---
const storyTemplates = [
    {
        title: "Petualangan Harta Karun",
        placeholders: ['Nama Pahlawan', 'Nama Tempat Mistis', 'Jenis Hewan (bisa bicara)', 'Nama Rintangan', 'Nama Musuh', 'Benda Aneh', 'Aktivitas Konyol', 'Kata Seru'],
        story: (p: string[]) => `Suatu ketika, seorang pahlawan pemberani bernama <strong>${p[0]}</strong> menemukan peta kuno menuju <strong>${p[1]}</strong>. Bersama sahabatnya, seekor <strong>${p[2]}</strong> yang bisa bicara, mereka harus melewati <strong>${p[3]}</strong> yang dijaga oleh <strong>${p[4]}</strong> yang jahat. Di puncak petualangan, mereka tidak menemukan harta karun, melainkan sebuah <strong>${p[5]}</strong> yang bisa digunakan untuk <strong>${p[6]}</strong>. Akhirnya, mereka pulang ke desa sambil berteriak, "<strong>${p[7]}</strong>!"`
    },
    {
        title: "Misteri di Sekolah",
        placeholders: ['Nama Detektif Cilik', 'Nama Sekolah', 'Benda yang Hilang', 'Lokasi di Sekolah', 'Nama Guru', 'Sifat Aneh Guru', 'Jenis Makanan', 'Nama Pelaku (Hewan)'],
        story: (p: string[]) => `Di <strong>${p[1]}</strong>, terjadi sebuah misteri! <strong>${p[2]}</strong> milik kepala sekolah hilang. Detektif cilik <strong>${p[0]}</strong> dipanggil untuk menyelidiki. Petunjuk pertama ditemukan di <strong>${p[3]}</strong>, dekat meja <strong>${p[4]}</strong>, seorang guru yang dikenal suka <strong>${p[5]}</strong>. Setelah penyelidikan mendalam dengan bau <strong>${p[6]}</strong> sebagai petunjuk, ternyata pelakunya adalah seekor <strong>${p[7]}</strong> yang ingin pamer!`
    },
    {
        title: "Perjalanan Luar Angkasa",
        placeholders: ['Nama Kapten', 'Nama Galaksi', 'Nama Pesawat Luar Angkasa', 'Bentuk Alien', 'Nama Planet Alien', 'Tindakan Heroik', 'Benda Sehari-hari', 'Ucapan Kemenangan'],
        story: (p: string[]) => `Kapten <strong>${p[0]}</strong> sedang menjelajahi galaksi <strong>${p[1]}</strong> dengan pesawatnya, "The <strong>${p[2]}</strong>". Tiba-tiba, mereka diserang oleh alien berbentuk <strong>${p[3]}</strong> dari planet <strong>${p[4]}</strong>. Untuk menyelamatkan diri, kru harus melakukan <strong>${p[5]}</strong> hanya dengan menggunakan <strong>${p[6]}</strong>. Misi berhasil, dan Kapten pun berkata, "<strong>${p[7]}</strong>!"`
    },
    {
        title: "Kutukan Kerajaan Aneh",
        placeholders: ['Nama Kerajaan', 'Gelar Bangsawan', 'Nama Karakter Utama', 'Bentuk Benda Mati', 'Kata Pemicu Kutukan', 'Profesi Aneh', 'Cara Aneh Mematahkan Kutukan', 'Sorakan Rakyat'],
        story: (p: string[]) => `Di kerajaan <strong>${p[0]}</strong>, hiduplah seorang <strong>${p[1]}</strong> bernama <strong>${p[2]}</strong> yang dikutuk menjadi <strong>${p[3]}</strong> setiap kali mendengar kata "<strong>${p[4]}</strong>". Suatu hari, seorang <strong>${p[5]}</strong> dari desa sebelah datang untuk mematahkan kutukan dengan cara <strong>${p[6]}</strong>. Setelah berhasil, seluruh rakyat bersorak, "<strong>${p[7]}</strong>!"`
    },
    {
        title: "Resep Masakan Gagal",
        placeholders: ['Nama Koki', 'Nama Masakan Aneh', 'Bahan Utama', 'Bahan Rahasia', 'Kata Sifat (rasa)', 'Reaksi Orang yang Mencoba', 'Benda yang Dilempar', 'Pelajaran Moral'],
        story: (p: string[]) => `Koki <strong>${p[0]}</strong> mencoba menciptakan resep baru bernama "<strong>${p[1]}</strong>". Bahan utamanya adalah <strong>${p[2]}</strong>, dengan tambahan bahan rahasia berupa <strong>${p[3]}</strong>. Hasilnya adalah masakan yang terasa sangat <strong>${p[4]}</strong>. Orang pertama yang mencobanya langsung <strong>${p[5]}</strong> dan melempar <strong>${p[6]}</strong> ke arah koki. Pelajaran hari ini: <strong>${p[7]}</strong>.`
    }
];

type GameState = 'start' | 'playing' | 'transition' | 'result';

export default function BikinCeritaAbsurdPage() {
    const [gameState, setGameState] = useState<GameState>('start');
    const [selectedTemplate, setSelectedTemplate] = useState<(typeof storyTemplates)[0] | null>(null);
    const [userInputs, setUserInputs] = useState<string[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [inputValue, setInputValue] = useState('');
    const [error, setError] = useState('');
    const [player1Name, setPlayer1Name] = useState('Jojo');
    const [player2Name, setPlayer2Name] = useState('Cipa');
    const [currentPlayer, setCurrentPlayer] = useState(1);
    
    const startGame = () => {
        if (Math.random() < 0.5) {
            setPlayer1Name('Jojo');
            setPlayer2Name('Cipa');
        } else {
            setPlayer1Name('Cipa');
            setPlayer2Name('Jojo');
        }

        const randomIndex = Math.floor(Math.random() * storyTemplates.length);
        setSelectedTemplate(storyTemplates[randomIndex]);
        
        setUserInputs([]);
        setCurrentStep(0);
        setCurrentPlayer(1);
        setInputValue('');
        setError('');
        setGameState('playing');
    };

    const handleNextStep = () => {
        if (inputValue.trim() === '') {
            setError('Harap isi kolom ini!');
            return;
        }
        setError('');
        const newInputs = [...userInputs, inputValue.trim()];
        setUserInputs(newInputs);
        setInputValue('');
        
        if (currentStep < (selectedTemplate?.placeholders.length ?? 0) - 1) {
            setCurrentStep(currentStep + 1);
            setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
            setGameState('transition');
        } else {
            setGameState('result');
        }
    };
    
    const handleReady = () => {
        setGameState('playing');
    };
    
    const handlePlayAgain = () => {
        setGameState('start');
    };
    
    const progress = selectedTemplate ? (userInputs.length / selectedTemplate.placeholders.length) * 100 : 0;
    const currentTurnName = currentPlayer === 1 ? player1Name : player2Name;
    const nextTurnName = currentPlayer === 1 ? player2Name : player1Name;

    return (
        <div className="bg-gray-100 flex items-center justify-center min-h-screen p-4">
            <Card className="w-full max-w-lg shadow-xl">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-bold text-gray-800">Bikin Cerita Absurd Yuk!</CardTitle>
                    <CardDescription>Jojo & Cipa, isi bagian kosong secara bergantian!</CardDescription>
                </CardHeader>
                <CardContent>
                    {gameState === 'start' && (
                        <div className="text-center space-y-6">
                             <div className="text-left bg-gray-50 p-4 rounded-lg border">
                                <h3 className="font-semibold text-gray-700">Cara Bermain:</h3>
                                <p className="text-gray-600 text-sm">Setiap pemain akan mengisi kata secara bergantian sesuai instruksi. Jangan saling mengintip jawaban ya untuk hasil yang lebih lucu!</p>
                             </div>
                            <Button onClick={startGame} className="w-full" size="lg">
                                <Rocket className="mr-2"/> Mulai Bermain!
                            </Button>
                        </div>
                    )}

                    {gameState === 'playing' && selectedTemplate && (
                        <div className="space-y-4">
                            <h2 className={cn('text-xl font-semibold text-center', currentTurnName === 'Jojo' ? 'text-blue-600' : 'text-pink-600')}>
                                Giliran {currentTurnName}
                            </h2>
                            <div>
                                <label htmlFor="game-input" className="font-medium text-gray-700">
                                    Masukkan: {selectedTemplate.placeholders[currentStep]}
                                </label>
                                <Input 
                                    id="game-input"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleNextStep()}
                                    placeholder="Ketik jawabanmu di sini..."
                                    className="mt-1"
                                    autoFocus
                                />
                                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                            </div>
                            <Button onClick={handleNextStep} className="w-full">
                                Lanjut <ChevronRight className="ml-1" />
                            </Button>
                             <div className="pt-2">
                                <Progress value={progress} />
                            </div>
                        </div>
                    )}
                    
                    {gameState === 'transition' && (
                        <div className="text-center space-y-4 py-8 animate-fade-in">
                            <h2 className="text-2xl font-bold text-gray-700">Giliran Beralih!</h2>
                            <p className="text-gray-600">
                                Sekarang giliran <span className={cn('font-bold', nextTurnName === 'Jojo' ? 'text-blue-600' : 'text-pink-600')}>{nextTurnName}</span>.
                                <br/>Berikan perangkat kepadanya dan klik 'Aku Siap!'
                            </p>
                            <Button onClick={handleReady} variant="secondary" className="bg-emerald-500 hover:bg-emerald-600">
                                Aku Siap!
                            </Button>
                        </div>
                    )}

                    {gameState === 'result' && selectedTemplate && (
                        <div className="text-center space-y-4 animate-fade-in">
                            <h2 className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2"><PartyPopper className="text-amber-500" /> Inilah Cerita Absurd Kalian!</h2>
                            <div 
                                className="bg-gray-100 border-l-4 border-blue-500 p-4 rounded text-left italic text-gray-800 text-lg leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: selectedTemplate.story(userInputs) }}
                            />
                            <Button onClick={handlePlayAgain} className="w-full">
                                Buat Cerita Baru!
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
            
            <footer className="absolute bottom-4 text-center">
                <Link href="/" className="text-pink-500 hover:underline inline-flex items-center gap-2">
                    <Home size={16}/> Kembali ke Menu Utama
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
