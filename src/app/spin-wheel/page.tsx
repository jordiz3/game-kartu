
'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import type confetti from 'canvas-confetti';

// Helper function to dynamically load confetti script
const loadConfetti = async (): Promise<typeof confetti> => {
  const module = await import('canvas-confetti');
  return module.default;
};

export default function SpinWheelCustomPage() {
    const wheelRef = useRef<HTMLCanvasElement>(null);
    const optionsInputRef = useRef<HTMLTextAreaElement>(null);
    const resultBoxRef = useRef<HTMLDivElement>(null);
    const resultTextRef = useRef<HTMLParagraphElement>(null);
    const confettiRef = useRef<typeof confetti | null>(null);

    const segments = useRef<any[]>([]);
    const currentRotation = useRef(0);
    const isSpinning = useRef(false);

    const colorPalette = [
        "#0d9488", "#0891b2", "#0284c7", "#4338ca", "#6d28d9", "#a21caf",
        "#be185d", "#0f766e", "#0e7490", "#0369a1", "#4f46e5", "#7e22ce",
        "#a21caf", "#c026d3"
    ];

    const drawWheel = () => {
        const wheel = wheelRef.current;
        if (!wheel) return;
        const ctx = wheel.getContext('2d');
        if (!ctx) return;

        if (segments.current.length === 0) {
            ctx.clearRect(0, 0, wheel.width, wheel.height);
            return;
        }
        const segmentCount = segments.current.length;
        const segmentAngle = (2 * Math.PI) / segmentCount;
        const radius = wheel.width / 2;

        ctx.clearRect(0, 0, wheel.width, wheel.height);
        ctx.save();
        ctx.translate(radius, radius);
        ctx.rotate(currentRotation.current);
        
        segments.current.forEach((segment, i) => {
            const angle = i * segmentAngle;
            
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.arc(0, 0, radius - 5, angle, angle + segmentAngle);
            ctx.closePath();
            ctx.fillStyle = segment.color;
            ctx.fill();
            ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
            ctx.lineWidth = 4;
            ctx.stroke();

            ctx.save();
            ctx.rotate(angle + segmentAngle / 2);
            ctx.textAlign = "right";
            ctx.fillStyle = "#ffffff";
            const fontSize = segmentCount > 12 ? 14 : 16;
            ctx.font = `bold ${fontSize}px Poppins, sans-serif`;
            ctx.shadowColor = "rgba(0,0,0,0.7)";
            ctx.shadowBlur = 5;
            
            const maxTextWidth = radius - 45;
            let label = segment.label;
            if (ctx.measureText(label).width > maxTextWidth) {
                while (ctx.measureText(label + '...').width > maxTextWidth && label.length > 0) {
                    label = label.slice(0, -1);
                }
                label += '...';
            }
            ctx.fillText(label, radius - 25, 5);
            ctx.restore();
        });
        ctx.restore();
    };

    const updateWheelFromInput = () => {
        const optionsInput = optionsInputRef.current;
        if (!optionsInput) return;
        const options = optionsInput.value.split('\n').filter(opt => opt.trim() !== '');
        if (options.length < 2) {
            alert("Harap masukkan setidaknya 2 pilihan.");
            return;
        }
        segments.current = options.map((opt, i) => ({
            label: opt.trim(),
            color: colorPalette[i % colorPalette.length]
        }));
        currentRotation.current = 0;
        drawWheel();
    };
    
    const displayResult = () => {
        const resultBox = resultBoxRef.current;
        const resultText = resultTextRef.current;
        if (!resultBox || !resultText || !confettiRef.current) return;

        const segmentCount = segments.current.length;
        const segmentAngle = (2 * Math.PI) / segmentCount;
        
        const finalRotation = currentRotation.current % (2 * Math.PI);
        const effectiveAngle = ((2 * Math.PI) - finalRotation + (1.5 * Math.PI)) % (2 * Math.PI);
        const winningIndex = Math.floor(effectiveAngle / segmentAngle);
        const winningSegment = segments.current[winningIndex];

        resultText.textContent = winningSegment.label;
        resultBox.classList.remove('opacity-0', 'scale-90');
        resultBox.classList.add('animate-result', 'active');
        
        const rect = resultBox.getBoundingClientRect();
        const originX = (rect.left + rect.right) / 2 / window.innerWidth;
        const originY = (rect.top + rect.bottom) / 2 / window.innerHeight;

        confettiRef.current({
            particleCount: 150,
            spread: 90,
            origin: { x: originX, y: originY }
        });
    };

    const spin = () => {
        if (isSpinning.current || segments.current.length === 0) return;
        
        isSpinning.current = true;
        const spinButton = document.getElementById('spin-button') as HTMLButtonElement;
        const updateButton = document.getElementById('update-button') as HTMLButtonElement;
        const resultBox = resultBoxRef.current;
        
        if (spinButton) spinButton.disabled = true;
        if (updateButton) updateButton.disabled = true;
        if (resultBox) {
            resultBox.classList.remove('active', 'animate-result');
            resultBox.classList.add('opacity-0', 'scale-90');
        }

        const spinAngle = Math.random() * 15 + 15;
        const destinationAngle = currentRotation.current + spinAngle * 2 * Math.PI;
        let start: number | null = null;
        const duration = 5000;

        const animate = (timestamp: number) => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const easeOutQuart = 1 - Math.pow(1 - (progress / duration), 5);
            
            const newRotation = currentRotation.current + (destinationAngle - currentRotation.current) * easeOutQuart;

            const tempRotation = currentRotation.current;
            currentRotation.current = newRotation;
            drawWheel();
            currentRotation.current = tempRotation;
            
            if (progress < duration) {
                requestAnimationFrame(animate);
            } else {
                currentRotation.current = destinationAngle;
                drawWheel();
                displayResult();
                isSpinning.current = false;
                if (spinButton) spinButton.disabled = false;
                if (updateButton) updateButton.disabled = false;
            }
        };
        
        requestAnimationFrame(animate);
    };

    useEffect(() => {
        loadConfetti().then(confettiInstance => {
          confettiRef.current = confettiInstance;
        });

        updateWheelFromInput();
        
        const updateButton = document.getElementById('update-button');
        const spinButton = document.getElementById('spin-button');

        updateButton?.addEventListener('click', updateWheelFromInput);
        spinButton?.addEventListener('click', spin);

        return () => {
            updateButton?.removeEventListener('click', updateWheelFromInput);
            spinButton?.removeEventListener('click', spin);
        }
    }, []);

    return (
        <>
            <style jsx>{`
                @keyframes gradient-animation {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .main-body {
                    font-family: 'Poppins', sans-serif;
                    background: linear-gradient(-45deg, #0f172a, #0369a1, #1e3a8a, #047857);
                    background-size: 400% 400%;
                    animation: gradient-animation 25s ease infinite;
                    overflow-x: hidden;
                }
                .font-display {
                    font-family: 'Playfair Display', serif;
                    text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                }
                #wheel-container {
                    position: relative;
                    width: 380px;
                    height: 380px;
                    margin: 20px auto;
                    filter: drop-shadow(0 15px 30px rgba(0,0,0,0.4));
                }
                #wheel {
                    width: 100%;
                    height: 100%;
                }
                #pointer {
                    position: absolute;
                    top: -15px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 0;
                    height: 0;
                    border-left: 25px solid transparent;
                    border-right: 25px solid transparent;
                    border-top: 40px solid #facc15; /* yellow-400 */
                    z-index: 10;
                    filter: drop-shadow(0 3px 5px rgba(0,0,0,0.5));
                    transition: transform 0.2s ease-in-out;
                }
                .btn {
                    transition: all 0.3s ease;
                    text-transform: uppercase;
                    letter-spacing: 1.5px;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }
                .btn:hover {
                    transform: translateY(-5px) scale(1.05);
                    box-shadow: 0 20px 30px rgba(0, 0, 0, 0.3);
                }
                .btn:active {
                    transform: translateY(-2px) scale(1.02);
                    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.25);
                }
                .btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                    transform: none;
                    box-shadow: none;
                }
                .glass-panel {
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 1.5rem; /* rounded-3xl */
                    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
                }
                #result-box.active {
                    animation: result-glow 1.5s infinite alternate;
                }
                textarea:focus {
                    box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.6); /* sky-400 */
                    border-color: #38bdf8;
                }
                @keyframes result-glow {
                    from {
                        box-shadow: 0 0 15px rgba(250, 204, 21, 0.4), 0 0 25px rgba(250, 204, 21, 0.3);
                    }
                    to {
                        box-shadow: 0 0 25px rgba(250, 204, 21, 0.8), 0 0 40px rgba(250, 204, 21, 0.6);
                    }
                }
                .animate-result {
                    animation: result-pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                @keyframes result-pop {
                    0% { transform: scale(0.7); opacity: 0; }
                    80% { transform: scale(1.1); opacity: 1; }
                    100% { transform: scale(1); opacity: 1; }
                }
            `}</style>
            <div className="main-body min-h-screen w-screen flex flex-col items-center justify-center text-white p-4">

                <div className="w-full max-w-3xl text-center mb-6">
                    <h1 className="font-display text-5xl md:text-7xl">Roda Putar Kustom</h1>
                    <p className="text-sky-200 mt-3 text-lg">Buat keputusan jadi lebih seru!</p>
                </div>
                
                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-10 mt-6 w-full max-w-6xl">
                    <div className="w-full lg:w-1/3 glass-panel p-6">
                        <label htmlFor="options-input" className="block text-xl font-bold mb-3">Masukkan Pilihan:</label>
                        <textarea ref={optionsInputRef} id="options-input" className="w-full h-48 p-3 rounded-lg text-gray-800 border-2 border-transparent transition" placeholder="Satu pilihan per baris...&#10;Contoh:&#10;Makan malam&#10;Nonton film&#10;Jalan-jalan&#10;Main game" defaultValue="Ya\nTidak\nMungkin\nCoba Lagi"></textarea>
                        <button id="update-button" className="btn w-full mt-4 bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-4 rounded-full">
                            Buat Roda
                        </button>
                    </div>

                    <div className="w-full lg:w-2/3 flex flex-col items-center">
                        <div id="wheel-container">
                            <div id="pointer"></div>
                            <canvas ref={wheelRef} id="wheel" width="380" height="380"></canvas>
                        </div>

                        <button id="spin-button" className="btn mt-6 bg-teal-500 hover:bg-teal-600 text-white font-bold py-4 px-12 rounded-full shadow-lg text-2xl">
                            Putar!
                        </button>

                        <div ref={resultBoxRef} id="result-box" className="mt-8 p-4 glass-panel w-full max-w-md min-h-[100px] flex items-center justify-center opacity-0 scale-90">
                            <p ref={resultTextRef} id="result-text" className="text-3xl font-bold text-yellow-300" style={{textShadow: '0 2px 5px rgba(0,0,0,0.5)'}}></p>
                        </div>
                    </div>
                </div>

                <footer className="absolute bottom-4 text-center">
                    <Link href="/" className="text-pink-400 hover:text-pink-300 transition-colors inline-flex items-center gap-2">
                        Kembali ke Menu Utama
                    </Link>
                </footer>
            </div>
        </>
    );
}
