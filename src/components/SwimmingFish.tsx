'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Bubble {
  id: number;
  x: number;
  y: number;
}

export default function SwimmingFish() {
  const [position, setPosition] = useState({ x: 100, y: 300 });
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isFlipping, setIsFlipping] = useState(false);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [hearts, setHearts] = useState<Bubble[]>([]);
  const [clickCount, setClickCount] = useState(0);

  // Swim randomly
  useEffect(() => {
    const swim = () => {
      const viewW = typeof window !== 'undefined' ? window.innerWidth : 1200;
      const viewH = typeof window !== 'undefined' ? window.innerHeight : 800;
      const newX = Math.random() * (viewW - 120) + 40;
      const newY = Math.random() * (viewH - 200) + 100;
      setDirection(newX > position.x ? 1 : -1);
      setPosition({ x: newX, y: newY });
    };
    const interval = setInterval(swim, 4000 + Math.random() * 3000);
    return () => clearInterval(interval);
  }, [position.x]);

  // Bubble cleanup
  useEffect(() => {
    if (bubbles.length === 0 && hearts.length === 0) return;
    const timeout = setTimeout(() => {
      setBubbles([]);
      setHearts([]);
    }, 2000);
    return () => clearTimeout(timeout);
  }, [bubbles, hearts]);

  const handleClick = useCallback(() => {
    setClickCount((c) => c + 1);
    setIsFlipping(true);
    setTimeout(() => setIsFlipping(false), 600);

    // Create bubbles
    const newBubbles: Bubble[] = Array.from({ length: 5 }, (_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 60,
      y: -Math.random() * 40,
    }));
    setBubbles(newBubbles);

    // Every 3rd click, show hearts instead
    if ((clickCount + 1) % 3 === 0) {
      const newHearts: Bubble[] = Array.from({ length: 3 }, (_, i) => ({
        id: Date.now() + 100 + i,
        x: (Math.random() - 0.5) * 80,
        y: -Math.random() * 30,
      }));
      setHearts(newHearts);
    }
  }, [clickCount]);

  const fishColor = clickCount % 5 === 0 && clickCount > 0
    ? 'text-amber-500'
    : clickCount % 3 === 0 && clickCount > 0
    ? 'text-pink-500'
    : 'text-teal-500';

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      <motion.div
        className="pointer-events-auto absolute cursor-pointer"
        animate={{
          x: position.x,
          y: position.y,
        }}
        transition={{
          type: 'tween',
          duration: 3,
          ease: 'easeInOut',
        }}
        onClick={handleClick}
        title="Click me! \u{1F41F}"
      >
        {/* Bubbles */}
        <AnimatePresence>
          {bubbles.map((b) => (
            <motion.div
              key={b.id}
              className="absolute text-blue-300"
              initial={{ opacity: 1, x: 20, y: 10, scale: 0.5 }}
              animate={{ opacity: 0, x: 20 + b.x, y: b.y - 60, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              style={{ fontSize: 12 + Math.random() * 8 }}
            >
              {'\u25CB'}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Hearts */}
        <AnimatePresence>
          {hearts.map((h) => (
            <motion.div
              key={h.id}
              className="absolute"
              initial={{ opacity: 1, x: 20, y: 10, scale: 0.3 }}
              animate={{ opacity: 0, x: 20 + h.x, y: h.y - 80, scale: 1.2 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.8, ease: 'easeOut' }}
              style={{ fontSize: 16 }}
            >
              {'\u2764\uFE0F'}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Fish SVG */}
        <motion.div
          animate={{
            scaleX: direction,
            rotateY: isFlipping ? 360 : 0,
            scale: isFlipping ? 1.3 : 1,
          }}
          transition={{
            scaleX: { duration: 0.3 },
            rotateY: { duration: 0.6, ease: 'easeInOut' },
            scale: { duration: 0.3, type: 'spring', stiffness: 300 },
          }}
        >
          <svg
            width="48"
            height="36"
            viewBox="0 0 48 36"
            className={`drop-shadow-lg transition-colors duration-500 ${fishColor}`}
            fill="currentColor"
          >
            {/* Body */}
            <ellipse cx="22" cy="18" rx="16" ry="11" opacity="0.9" />
            {/* Tail */}
            <path d="M36 18 L48 8 L48 28 Z" opacity="0.8" />
            {/* Eye */}
            <circle cx="12" cy="15" r="2.5" fill="white" />
            <circle cx="11.5" cy="14.5" r="1.2" fill="#1a1a1a" />
            {/* Eye shine */}
            <circle cx="11" cy="14" r="0.5" fill="white" />
            {/* Mouth */}
            <path d="M6 19 Q8 21 6 23" fill="none" stroke="white" strokeWidth="0.8" opacity="0.6" />
            {/* Top fin */}
            <path d="M18 7 Q22 2 28 7" opacity="0.7" />
            {/* Bottom fin */}
            <path d="M20 29 Q23 33 27 29" opacity="0.6" />
            {/* Scales shimmer */}
            <ellipse cx="18" cy="16" rx="2" ry="1.5" fill="white" opacity="0.15" />
            <ellipse cx="24" cy="14" rx="1.5" ry="1" fill="white" opacity="0.1" />
            <ellipse cx="20" cy="20" rx="1.5" ry="1" fill="white" opacity="0.1" />
          </svg>
        </motion.div>

        {/* Ripple on hover */}
        <motion.div
          className="absolute -inset-2 rounded-full"
          animate={{
            boxShadow: [
              '0 0 0 0 rgba(20, 184, 166, 0)',
              '0 0 0 8px rgba(20, 184, 166, 0.1)',
              '0 0 0 0 rgba(20, 184, 166, 0)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>
    </div>
  );
}
