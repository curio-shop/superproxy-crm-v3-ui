import { useEffect, useState, useRef } from 'react';
import { Icon } from '@iconify/react';

interface PaperParticle {
  id: number;
  x: number;
  y: number;
  color: string;
  rotation: number;
  scale: number;
  velocity: { x: number; y: number };
  delay: number;
}

interface PaperFlyProps {
  trigger: number;
  originX: number;
  originY: number;
}

const paperColors = ['#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe', '#2563eb', '#1d4ed8'];

export default function PaperFly({ trigger, originX, originY }: PaperFlyProps) {
  const [particles, setParticles] = useState<PaperParticle[]>([]);
  const prevTriggerRef = useRef(trigger);

  useEffect(() => {
    if (trigger === 0 || trigger === prevTriggerRef.current) return;

    prevTriggerRef.current = trigger;

    const newParticles: PaperParticle[] = [];
    const particleCount = 15;

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 1.2;
      const velocity = 3.5 + Math.random() * 4;

      newParticles.push({
        id: Date.now() + i,
        x: originX,
        y: originY,
        color: paperColors[Math.floor(Math.random() * paperColors.length)],
        rotation: Math.random() * 360,
        scale: 0.7 + Math.random() * 0.5,
        velocity: {
          x: Math.cos(angle) * velocity * 1.3,
          y: Math.sin(angle) * velocity - 3.5,
        },
        delay: Math.random() * 0.1,
      });
    }

    setParticles(newParticles);

    const timeout = setTimeout(() => {
      setParticles([]);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [trigger, originX, originY]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[60] overflow-hidden" style={{ contain: 'layout style paint', willChange: 'contents' }}>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute animate-paper-fly"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            '--velocity-x': particle.velocity.x,
            '--velocity-y': particle.velocity.y,
            '--rotation': particle.rotation,
            '--delay': `${particle.delay}s`,
          } as React.CSSProperties}
        >
          <div
            style={{
              transform: `scale(${particle.scale})`,
              color: particle.color,
              filter: `drop-shadow(0 2px 4px ${particle.color}40)`,
            }}
          >
            <Icon icon="solar:document-text-bold" width="20" />
          </div>
        </div>
      ))}
    </div>
  );
}
