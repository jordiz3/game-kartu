
'use client';

import { useState, useEffect } from 'react';
import { db, auth } from '../../lib/firebase';
import {
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { Home, Loader2, Circle, X, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../../components/ui/button';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '../../components/ui/card';
import { useToast } from '../../hooks/use-toast';
import { cn } from '../../lib/utils';

type Player = 'cipa' | 'jojo';
type Mark = 'X' | 'O';
type Board = (Mark | null)[];

interface GameState {
  board: Board;
  currentPlayer: Mark;
  playerX: Player | null;
  playerO: Player | null;
  status: 'waiting' | 'active' | 'finished';
  winner: Mark | 'draw' | null;
  createdAt: any;
  updatedAt: any;
}

const GAME_ID = 'main_game'; // Only one game room for simplicity

export default function TicTacToePage() {
  const [user, setUser] = useState<Player | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        signInAnonymously(auth).catch((error) => {
          console.error('Anonymous sign-in failed:', error);
          toast({ variant: 'destructive', title: 'Gagal otentikasi' });
        });
      }
    });
    return () => unsubAuth();
  }, [toast]);

  useEffect(() => {
    if (!user) return;

    setIsLoading(true);
    const gameRef = doc(db, 'tic_tac_toe_games', GAME_ID);

    const unsubscribe = onSnapshot(gameRef, async (docSnap) => {
      if (docSnap.exists()) {
        const gameData = docSnap.data() as GameState;
        // If a player is missing, assign the current user
        if (!gameData.playerX || !gameData.playerO) {
          if (user === 'cipa' && !gameData.playerX) await updateDoc(gameRef, { playerX: 'cipa' });
          if (user === 'jojo' && !gameData.playerO) await updateDoc(gameRef, { playerO: 'jojo' });
        }
        setGameState(gameData);
      } else {
        // Create a new game if it doesn't exist
        await createNewGame();
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const createNewGame = async () => {
    const newBoard = Array(9).fill(null);
    const newGame: GameState = {
      board: newBoard,
      currentPlayer: 'X',
      playerX: user === 'cipa' ? 'cipa' : null,
      playerO: user === 'jojo' ? 'jojo' : null,
      status: 'waiting',
      winner: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    await setDoc(doc(db, 'tic_tac_toe_games', GAME_ID), newGame);
  };
  
  const handleCellClick = async (index: number) => {
    if (!gameState || !user) return;

    const { board, currentPlayer, status, playerX, playerO } = gameState;
    const myMark = user === 'cipa' ? 'X' : 'O';

    if (status !== 'active' || board[index] || currentPlayer !== myMark) {
      if (status === 'finished') toast({ description: 'Game sudah selesai. Reset untuk main lagi.' });
      else if (currentPlayer !== myMark) toast({ description: 'Bukan giliranmu.' });
      return;
    }

    const newBoard = [...board];
    newBoard[index] = currentPlayer;

    const winner = checkWinner(newBoard);
    const isDraw = !winner && newBoard.every(cell => cell !== null);

    const nextPlayer = currentPlayer === 'X' ? 'O' : 'X';
    const newStatus = winner || isDraw ? 'finished' : 'active';
    
    await updateDoc(doc(db, 'tic_tac_toe_games', GAME_ID), {
      board: newBoard,
      currentPlayer: nextPlayer,
      winner: winner || (isDraw ? 'draw' : null),
      status: newStatus,
      updatedAt: serverTimestamp(),
    });
  };

  const checkWinner = (board: Board): Mark | null => {
    const winningCombos = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    for (const combo of winningCombos) {
      const [a, b, c] = combo;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  };

  const resetGame = async () => {
    await createNewGame();
    toast({ title: 'Game Direset!', description: 'Permainan baru dimulai.' });
  };
  
  if (!user) {
    return (
        <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-sm bg-gray-800 border-gray-700 text-center">
                <CardHeader>
                    <CardTitle className="text-2xl">Siapa Kamu?</CardTitle>
                    <CardDescription className="text-gray-400">Pilih untuk memulai permainan.</CardDescription>
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
      <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-pink-500" />
        <p className="ml-4 text-lg">Memuat ruang permainan...</p>
      </div>
    );
  }

  const { board, currentPlayer, status, winner, playerX, playerO } = gameState;
  const myMark = user === 'cipa' ? 'X' : 'O';
  const opponentName = user === 'cipa' ? 'Jojo' : 'Cipa';

  const getStatusMessage = () => {
    if (status === 'waiting' || !playerX || !playerO) {
      return `Menunggu ${opponentName} untuk bergabung...`;
    }
    if (status === 'finished') {
      if (winner === 'draw') return "Permainan Seri!";
      if (winner === myMark) return "Kamu Menang! 🎉";
      return `${opponentName} Menang!`;
    }
    return currentPlayer === myMark ? "Giliranmu!" : `Menunggu giliran ${opponentName}...`;
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700 shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Tic-Tac-Toe</CardTitle>
          <p className={cn("text-lg mt-2 transition-colors", 
            status === 'active' && (currentPlayer === myMark ? 'text-green-400' : 'text-yellow-400'),
            status === 'finished' && 'text-pink-400 font-bold'
          )}>
            {getStatusMessage()}
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2 aspect-square">
            {board.map((cell, index) => (
              <button
                key={index}
                onClick={() => handleCellClick(index)}
                disabled={status !== 'active' || cell !== null || currentPlayer !== myMark}
                className="bg-gray-900 rounded-lg flex items-center justify-center hover:bg-gray-700 disabled:cursor-not-allowed transition-all duration-200"
              >
                {cell === 'X' && <X className="w-16 h-16 text-pink-400 animate-scale-in" />}
                {cell === 'O' && <Circle className="w-14 h-14 text-blue-400 animate-scale-in" />}
              </button>
            ))}
          </div>
          <div className="mt-6 flex justify-between items-center">
             <div className="text-sm text-gray-400">Kamu adalah <span className={cn('font-bold', myMark === 'X' ? 'text-pink-400' : 'text-blue-400')}>{myMark}</span></div>
             <Button onClick={resetGame} variant="ghost" className="text-gray-400 hover:text-white hover:bg-gray-700">
                <RefreshCw className="mr-2 h-4 w-4" /> Reset
             </Button>
          </div>
        </CardContent>
      </Card>
      <footer className="absolute bottom-4 text-center">
        <Link href="/" className="text-pink-500 hover:underline inline-flex items-center gap-2">
            <Home size={16}/> Kembali ke Menu Utama
        </Link>
      </footer>
      <style jsx>{`
        @keyframes scale-in {
            from { transform: scale(0.5); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in {
            animation: scale-in 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
      `}</style>
    </div>
  );
}
