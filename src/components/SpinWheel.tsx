import { useState, useRef } from "react";
import Icon from "@/components/ui/icon";

const PRIZES = [
  { label: "Скидка 5%\nна услугу", color: "#c084fc", textColor: "#000" },
  { label: "Скидка 80%\nна маникюр", color: "#f472b6", textColor: "#000" },
  { label: "Скидка 3%\nна услугу", color: "#e879f9", textColor: "#000" },
  { label: "Скидка 80%\nна массаж", color: "#a855f7", textColor: "#fff" },
  { label: "Скидка 2%\nна услугу", color: "#d946ef", textColor: "#000" },
  { label: "Скидка 80%\nна маникюр", color: "#7c3aed", textColor: "#fff" },
];

const SEGMENT_ANGLE = 360 / PRIZES.length;

export default function SpinWheel() {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winner, setWinner] = useState<null | (typeof PRIZES)[0]>(null);
  const [showResult, setShowResult] = useState(false);
  const [hasSpun, setHasSpun] = useState(false);
  const currentRotation = useRef(0);

  const spin = () => {
    if (spinning || hasSpun) return;
    setShowResult(false);
    setWinner(null);
    setSpinning(true);

    const winnerIndex = Math.floor(Math.random() * PRIZES.length);
    const extraSpins = 5 + Math.floor(Math.random() * 3);
    const targetAngle =
      extraSpins * 360 +
      (360 - (winnerIndex * SEGMENT_ANGLE + SEGMENT_ANGLE / 2 - 90)) % 360;

    const newRotation = currentRotation.current + targetAngle;
    currentRotation.current = newRotation;
    setRotation(newRotation);

    setTimeout(() => {
      setSpinning(false);
      setHasSpun(true);
      setWinner(PRIZES[winnerIndex]);
      setShowResult(true);
    }, 4000);
  };

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Wheel */}
      <div className="relative">
        {/* Pointer */}
        <div className="absolute top-1/2 -right-4 -translate-y-1/2 z-20">
          <div
            className="w-0 h-0"
            style={{
              borderTop: "14px solid transparent",
              borderBottom: "14px solid transparent",
              borderRight: "28px solid white",
              filter: "drop-shadow(0 0 6px rgba(255,255,255,0.8))",
            }}
          />
        </div>

        {/* SVG Wheel */}
        <svg
          width="300"
          height="300"
          viewBox="0 0 300 300"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: spinning ? "transform 4s cubic-bezier(0.17, 0.67, 0.12, 1)" : "none",
            filter: "drop-shadow(0 0 30px rgba(168,85,247,0.5))",
          }}
        >
          {PRIZES.map((prize, i) => {
            const startAngle = (i * SEGMENT_ANGLE - 90) * (Math.PI / 180);
            const endAngle = ((i + 1) * SEGMENT_ANGLE - 90) * (Math.PI / 180);
            const r = 140;
            const cx = 150;
            const cy = 150;

            const x1 = cx + r * Math.cos(startAngle);
            const y1 = cy + r * Math.sin(startAngle);
            const x2 = cx + r * Math.cos(endAngle);
            const y2 = cy + r * Math.sin(endAngle);

            const midAngle = ((i + 0.5) * SEGMENT_ANGLE - 90) * (Math.PI / 180);
            const textR = 90;
            const tx = cx + textR * Math.cos(midAngle);
            const ty = cy + textR * Math.sin(midAngle);
            const textRotation = (i + 0.5) * SEGMENT_ANGLE;

            const lines = prize.label.split("\n");

            return (
              <g key={i}>
                <path
                  d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`}
                  fill={prize.color}
                  stroke="rgba(0,0,0,0.3)"
                  strokeWidth="1"
                />
                <text
                  x={tx}
                  y={ty}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform={`rotate(${textRotation}, ${tx}, ${ty})`}
                  fill={prize.textColor}
                  fontSize="11"
                  fontWeight="bold"
                  fontFamily="sans-serif"
                >
                  {lines.map((line, li) => (
                    <tspan key={li} x={tx} dy={li === 0 ? "-7" : "15"}>
                      {line}
                    </tspan>
                  ))}
                </text>
              </g>
            );
          })}
          {/* Center circle */}
          <circle cx="150" cy="150" r="22" fill="#1a1a2e" stroke="rgba(168,85,247,0.6)" strokeWidth="3" />
          <text x="150" y="150" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="18">
            ✨
          </text>
        </svg>
      </div>

      {/* Button */}
      {!hasSpun && (
        <button
          onClick={spin}
          disabled={spinning}
          className="group px-10 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-accent text-white rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-accent/50 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {spinning ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin">🎰</span> Крутится...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Icon name="Sparkles" size={20} />
              Крутить барабан!
            </span>
          )}
        </button>
      )}

      {/* Result */}
      {showResult && winner && (
        <div className="text-center animate-in fade-in duration-500">
          <div className="text-5xl mb-3">🎉</div>
          <h3 className="text-2xl font-black text-white mb-2">Поздравляем!</h3>
          <div
            className="inline-block px-6 py-3 rounded-2xl font-bold text-xl mb-4"
            style={{ background: winner.color, color: winner.textColor }}
          >
            {winner.label.replace("\n", " ")}
          </div>
          <p className="text-white/60 text-sm max-w-xs mx-auto">
            Назовите этот приз администратору при визите — и скидка ваша!
          </p>
        </div>
      )}
    </div>
  );
}
