"use client"

import React, { useEffect, useRef, useState, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface HybridSpotlightCardProps {
  children: (props: { isHovered: boolean; rotation: { x: number; y: number } }) => ReactNode;
  className?: string;
  glowColor?: 'blue' | 'purple' | 'green' | 'red' | 'orange' | 'brand';
}

const glowColorMap = {
  blue: { base: 220, spread: 200 },
  purple: { base: 280, spread: 300 },
  green: { base: 120, spread: 200 },
  red: { base: 0, spread: 200 },
  orange: { base: 30, spread: 200 },
  brand: { base: 30, spread: 30 } // For Quidax brand orangeish/primary
};

export function HybridSpotlightCard({ 
  children, 
  className = '', 
  glowColor = 'brand',
}: HybridSpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  
  // For the Gradient Card 3D effect
  const [isHovered, setIsHovered] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  const syncPointer = (e: React.PointerEvent<HTMLDivElement>) => {
    const { clientX: x, clientY: y } = e;
    
    if (cardRef.current) {
      // Spotlight calculation
      const rect = cardRef.current.getBoundingClientRect();
      const localX = x - rect.left;
      const localY = y - rect.top;
      cardRef.current.style.setProperty('--x', localX.toFixed(2));
      cardRef.current.style.setProperty('--y', localY.toFixed(2));
      
      const xp = (localX / rect.width).toFixed(2);
      const yp = (localY / rect.height).toFixed(2);
      cardRef.current.style.setProperty('--xp', xp);
      cardRef.current.style.setProperty('--yp', yp);

      // 3D Rotation calculation for inner motion
      if (isHovered) {
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const rotateY = ((x - centerX) / (rect.width / 2)) * 5;
        const rotateX = -((y - centerY) / (rect.height / 2)) * 5;
        setRotation({ x: rotateX, y: rotateY });
      }
    }
  };

  const { base, spread } = glowColorMap[glowColor];

  const beforeAfterStyles = `
    [data-glow]::before,
    [data-glow]::after {
      pointer-events: none;
      content: "";
      position: absolute;
      inset: calc(var(--border-size) * -1);
      border: var(--border-size) solid transparent;
      border-radius: calc(var(--radius) * 1px);
      background-attachment: scroll; /* changed from fixed to scroll for local coordinate system */
      background-size: calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)));
      background-repeat: no-repeat;
      background-position: 50% 50%;
      mask: linear-gradient(transparent, transparent), linear-gradient(white, white);
      mask-clip: padding-box, border-box;
      mask-composite: intersect;
      transition: opacity 0.3s ease;
    }
    
    [data-glow]::before {
      background-image: radial-gradient(
        calc(var(--spotlight-size) * 0.75) calc(var(--spotlight-size) * 0.75) at
        calc(var(--x, 0) * 1px)
        calc(var(--y, 0) * 1px),
        hsl(var(--hue, 210) calc(var(--saturation, 100) * 1%) calc(var(--lightness, 50) * 1%) / var(--border-spot-opacity, 1)), transparent 100%
      );
      filter: brightness(2);
    }
    
    [data-glow]::after {
      background-image: radial-gradient(
        calc(var(--spotlight-size) * 0.5) calc(var(--spotlight-size) * 0.5) at
        calc(var(--x, 0) * 1px)
        calc(var(--y, 0) * 1px),
        hsl(0 100% 100% / var(--border-light-opacity, 1)), transparent 100%
      );
    }
    
    [data-glow] > [data-glow] {
      position: absolute;
      inset: 0;
      will-change: filter;
      opacity: var(--outer, 1);
      border-radius: calc(var(--radius) * 1px);
      border-width: calc(var(--border-size) * 20);
      filter: blur(calc(var(--border-size) * 10));
      background: none;
      pointer-events: none;
      border: none;
    }
    
    [data-glow] > [data-glow]::before {
      inset: -10px;
      border-width: 10px;
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: beforeAfterStyles }} />
      <motion.div
        ref={cardRef}
        data-glow
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setRotation({ x: 0, y: 0 });
        }}
        onPointerMove={syncPointer}
        style={{
          '--base': base,
          '--spread': spread,
          '--radius': '16',
          '--border': '2',
          '--backdrop': 'rgba(20, 20, 25, 0.4)',
          '--backup-border': 'rgba(255, 255, 255, 0.05)',
          '--size': '250',
          '--outer': isHovered ? '1' : '0',
          '--border-size': 'calc(var(--border, 2) * 1px)',
          '--spotlight-size': 'calc(var(--size, 150) * 1px)',
          '--hue': 'calc(var(--base) + (var(--xp, 0) * var(--spread, 0)))',
          backgroundImage: `radial-gradient(
            var(--spotlight-size) var(--spotlight-size) at
            calc(var(--x, 0) * 1px)
            calc(var(--y, 0) * 1px),
            hsl(var(--hue, 210) calc(var(--saturation, 100) * 1%) calc(var(--lightness, 70) * 1%) / var(--bg-spot-opacity, 0.1)), transparent
          )`,
          backgroundColor: 'var(--backdrop, transparent)',
          backgroundSize: 'calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)))',
          backgroundPosition: '50% 50%',
          backgroundAttachment: 'scroll',
          border: 'var(--border-size) solid var(--backup-border)',
          touchAction: 'none' as const,
        } as React.CSSProperties}
        className={`rounded-2xl relative overflow-hidden backdrop-blur-md transition-all duration-300 ${className}`}
        animate={{
          scale: isHovered ? 1.02 : 1,
          rotateX: isHovered ? rotation.x : 0,
          rotateY: isHovered ? rotation.y : 0,
          z: isHovered ? 50 : 0
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <div ref={innerRef} data-glow></div>

        {/* Ambient Gradient Highlights from Gradient Card */}
        <motion.div
          className="absolute top-0 left-0 w-full h-1/3 z-0 pointer-events-none"
          style={{
            background: "linear-gradient(to bottom, rgba(255, 149, 0, 0.1) 0%, transparent 100%)",
          }}
          animate={{
            opacity: isHovered ? 1 : 0.3,
          }}
          transition={{ duration: 0.4 }}
        />

        {/* Card content */}
        <div className="relative z-10 h-full">
          {children({ isHovered, rotation })}
        </div>
      </motion.div>
    </>
  );
}
