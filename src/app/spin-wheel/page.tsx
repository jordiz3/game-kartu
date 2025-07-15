
'use client';

import { useState, useMemo, useEffect } from 'react';
import { Home, Plus, Trash2, Ticket, Award } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '../../components/ui/card';
import { cn } from '../../lib/utils';

// Palet warna neon yang cerah untuk tema pasar malam
const wheelColors = [
  '#ff6b81', '#ffc75f', '#f9f871', '#7bed9f', '#5352ed',
  '#ff7979', '#f0932b', '#d2dae2', '#48dbfb', '#ff5252',
  '#be2edd', '#f6e58d', '#6ab04c', '#4834d4', '#eb4d4b'
];

const defaultOptions = ['Makan Malam', 'Nonton Film', 'Jajan Boba', 'Masak Bareng', 'Main Game', 'Olahraga'];

export default function SpinWheelPage() {
  const [options, setOptions] = useState<string[]>(defaultOptions);
  const [newOption, setNewOption] = useState('');
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);

  const segmentDegrees = 360 / options.length;
  
  // Efek untuk memunculkan kartu pemenang
  useEffect(() => {
    if (winner !== null) {
      const winnerElement = document.getElementById('winner-card');
      if (winnerElement) {
        winnerElement.classList.remove('winner-pop-out');
        winnerElement.classList.add('winner-pop-in');
      }
    } else {
       const winnerElement = document.getElementById('winner-card');
       if (winnerElement) {
        winnerElement.classList.remove('winner-pop-in');
        winnerElement.classList.add('winner-pop-out');
       }
    }
  }, [winner]);

  const handleAddOption = () => {
    if (newOption.trim() && !options.includes(newOption.trim()) && options.length < 15) {
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

    const randomDegrees = Math.floor(Math.random() * 360);
    const fullRotations = Math.floor(Math.random() * 5) + 5;
    const newRotation = rotation + (360 * fullRotations) + randomDegrees;
    
    setRotation(newRotation);

    setTimeout(() => {
      const finalAngle = newRotation % 360;
      const winningSegmentIndex = Math.floor(((360 - finalAngle + segmentDegrees / 2) % 360) / segmentDegrees);
      
      setWinner(options[winningSegmentIndex]);
      setIsSpinning(false);
    }, 7000); // Harus cocok dengan durasi transisi CSS
  };

  const wheelSegments = useMemo(() => {
    return options.map((option, index) => {
      const rotate = segmentDegrees * index;
      const skewY = 90 - segmentDegrees;
      const backgroundColor = wheelColors[index % wheelColors.length];
      
      return (
        <li
          key={index}
          className="wheel-segment"
          style={{
            transform: `rotate(${rotate}deg) skewY(-${skewY}deg)`,
            background: backgroundColor,
          }}
        >
          <div className="wheel-text" style={{ transform: `skewY(${skewY}deg) rotate(${segmentDegrees / 2}deg)` }}>
            <span>{option}</span>
          </div>
        </li>
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
            position: relative;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            border: 8px solid #fff;
            box-shadow: 0 0 20px rgba(255,255,255,0.7), 0 0 30px #ff6b81, 0 0 40px #ffc75f;
            overflow: hidden;
            transition: transform 7s cubic-bezier(0.25, 0.1, 0.25, 1.0);
        }
        
        .wheel-segments {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            margin: 0;
            padding: 0;
            list-style: none;
            border-radius: 50%;
        }
        
        .wheel-segment {
            overflow: hidden;
            position: absolute;
            top: 0;
            right: 0;
            width: 50%;
            height: 50%;
            transform-origin: 0% 100%;
        }

        .wheel-text {
            position: absolute;
            left: -100%;
            width: 200%;
            height: 200%;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #1a1a2e;
            font-weight: bold;
            font-size: 14px;
            padding-right: 20px;
        }

        .wheel-text span {
          display: inline-block;
          max-width: 80%;
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
            border-left: 20px solid transparent;
            border-right: 20px solid transparent;
            border-top: 35px solid #f9f871;
            z-index: 10;
            filter: drop-shadow(0 -5px 5px rgba(249, 248, 113, 0.7));
            transition: transform 0.3s ease-in-out;
        }

        .is-spinning .wheel-pointer {
            animation: pointer-bob 0.5s infinite ease-in-out;
        }
        
        @keyframes pointer-bob {
            0%, 100% { transform: translateX(-50%) translateY(0); }
            50% { transform: translateX(-50%) translateY(-5px); }
        }
        
        .winner-card {
            opacity: 0;
            transform: scale(0.8) translateY(20px);
            transition: all 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55);
        }

        .winner-pop-in {
            opacity: 1;
            transform: scale(1) translateY(0);
        }
        .winner-pop-out {
            opacity: 0;
            transform: scale(0.8) translateY(20px);
        }
        
        @keyframes glow {
          0% { box-shadow: 0 0 5px #ffc75f, 0 0 10px #ffc75f, 0 0 15px #ffc75f; }
          50% { box-shadow: 0 0 20px #ff6b81, 0 0 30px #ff6b81, 0 0 40px #ff6b81; }
          100% { box-shadow: 0 0 5px #ffc75f, 0 0 10px #ffc75f, 0 0 15px #ffc75f; }
        }

        .glowing-border {
          animation: glow 3s infinite;
        }
      `}</style>
      
      <div className="night-market-bg min-h-screen flex flex-col items-center justify-center p-4 text-white font-nunito overflow-x-hidden">
        <div className="container mx-auto max-w-4xl text-center">
            
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-2" style={{ textShadow: '0 0 10px #fff, 0 0 20px #ff6b81' }}>
            Spin the Wheel!
          </h1>
          <p className="text-gray-300 text-lg mb-6">Putar Roda Keberuntungan untuk Menentukan Pilihan!</p>

          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
            {/* Roda Putar */}
            <div className="flex-1 w-full flex flex-col items-center">
                <div className="wheel-container">
                    <div className={cn("wheel-pointer", { 'is-spinning': isSpinning })}></div>
                    <div className="wheel" style={{ transform: `rotate(${rotation}deg)` }}>
                        <ul className="wheel-segments">
                            {wheelSegments}
                        </ul>
                    </div>
                    <Button 
                        onClick={handleSpin} 
                        disabled={isSpinning || options.length < 2}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-white text-[#1a1a2e] text-lg font-bold border-4 border-yellow-300 hover:bg-yellow-200 disabled:opacity-50 disabled:cursor-not-allowed">
                        {isSpinning ? '...' : 'PUTAR!'}
                    </Button>
                </div>
                <div id="winner-card" className="winner-card min-w-[300px] mt-4">
                  {winner && (
                      <Card className="bg-black/50 border-yellow-400 text-white p-4 text-center glowing-border">
                          <CardHeader>
                              <CardTitle className="text-2xl text-yellow-300 flex items-center justify-center gap-2">
                                  <Award/> Pemenangnya Adalah...
                              </CardTitle>
                          </CardHeader>
                          <CardContent>
                              <p className="text-4xl font-bold">{winner}</p>
                          </CardContent>
                      </Card>
                  )}
                </div>
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
                    <Button onClick={handleAddOption} size="icon" variant="secondary" disabled={options.length >= 15}>
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

    