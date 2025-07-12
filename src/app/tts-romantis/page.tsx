
'use client';

import { useState, useRef } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { useToast } from '../../hooks/use-toast';
import { Home } from 'lucide-react';
import Link from 'next/link';

const puzzle = {
    solution: [
        ['C', 'I', 'N', 'T', 'A'],
        ['A', ' ', 'U', ' ', 'D'],
        ['S', 'A', 'Y', 'A', 'N', 'G'],
        ['I', ' ', 'A', ' ', ' '],
        ['A', ' ', 'H', ' ', ' '],
    ],
    gridSize: { rows: 5, cols: 6 },
    questions: {
        across: [
            { num: 1, text: 'Perasaan yang paling dasar dalam hubungan (5 huruf)', row: 0, col: 0, len: 5, answer: "CINTA" },
            { num: 3, text: 'Panggilan manis untuk pasangan (6 huruf)', row: 2, col: 0, len: 6, answer: "SAYANG" },
        ],
        down: [
            { num: 1, text: 'Lawan benci (5 huruf)', row: 0, col: 0, len: 5, answer: "KASIH" },
            { num: 2, text: 'Perasaan kagum (5 huruf)', row: 0, col: 4, len: 5, answer: "SUKA" },
        ],
    },
};


// We need a corrected solution grid that matches the down answers
const correctedSolution = [
    ['C', 'I', 'N', 'T', 'A'],
    ['A', ' ', ' ', ' ', 'S'],
    ['S', 'A', 'Y', 'A', 'N', 'G'],
    ['I', ' ', ' ', ' ', 'K'],
    ['H', ' ', ' ', ' ', 'A'],
];

const correctedPuzzle = {
    ...puzzle,
    solution: correctedSolution,
    questions: {
        across: [
            { num: 1, text: 'Perasaan paling dasar dalam hubungan (5 huruf)', row: 0, col: 0, len: 5, answer: 'CINTA' },
            { num: 2, text: 'Panggilan manis untuk pasangan (6 huruf)', row: 2, col: 0, len: 6, answer: 'SAYANG' },
        ],
        down: [
            { num: 3, text: 'Lawan dari benci (5 huruf)', row: 0, col: 0, len: 5, answer: 'KASIH' },
            { num: 4, text: 'Perasaan kagum (4 huruf)', row: 0, col: 4, len: 4, answer: 'SUKA' },
        ],
    },
    gridSize: { rows: 5, cols: 6 },
};


export default function TtsRomantisPage() {
    const { toast } = useToast();
    const [gridState, setGridState] = useState(
        Array(correctedPuzzle.gridSize.rows)
            .fill(null)
            .map(() => Array(correctedPuzzle.gridSize.cols).fill(''))
    );
    const inputRefs = useRef<(HTMLInputElement | null)[][]>(
        Array(correctedPuzzle.gridSize.rows)
            .fill(null)
            .map(() => Array(correctedPuzzle.gridSize.cols).fill(null))
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, row: number, col: number) => {
        const value = e.target.value.toUpperCase();
        if (value.length > 1) return;

        const newGrid = gridState.map(r => [...r]);
        newGrid[row][col] = value;
        setGridState(newGrid);

        // Auto-focus logic can be improved later
        if (value && col < correctedPuzzle.gridSize.cols - 1) {
             // Try to move to the next valid cell horizontally
             for(let i = col + 1; i < correctedPuzzle.gridSize.cols; i++) {
                 if (correctedPuzzle.solution[row][i] !== ' ') {
                     inputRefs.current[row][i]?.focus();
                     return;
                 }
             }
        }
    };
    
    const checkAnswers = () => {
        let isCorrect = true;
        for (let r = 0; r < correctedPuzzle.gridSize.rows; r++) {
            for (let c = 0; c < correctedPuzzle.gridSize.cols; c++) {
                const solutionChar = correctedPuzzle.solution[r]?.[c];
                // Only check cells that are part of the puzzle
                if (solutionChar && solutionChar !== ' ') {
                    const userChar = gridState[r]?.[c] || '';
                    if (solutionChar !== userChar) {
                        isCorrect = false;
                        break;
                    }
                }
            }
            if (!isCorrect) break;
        }

        if (isCorrect) {
            toast({
                title: '🎉 Selamat! 🎉',
                description: 'Semua jawabanmu benar! Kalian memang pasangan sehati!',
            });
        } else {
            toast({
                variant: 'destructive',
                title: 'Oops!',
                description: 'Masih ada jawaban yang kurang tepat. Coba periksa lagi ya!',
            });
        }
    };


    const renderCell = (row: number, col: number) => {
        const solutionChar = correctedPuzzle.solution[row]?.[col];
        if (!solutionChar || solutionChar === ' ') {
            return <div key={`${row}-${col}`} className="w-10 h-10 bg-gray-200" />;
        }
        
        let questionNumber: string | null = null;
        const acrossQ = correctedPuzzle.questions.across.find(q => q.row === row && q.col === col);
        const downQ = correctedPuzzle.questions.down.find(q => q.row === row && q.col === col);
        if (acrossQ) questionNumber = `${acrossQ.num}`;
        if (downQ) questionNumber = `${questionNumber ? `${questionNumber},` : ''}${downQ.num}`;


        return (
            <div key={`${row}-${col}`} className="relative w-10 h-10">
                {questionNumber && (
                    <span className="absolute top-0 left-0.5 text-[9px] text-gray-500 pointer-events-none">{questionNumber}</span>
                )}
                <Input
                    ref={el => { if(inputRefs.current[row]) inputRefs.current[row][col] = el }}
                    type="text"
                    maxLength={1}
                    value={gridState[row][col] || ''}
                    onChange={(e) => handleInputChange(e, row, col)}
                    className="w-full h-full text-center text-lg font-bold p-0 rounded-none border-gray-400 focus:border-pink-500 focus:ring-pink-500"
                />
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <Card className="w-full max-w-4xl shadow-xl">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-bold text-gray-800">TTS Romantis</CardTitle>
                    <CardDescription>Uji kekompakan kalian dengan teka-teki cinta ini!</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col lg:flex-row gap-8 items-start justify-center">
                     <div className="grid gap-0 border-l border-t border-gray-400 bg-gray-200" style={{gridTemplateColumns: `repeat(${correctedPuzzle.gridSize.cols}, minmax(0, 1fr))`}}>
                       {Array.from({ length: correctedPuzzle.gridSize.rows }).map((_, r) => 
                           Array.from({ length: correctedPuzzle.gridSize.cols }).map((_, c) => 
                               renderCell(r, c)
                           )
                       )}
                    </div>
                    <div className="w-full lg:w-1/2 space-y-4">
                        <div>
                            <h3 className="font-bold text-lg text-gray-700">Mendatar</h3>
                            <ul className="list-inside text-gray-600">
                                {correctedPuzzle.questions.across.map(q => <li key={q.num}><span className="font-bold">{q.num}.</span> {q.text}</li>)}
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-gray-700">Menurun</h3>
                            <ul className="list-inside text-gray-600">
                                {correctedPuzzle.questions.down.map(q => <li key={q.num}><span className="font-bold">{q.num}.</span> {q.text}</li>)}
                            </ul>
                        </div>
                         <Button onClick={checkAnswers} className="w-full bg-pink-500 hover:bg-pink-600">
                            Cek Jawaban
                        </Button>
                    </div>
                </CardContent>
            </Card>
            <footer className="absolute bottom-4 text-center">
                <Link href="/" className="text-pink-500 hover:underline inline-flex items-center gap-2">
                    <Home size={16}/> Kembali ke Menu Utama
                </Link>
            </footer>
        </div>
    );
}

