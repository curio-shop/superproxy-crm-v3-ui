import { useEffect, useState, useRef } from 'react';

interface TreasureParticle {
  id: number;
  x: number;
  y: number;
  type: 'bill' | 'coin' | 'sparkle';
  angle: number;
  velocity: number;
  scale: number;
  delay: number;
  duration: number;
  rotation: number;
  color: string;
}

interface TreasureBurstProps {
  trigger: number;
  originX: number;
  originY: number;
}

const goldColors = ['#fbbf24', '#f59e0b', '#d97706', '#eab308'];
const greenColors = ['#10b981', '#059669', '#047857', '#22c55e'];

export default function TreasureBurst({ trigger, originX, originY }: TreasureBurstProps) {
  const [particles, setParticles] = useState<TreasureParticle[]>([]);
  const prevTriggerRef = useRef(trigger);

  useEffect(() => {
    if (trigger === 0 || trigger === prevTriggerRef.current) return;

    prevTriggerRef.current = trigger;

    const newParticles: TreasureParticle[] = [];
    const particleCount = 45;

    for (let i = 0; i < particleCount; i++) {
      const angle = (i * 360) / particleCount + (Math.random() - 0.5) * 25;
      const velocity = 100 + Math.random() * 140;

      // Mix of bills (40%), coins (40%), and sparkles (20%)
      let type: 'bill' | 'coin' | 'sparkle';
      const rand = Math.random();
      if (rand < 0.4) {
        type = 'bill';
      } else if (rand < 0.8) {
        type = 'coin';
      } else {
        type = 'sparkle';
      }

      newParticles.push({
        id: Date.now() + i,
        x: originX,
        y: originY,
        type,
        angle,
        velocity,
        scale: 0.7 + Math.random() * 0.6,
        delay: Math.random() * 0.1,
        duration: 1.2 + Math.random() * 0.5,
        rotation: (Math.random() - 0.5) * 720,
        color: type === 'bill' ? greenColors[Math.floor(Math.random() * greenColors.length)] : goldColors[Math.floor(Math.random() * goldColors.length)],
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
      {particles.map((particle) => {
        const radians = (particle.angle * Math.PI) / 180;
        const endX = Math.cos(radians) * particle.velocity;
        const endY = Math.sin(radians) * particle.velocity;

        return (
          <div
            key={particle.id}
            className="absolute animate-treasure-burst"
            style={{
              left: `${particle.x}px`,
              top: `${particle.y}px`,
              '--end-x': `${endX}px`,
              '--end-y': `${endY}px`,
              '--duration': `${particle.duration}s`,
              '--rotation': `${particle.rotation}deg`,
              animationDelay: `${particle.delay}s`,
            } as React.CSSProperties}
          >
            {particle.type === 'bill' && (
              <div
                style={{
                  transform: `scale(${particle.scale})`,
                }}
              >
                <svg width="24" height="12" viewBox="0 0 24 12" fill="none">
                  <rect
                    width="24"
                    height="12"
                    rx="1.5"
                    fill={particle.color}
                    opacity="0.95"
                  />
                  <rect
                    x="1"
                    y="1"
                    width="22"
                    height="10"
                    rx="1"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="0.5"
                    opacity="0.5"
                  />
                  <circle
                    cx="12"
                    cy="6"
                    r="3"
                    fill="#fff"
                    opacity="0.4"
                  />
                  <text
                    x="12"
                    y="7.5"
                    textAnchor="middle"
                    fill="#fff"
                    fontSize="5"
                    fontWeight="bold"
                    opacity="0.8"
                  >
                    $
                  </text>
                </svg>
              </div>
            )}
            {particle.type === 'coin' && (
              <div
                style={{
                  transform: `scale(${particle.scale})`,
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle
                    cx="8"
                    cy="8"
                    r="8"
                    fill={particle.color}
                  />
                  <circle
                    cx="8"
                    cy="8"
                    r="6.5"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="0.8"
                    opacity="0.6"
                  />
                  <circle
                    cx="8"
                    cy="8"
                    r="5"
                    fill="#fff"
                    opacity="0.2"
                  />
                  <text
                    x="8"
                    y="10.5"
                    textAnchor="middle"
                    fill="#fff"
                    fontSize="7"
                    fontWeight="bold"
                  >
                    $
                  </text>
                </svg>
              </div>
            )}
            {particle.type === 'sparkle' && (
              <div
                style={{
                  transform: `scale(${particle.scale})`,
                }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M6 0L7.5 4.5L12 6L7.5 7.5L6 12L4.5 7.5L0 6L4.5 4.5L6 0Z"
                    fill={particle.color}
                    style={{
                      filter: `drop-shadow(0 0 4px ${particle.color})`,
                    }}
                  />
                </svg>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
