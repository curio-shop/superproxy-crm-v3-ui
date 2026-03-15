import { useEffect, useState, useRef } from 'react';

interface MoneyParticle {
  id: number;
  x: number;
  y: number;
  symbol: string;
  color: string;
  rotation: number;
  scale: number;
  delay: number;
  duration: number;
  drift: number;
}

interface MoneyRainProps {
  trigger: number;
  originX: number;
  originY: number;
}

const moneySymbols = ['฿', '$', '€', '¥', '💰', '💵', '💴', '💶', '💷'];
const moneyColors = ['#10b981', '#059669', '#047857', '#22c55e', '#16a34a', '#15803d', '#f59e0b', '#d97706'];

export default function MoneyRain({ trigger, originX, originY }: MoneyRainProps) {
  const [particles, setParticles] = useState<MoneyParticle[]>([]);
  const prevTriggerRef = useRef(trigger);

  useEffect(() => {
    if (trigger === 0 || trigger === prevTriggerRef.current) return;

    prevTriggerRef.current = trigger;

    const newParticles: MoneyParticle[] = [];
    const particleCount = 20;
    const spreadWidth = 180;

    for (let i = 0; i < particleCount; i++) {
      const xOffset = (Math.random() - 0.5) * spreadWidth;
      const isEmoji = Math.random() > 0.4;

      newParticles.push({
        id: Date.now() + i,
        x: originX + xOffset,
        y: originY - 40,
        symbol: moneySymbols[Math.floor(Math.random() * moneySymbols.length)],
        color: moneyColors[Math.floor(Math.random() * moneyColors.length)],
        rotation: Math.random() * 360,
        scale: isEmoji ? 1.2 + Math.random() * 0.6 : 0.8 + Math.random() * 0.8,
        delay: Math.random() * 0.3,
        duration: 1.8 + Math.random() * 0.6,
        drift: (Math.random() - 0.5) * 60,
      });
    }

    setParticles(newParticles);

    const timeout = setTimeout(() => {
      setParticles([]);
    }, 2800);

    return () => clearTimeout(timeout);
  }, [trigger, originX, originY]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[60] overflow-hidden" style={{ contain: 'layout style paint', willChange: 'contents' }}>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute animate-money-fall"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            '--drift': `${particle.drift}px`,
            '--duration': `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
          } as React.CSSProperties}
        >
          <div
            className="text-2xl font-bold"
            style={{
              color: particle.symbol.startsWith('💰') || particle.symbol.startsWith('💵') ||
                     particle.symbol.startsWith('💴') || particle.symbol.startsWith('💶') ||
                     particle.symbol.startsWith('💷') ? 'inherit' : particle.color,
              transform: `scale(${particle.scale}) rotate(${particle.rotation}deg)`,
              filter: `drop-shadow(0 2px 8px ${particle.color}40)`,
              textShadow: particle.symbol.startsWith('฿') || particle.symbol.startsWith('$') ||
                          particle.symbol.startsWith('€') || particle.symbol.startsWith('¥')
                          ? `0 0 12px ${particle.color}60` : 'none',
            }}
          >
            {particle.symbol}
          </div>
        </div>
      ))}
    </div>
  );
}
