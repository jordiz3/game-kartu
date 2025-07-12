
'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Home, Lightbulb, CheckCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '../../components/ui/card';
import { cn } from '../../lib/utils';

// --- Data TTS ---
const gridLayout = [
    [0, 1, 0, 0, 2, 0, 0, 0, 0, 0],
    [0, 'P', 0, 0, 'A', 0, 0, 0, 0, 0],
    [3, 'A', 4, 'S', 'T', 'A', 0, 0, 0, 0],
    [0, 'N', 0, 'E', 0, 'W', 0, 0, 0, 0],
    [0, 'T', 5, 'R', 'A', 'W', 'A', 'N', 'G', 'A', 'N'],
    [0, 'A', 0, 'I', 0, 0, 'D', 0, 'I', 0, 0],
    [0, 'I', 0, 'N', 0, 0, 'A', 0, 'L', 0, 0],
    [0, 0, 0, 0, 0, 0, 'Y', 0, 'Y', 0, 0],
];

const questions = [
    { num: 1, dir: 'menurun', question: 'Makanan Jepang favorit kita?', answer: 'AYCE', start: [0, 1], len: 4 },
    { num: 2, dir: 'menurun', question: 'Nama panggilan sayang untuk Cipa?', answer: 'AYANG', start: [0, 4], len: 5 },
    { num: 3, dir: 'mendatar', question: 'Jenis makanan Italia yang sering kita buat?', answer: 'PASTA', start: [2, 0], len: 5 },
    { num: 4, dir: 'menurun', question: 'Tempat nonton film?', answer: 'SINEPOLIS', start: [2, 2], len: 9 },
    { num: 5, dir: 'mendatar', question: 'Tempat liburan ikonik kita di Lombok?', answer: 'TRAWANGAN', start: [4, 2], len: 9 },
];

export default function TtsRomantisPage() {
    const [userAnswers, setUserAnswers] = useState(Array(gridLayout.length).fill(0).map(() => Array(gridLayout[0].length).fill('')));
    const [isComplete, setIsComplete] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[][]>([]);

    useEffect(() => {
        // Initialize refs
        inputRefs.current = Array(gridLayout.length).fill(0).map(() => Array(gridLayout[0].length).fill(null));
    }, []);

    const handleInputChange = (row: number, col: number, value: string) => {
        const newAnswers = [...userAnswers];
        newAnswers[row][col] = value.toUpperCase();
        setUserAnswers(newAnswers);

        // Move to next input if value is entered
        if (value && col < gridLayout[0].length - 1 && gridLayout[row][col + 1] !== 0) {
            inputRefs.current[row][col + 1]?.focus();
        } else if (value && row < gridLayout.length - 1 && gridLayout[row + 1] && gridLayout[row + 1][col] !== 0) {
            // Find next vertical input
             for(let i = row + 1; i < gridLayout.length; i++) {
                if (gridLayout[i][col] !== 0) {
                     inputRefs.current[i][col]?.focus();
                     break;
                }
            }
        }
    };

    const checkAnswers = () => {
        for (const q of questions) {
            if (q.dir === 'mendatar') {
                for (let i = 0; i < q.len; i++) {
                    if (userAnswers[q.start[0]][q.start[1] + i] !== q.answer[i]) {
                        alert('Oops, masih ada jawaban yang salah. Coba lagi!');
                        return;
                    }
                }
            } else { // menurun
                for (let i = 0; i < q.len; i++) {
                    if (userAnswers[q.start[0] + i][q.start[1]] !== q.answer[i]) {
                        alert('Oops, masih ada jawaban yang salah. Coba lagi!');
                        return;
                    }
                }
            }
        }
        setIsComplete(true);
    };

    const resetGame = () => {
        setUserAnswers(Array(gridLayout.length).fill(0).map(() => Array(gridLayout[0].length).fill('')));
        setIsComplete(false);
    };

    const renderCell = (cell: any, row: number, col: number) => {
        if (cell === 0) {
            return <div key={`${row}-${col}`} className="w-8 h-8 md:w-10 md:h-10 bg-gray-700 rounded-sm"></div>;
        }

        const questionNumber = typeof cell === 'number' && cell > 0 ? cell : null;

        return (
            <div key={`${row}-${col}`} className="relative w-8 h-8 md:w-10 md:h-10">
                <input
                    ref={el => {
                        if (!inputRefs.current[row]) inputRefs.current[row] = [];
                        inputRefs.current[row][col] = el;
                    }}
                    type="text"
                    maxLength={1}
                    value={userAnswers[row][col]}
                    onChange={(e) => handleInputChange(row, col, e.target.value)}
                    className="w-full h-full text-center text-lg md:text-xl font-bold uppercase bg-white border border-gray-400 rounded-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                    disabled={isComplete}
                />
                {questionNumber && (
                    <span className="absolute top-0 left-1 text-xs font-bold text-gray-500">{questionNumber}</span>
                )}
            </div>
        );
    };

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center p-4">
            <Card className="w-full max-w-4xl shadow-xl">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-bold text-gray-800">TTS Romantis Cipa & Jojo</CardTitle>
                    <CardDescription>Seberapa ingat kalian dengan kenangan bersama?</CardDescription>
                </CardHeader>
                <CardContent>
                    {isComplete ? (
                        <div className="text-center space-y-4 animate-fade-in py-8">
                            <CheckCircle className="w-24 h-24 text-green-500 mx-auto" />
                            <h2 className="text-2xl font-bold text-gray-800">Kalian Hebat!</h2>
                            <p className="text-gray-600">Semua jawaban benar. Ingatan kalian tentang satu sama lain luar biasa!</p>
                            <Button onClick={resetGame}>Main Lagi</Button>
                        </div>
                    ) : (
                        <div className="flex flex-col lg:flex-row gap-6">
                            {/* TTS Grid */}
                            <div className="flex-shrink-0 mx-auto">
                                 <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${gridLayout[0].length}, minmax(0, 1fr))` }}>
                                    {gridLayout.map((row, rowIndex) =>
                                        row.map((cell, colIndex) =>
                                            renderCell(cell, rowIndex, colIndex)
                                        )
                                    )}
                                </div>
                            </div>
                            
                            {/* Questions */}
                            <div className="flex-grow bg-gray-50 p-4 rounded-lg border">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                    <div>
                                        <h3 className="font-bold text-lg mb-2 text-gray-700">Mendatar</h3>
                                        <ul className="space-y-2 text-sm text-gray-600">
                                            {questions.filter(q => q.dir === 'mendatar').map(q => (
                                                <li key={q.num}>{q.num}. {q.question}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-2 text-gray-700">Menurun</h3>
                                        <ul className="space-y-2 text-sm text-gray-600">
                                            {questions.filter(q => q.dir === 'menurun').map(q => (
                                                <li key={q.num}>{q.num}. {q.question}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                 <div className="mt-6 text-center">
                                    <Button onClick={checkAnswers} className="w-full md:w-auto bg-green-500 hover:bg-green-600">
                                        <CheckCircle className="mr-2" /> Cek Jawaban
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <footer className="absolute bottom-4 text-center">
                <Link href="/" className="text-pink-500 hover:underline inline-flex items-center gap-2">
                    <Home size={16} /> Kembali ke Menu Utama
                </Link>
            </footer>
        </div>
    );
}
