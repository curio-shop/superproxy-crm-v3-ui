import { useEffect, useState, useRef } from 'react';

interface ConfettiParticle {
  id: number;
  x: number;
  y: number;
  color: string;
  rotation: number;
  scale: number;
  delay: number;
  duration: number;
  drift: number;
  rotationSpeed: number;
  shape: 'circle' | 'square' | 'triangle';
}

interface CelebrationProps {
  trigger: number;
  originX: number;
  originY: number;
}

const colors = ['#f43f5e', '#ec4899', '#f97316', '#eab308', '#a855f7', '#06b6d4', '#10b981', '#3b82f6'];

export default function Celebration({ trigger }: CelebrationProps) {
  const [particles, setParticles] = useState<ConfettiParticle[]>([]);
  const prevTriggerRef = useRef(trigger);

  useEffect(() => {
    if (trigger === 0 || trigger === prevTriggerRef.current) return;

    prevTriggerRef.current = trigger;

    const newParticles: ConfettiParticle[] = [];
    const particleCount = 100;

    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: Date.now() + i,
        x: Math.random() * 100,
        y: -10 - Math.random() * 20,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        scale: 0.5 + Math.random() * 0.8,
        delay: Math.random() * 0.5,
        duration: 2.5 + Math.random() * 1.5,
        drift: (Math.random() - 0.5) * 200,
        rotationSpeed: 180 + Math.random() * 360,
        shape: ['circle', 'square', 'triangle'][Math.floor(Math.random() * 3)] as 'circle' | 'square' | 'triangle',
      });
    }

    setParticles(newParticles);

    const timeout = setTimeout(() => {
      setParticles([]);
    }, 4500);

    return () => clearTimeout(timeout);
  }, [trigger]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[60] overflow-hidden" style={{ contain: 'layout style paint', willChange: 'contents' }}>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute animate-confetti-fall"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            '--drift': `${particle.drift}px`,
            '--duration': `${particle.duration}s`,
            '--rotation-speed': `${particle.rotationSpeed}deg`,
            animationDelay: `${particle.delay}s`,
          } as React.CSSProperties}
        >
          {particle.shape === 'circle' && (
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{
                backgroundColor: particle.color,
                transform: `scale(${particle.scale}) rotate(${particle.rotation}deg)`,
                boxShadow: `0 0 10px ${particle.color}50`,
              }}
            />
          )}
          {particle.shape === 'square' && (
            <div
              className="w-2.5 h-2.5"
              style={{
                backgroundColor: particle.color,
                transform: `scale(${particle.scale}) rotate(${particle.rotation}deg)`,
                boxShadow: `0 0 10px ${particle.color}50`,
              }}
            />
          )}
          {particle.shape === 'triangle' && (
            <div
              className="w-0 h-0 border-l-[5px] border-r-[5px] border-b-[7px] border-l-transparent border-r-transparent"
              style={{
                borderBottomColor: particle.color,
                transform: `scale(${particle.scale}) rotate(${particle.rotation}deg)`,
                filter: `drop-shadow(0 0 6px ${particle.color}50)`,
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
