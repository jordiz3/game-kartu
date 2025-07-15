
'use client';

import { useState, useMemo } from 'react';
import { Home, Plus, Trash2, Ticket } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '../../components/ui/card';
import { cn } from '../../lib/utils';

// Palet warna neon yang cerah untuk tema pasar malam
const wheelColors = [
  '#ff6b81', '#ffc75f', '#f9f871', '#7bed9f', '#5352ed',
  '#ff7979', '#f0932b', '#d2dae2', '#48dbfb', '#ff5252'
];

const defaultOptions = ['Makan Malam', 'Nonton Film', 'Jajan Boba', 'Masak Bareng', 'Main Game', 'Olahraga'];

export default function SpinWheelPage() {
  const [options, setOptions] = useState<string[]>(defaultOptions);
  const [newOption, setNewOption] = useState('');
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);

  const segmentDegrees = 360 / options.length;

  const handleAddOption = () => {
    if (newOption.trim() && !options.includes(newOption.trim())) {
      setOptions([...options, newOption.trim()]);
      setNewOption('');
    }
  };

  const handleRemoveOption = (indexToRemove: number) => {
    setOptions(options.filter((_, index) => index !== indexToRemove));
  };

  const handleSpin = () => {
    if (isSpinning || options.length < 2) return;

    setIsSpinning(true);
    setWinner(null);

    // putaran acak + beberapa putaran penuh untuk efek dramatis
    const randomDegrees = Math.floor(Math.random() * 360);
    const fullRotations = Math.floor(Math.random() * 5) + 5; // 5-9 putaran penuh
    const newRotation = rotation + (360 * fullRotations) + randomDegrees;
    
    setRotation(newRotation);

    // Hitung pemenang setelah animasi selesai
    setTimeout(() => {
      const finalAngle = newRotation % 360;
      const winnerIndex = Math.floor((360 - finalAngle + segmentDegrees / 2) % 360 / segmentDegrees);
      setWinner(options[winnerIndex]);
      setIsSpinning(false);
    }, 7000); // Harus cocok dengan durasi transisi CSS
  };

  const wheelSegments = useMemo(() => {
    return options.map((option, index) => {
      const angle = segmentDegrees * index;
      const backgroundColor = wheelColors[index % wheelColors.length];
      
      return (
        <div
          key={index}
          className="wheel-segment"
          style={{
            transform: `rotate(${angle}deg)`,
            clipPath: `polygon(50% 50%, 100% 0, 100% 100%)`,
            backgroundColor,
          }}
        >
          <span className="wheel-text" style={{ transform: `rotate(${segmentDegrees / 2}deg) translate(80px, -50%)`}}>
            {option}
          </span>
        </div>
      );
    });
  }, [options, segmentDegrees]);

  return (
    <>
      <style jsx>{`
        .night-market-bg {
          background-color: #1a1a2e;
          background-image:
            radial-gradient(white, rgba(255,255,255,.2) 2px, transparent 40px),
            radial-gradient(white, rgba(255,255,255,.15) 1px, transparent 30px),
            radial-gradient(white, rgba(255,255,255,.1) 2px, transparent 40px),
            radial-gradient(rgba(255,255,255,.4), rgba(255,255,255,.1) 2px, transparent 30px);
          background-size: 550px 550px, 350px 350px, 250px 250px, 150px 150px;
          background-position: 0 0, 40px 60px, 130px 270px, 70px 100px;
          animation: bg-stars 200s linear infinite;
        }

        @keyframes bg-stars {
            from { background-position: 0 0, 40px 60px, 130px 270px, 70px 100px; }
            to { background-position: 550px 550px, 390px 410px, 380px 520px, 220px 250px; }
        }

        .wheel-container {
          position: relative;
          width: 400px;
          height: 400px;
          margin: 40px auto;
        }

        .wheel {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 8px solid #fff;
          box-shadow: 0 0 20px rgba(255,255,255,0.7), 0 0 30px #ff6b81, 0 0 40px #ffc75f;
          overflow: hidden;
          position: relative;
          transition: transform 7s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        
        .wheel-segment {
          position: absolute;
          width: 50%;
          height: 100%;
          transform-origin: 100% 50%;
        }

        .wheel-text {
          position: absolute;
          top: 50%;
          left: 0;
          color: #1a1a2e;
          font-weight: bold;
          font-size: 14px;
          text-align: center;
          width: 100px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .wheel-pointer {
          position: absolute;
          top: -20px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 25px solid transparent;
          border-right: 25px solid transparent;
          border-top: 40px solid #f9f871;
          z-index: 10;
          filter: drop-shadow(0 -5px 5px rgba(249, 248, 113, 0.7));
        }
        
        .winner-card {
            animation: winner-pop 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards;
        }
        
        @keyframes winner-pop {
            0% { transform: scale(0.8); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
      
      <div className="night-market-bg min-h-screen flex flex-col items-center justify-center p-4 text-white font-nunito">
        <div className="container mx-auto max-w-4xl text-center">
            
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-2" style={{ textShadow: '0 0 10px #fff, 0 0 20px #ff6b81' }}>
            Spin the Wheel!
          </h1>
          <p className="text-gray-300 text-lg mb-6">Putar Roda Keberuntungan untuk Menentukan Pilihan!</p>

          <div className="flex flex-col lg:flex-row items-start gap-8">
            {/* Roda Putar */}
            <div className="flex-1 w-full flex flex-col items-center">
                <div className="wheel-container">
                    <div className="wheel-pointer"></div>
                    <div className="wheel" style={{ transform: `rotate(${rotation}deg)` }}>
                        {wheelSegments}
                    </div>
                    <Button 
                        onClick={handleSpin} 
                        disabled={isSpinning || options.length < 2}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-white text-[#1a1a2e] text-lg font-bold border-4 border-yellow-300 hover:bg-yellow-200 disabled:opacity-50">
                        {isSpinning ? '...' : 'PUTAR!'}
                    </Button>
                </div>
                {winner && (
                    <Card className="winner-card bg-black/50 border-yellow-400 text-white mt-4 p-4 text-center">
                        <CardHeader>
                            <CardTitle className="text-2xl text-yellow-300 flex items-center justify-center gap-2">
                                <Ticket/> Pemenangnya Adalah...
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-4xl font-bold">{winner}</p>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Panel Kontrol */}
            <div className="lg:w-1/3 w-full">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle>Atur Pilihan Roda</CardTitle>
                  <CardDescription className="text-gray-400">Tambah atau hapus pilihan di sini.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 mb-4">
                    <Input 
                      value={newOption}
                      onChange={(e) => setNewOption(e.target.value)}
                      placeholder="Pilihan baru..."
                      className="bg-gray-800 border-gray-600 text-white"
                      onKeyDown={(e) => e.key === 'Enter' && handleAddOption()}
                    />
                    <Button onClick={handleAddOption} size="icon" variant="secondary">
                      <Plus />
                    </Button>
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                    {options.map((option, index) => (
                      <div key={index} className="flex items-center justify-between bg-black/20 p-2 rounded">
                        <span>{option}</span>
                        <Button onClick={() => handleRemoveOption(index)} size="icon" variant="ghost" className="text-red-400 hover:bg-red-500/20 hover:text-red-300 h-7 w-7">
                          <Trash2 size={16}/>
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        
        <footer className="absolute bottom-4 text-center">
          <Link href="/" className="text-pink-400 hover:text-pink-300 transition-colors inline-flex items-center gap-2">
            <Home size={16}/> Kembali ke Menu Utama
          </Link>
        </footer>
      </div>
    </>
  );
}
