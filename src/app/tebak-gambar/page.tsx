
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { db, auth } from '../../lib/firebase';
import {
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  serverTimestamp,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { Home, Loader2, RefreshCw, Send, Palette, Lightbulb } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../../components/ui/button';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { useToast } from '../../hooks/use-toast';
import { cn } from '../../lib/utils';
import { ScrollArea } from '../../components/ui/scroll-area';

type Player = 'cipa' | 'jojo';
type GameStatus = 'waiting' | 'drawing' | 'guessing' | 'round_over' | 'game_over';

interface Point {
  x: number;
  y: number;
}

interface Line {
  points: Point[];
  color: string;
  lineWidth: number;
}

interface Guess {
  player: Player;
  text: string;
  isCorrect: boolean;
}

interface GameState {
  id?: string;
  status: GameStatus;
  drawer: Player | null;
  guesser: Player | null;
  currentWord: string;
  lines: Line[];
  guesses: Guess[];
  round: number;
  cipaScore: number;
  jojoScore: number;
  lastActivity: any;
}

const GAME_ID = 'main_pictionary_game';
const WORDS = ['Kucing', 'Rumah', 'Mobil', 'Pohon', 'Bunga', 'Matahari', 'Bulan', 'Bintang', 'Gitar', 'Buku', 'Kopi', 'Pizza', 'Laptop', 'Cinta', 'Jembatan', 'Gunung', 'Pantai', 'Sepeda'];
const TOTAL_ROUNDS = 5;

const Canvas = ({ lines, isDrawing, onDraw }: { lines: Line[], isDrawing: boolean, onDraw: (line: Line) => void }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawing = useRef(false);
  const currentLine = useRef<Line>({ points: [], color: '#000000', lineWidth: 3 });

  const getCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) throw new Error('Canvas not found');
    return canvas;
  };
  
  const getContext = () => {
    const ctx = getCanvas().getContext('2d');
    if (!ctx) throw new Error('2D context not found');
    return ctx;
  };

  const drawLine = (ctx: CanvasRenderingContext2D, line: Line) => {
    if (line.points.length < 2) return;
    ctx.beginPath();
    ctx.moveTo(line.points[0].x, line.points[0].y);
    line.points.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.strokeStyle = line.color;
    ctx.lineWidth = line.lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  };

  const redrawCanvas = useCallback(() => {
    const ctx = getContext();
    const canvas = getCanvas();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    lines.forEach(line => drawLine(ctx, line));
  }, [lines]);

  useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas]);
  
  const getPoint = (e: React.MouseEvent | React.TouchEvent): Point => {
    const canvas = getCanvas();
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height)
    };
  };

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    drawing.current = true;
    currentLine.current = { points: [getPoint(e)], color: '#000000', lineWidth: 3 };
  };
  
  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!drawing.current || !isDrawing) return;
    currentLine.current.points.push(getPoint(e));
    redrawCanvas(); // Redraw existing lines
    drawLine(getContext(), currentLine.current); // Draw current line in progress
  };
  
  const handleMouseUp = () => {
    if (!drawing.current || !isDrawing) return;
    drawing.current = false;
    onDraw(currentLine.current);
    currentLine.current = { points: [], color: '#000000', lineWidth: 3 };
  };

  return (
    <canvas
      ref={canvasRef}
      width={500}
      height={500}
      className={cn('bg-white border-2 border-gray-300 rounded-lg w-full h-auto aspect-square touch-none', isDrawing ? 'cursor-crosshair' : 'cursor-not-allowed')}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchMove={handleMouseMove}
      onTouchEnd={handleMouseUp}
    />
  );
};


export default function TebakGambarPage() {
  const [user, setUser] = useState<Player | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [guessInput, setGuessInput] = useState('');
  const { toast } = useToast();
  const gameRef = doc(db, 'tebak_gambar_games', GAME_ID);
  
  const initGame = async (initiator: Player) => {
    const newWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    const newGame: GameState = {
      status: 'waiting',
      drawer: initiator,
      guesser: null,
      currentWord: newWord,
      lines: [],
      guesses: [],
      round: 1,
      cipaScore: 0,
      jojoScore: 0,
      lastActivity: serverTimestamp(),
    };
    await setDoc(gameRef, newGame);
  };
  
  const startNextRound = (gs: GameState) => {
    const newWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    updateDoc(gameRef, {
      status: 'drawing',
      drawer: gs.guesser, // Swap roles
      guesser: gs.drawer,
      currentWord: newWord,
      lines: [],
      guesses: [],
      round: gs.round + 1,
      lastActivity: serverTimestamp(),
    });
  };

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) { signInAnonymously(auth); }
    });
    return () => unsubAuth();
  }, []);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(gameRef, async (docSnap) => {
      if (docSnap.exists()) {
        const gameData = docSnap.data() as GameState;
        let updates: Partial<GameState> = {};

        if (gameData.status === 'waiting' && gameData.drawer !== user && !gameData.guesser) {
          updates.guesser = user;
          updates.status = 'drawing';
        }
        
        if (Object.keys(updates).length > 0) {
          await updateDoc(gameRef, updates);
        } else {
          setGameState(gameData);
        }
      } else {
        await initGame(user);
      }
      setIsLoading(false);
    }, (error) => {
        console.error("Firestore snapshot error:", error);
        toast({ variant: "destructive", title: "Error", description: "Gagal terhubung ke ruang permainan." });
        setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleDraw = async (line: Line) => {
    if (!gameState || gameState.drawer !== user || gameState.status !== 'drawing') return;
    const newLines = [...gameState.lines, line];
    await updateDoc(gameRef, { lines: newLines, lastActivity: serverTimestamp() });
  };
  
  const handleGuessSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guessInput.trim() || !gameState || gameState.guesser !== user || gameState.status !== 'guessing') return;

    const isCorrect = guessInput.trim().toLowerCase() === gameState.currentWord.toLowerCase();
    const newGuess: Guess = { player: user, text: guessInput, isCorrect };

    const newGuesses = [...gameState.guesses, newGuess];
    let newStatus: GameStatus = gameState.status;
    let updates: Partial<GameState> = { guesses: newGuesses, lastActivity: serverTimestamp() };

    if (isCorrect) {
        newStatus = 'round_over';
        updates.status = newStatus;
        if (user === 'cipa') {
            updates.cipaScore = (gameState.cipaScore || 0) + 10;
        } else {
            updates.jojoScore = (gameState.jojoScore || 0) + 10;
        }
    }
    
    await updateDoc(gameRef, updates);
    setGuessInput('');
  };

  const getStatusMessage = () => {
    if (!gameState) return "Memuat permainan...";
    const { status, drawer, guesser, round, winner } = gameState;
    const opponent = user === 'cipa' ? 'Jojo' : 'Cipa';

    switch (status) {
      case 'waiting': return `Menunggu ${opponent} bergabung...`;
      case 'drawing': return user === drawer ? `Giliranmu menggambar! Kata: ${gameState.currentWord}` : `Tunggu giliran, ${drawer} sedang menggambar.`;
      case 'guessing': return user === guesser ? "Giliranmu menebak!" : `Tunggu giliran, ${guesser} sedang menebak.`;
      case 'round_over': return `Benar! Kata-nya adalah "${gameState.currentWord}". Lanjut ke babak berikutnya...`;
      case 'game_over': return `Permainan Selesai! Pemenangnya adalah ${winner}!`;
      default: return 'Permainan sedang berlangsung.';
    }
  };
  
   useEffect(() => {
    if (gameState?.status === 'drawing' && user === gameState.guesser) {
      const timer = setTimeout(() => {
        updateDoc(gameRef, { status: 'guessing' });
      }, 1000); // Give drawer a moment to see the word
      return () => clearTimeout(timer);
    }
    if (gameState?.status === 'round_over') {
        const timer = setTimeout(() => {
            if (gameState.round >= TOTAL_ROUNDS) {
                const winner = gameState.cipaScore > gameState.jojoScore ? 'Cipa' : 'Jojo';
                updateDoc(gameRef, { status: 'game_over', winner });
            } else {
                startNextRound(gameState);
            }
        }, 3000); // 3-second pause before next round
        return () => clearTimeout(timer);
    }
  }, [gameState, user]);


  if (!user) {
    return (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-sm text-center shadow-xl">
                <CardHeader>
                    <CardTitle className="text-2xl">Siapa Kamu?</CardTitle>
                    <CardDescription>Pilih untuk memulai permainan.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                    <Button onClick={() => setUser('cipa')} className="bg-pink-500 hover:bg-pink-600 h-20 text-2xl font-bold">Cipa</Button>
                    <Button onClick={() => setUser('jojo')} className="bg-blue-500 hover:bg-blue-600 h-20 text-2xl font-bold">Jojo</Button>
                </CardContent>
            </Card>
        </div>
    );
  }

  if (isLoading || !gameState) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-pink-500" />
      </div>
    );
  }
  
  const amIDrawer = gameState.drawer === user;
  const amIGuesser = gameState.guesser === user;

  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-8">
      <Card className="w-full max-w-4xl mx-auto shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-2"><Palette/> Tebak Gambar</CardTitle>
           <p className="text-gray-600 text-lg mt-2">{getStatusMessage()}</p>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4 text-lg font-bold">
            <span className="text-pink-500">Cipa: {gameState.cipaScore || 0}</span>
            <span>Babak {gameState.round}/{TOTAL_ROUNDS}</span>
            <span className="text-blue-500">Jojo: {gameState.jojoScore || 0}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Canvas lines={gameState.lines} isDrawing={amIDrawer && gameState.status === 'drawing'} onDraw={handleDraw} />
              {amIDrawer && gameState.status === 'drawing' &&
                  <div className="mt-4 p-3 bg-blue-100 text-blue-800 rounded-lg text-center">
                      <p className="font-semibold">Kata untuk digambar:</p>
                      <p className="text-2xl font-bold">{gameState.currentWord}</p>
                  </div>
              }
            </div>
            
            <div className="flex flex-col">
              <h3 className="font-bold mb-2 flex items-center gap-2"><Lightbulb/> Tebakan</h3>
              <ScrollArea className="flex-grow h-64 bg-gray-50 p-3 rounded-lg border">
                {gameState.guesses.length === 0 ? <p className="text-sm text-gray-500">Belum ada tebakan...</p> : 
                    gameState.guesses.map((g, i) => (
                      <p key={i} className={cn('mb-1 text-sm', g.player === 'cipa' ? 'text-pink-600' : 'text-blue-600')}>
                        <span className="font-bold">{g.player}: </span>
                        {g.text} {g.isCorrect && '✅'}
                      </p>
                    ))
                }
              </ScrollArea>
              <form onSubmit={handleGuessSubmit} className="mt-4">
                <Input 
                    value={guessInput}
                    onChange={(e) => setGuessInput(e.target.value)}
                    placeholder="Ketik tebakanmu..."
                    disabled={!amIGuesser || gameState.status !== 'guessing'}
                />
                <Button type="submit" className="w-full mt-2" disabled={!amIGuesser || gameState.status !== 'guessing'}>
                    <Send className="mr-2"/> Kirim
                </Button>
              </form>
            </div>
          </div>
          <div className="mt-6 flex justify-center">
             <Button onClick={() => initGame(user)} variant="outline">
                <RefreshCw className="mr-2"/> Reset Permainan
             </Button>
          </div>
        </CardContent>
      </Card>
      <footer className="text-center mt-8">
        <Link href="/" className="text-pink-500 hover:underline inline-flex items-center gap-2">
          <Home size={16}/> Kembali ke Menu Utama
        </Link>
      </footer>
    </div>
  );
}
