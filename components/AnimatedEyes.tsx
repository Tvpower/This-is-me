'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Eye {
  id: number;
  x: number;
  y: number;
  isVisible: boolean;
  isBlinking: boolean;
  glowIntensity: number;
  color: string;
}

interface AnimatedEyesProps {
  className?: string;
  numberOfEyes?: number;
}

const AnimatedEyes: React.FC<AnimatedEyesProps> = ({
                                                     className = '',
                                                     numberOfEyes = 8
                                                   }) => {
  const [eyes, setEyes] = useState<Eye[]>([]);

  useEffect(() => {
    // Eye colors for variety - mostly reds and yellows for that sinister look
    const eyeColors = [
      '#ff0000', // Bright red
      '#ff4444', // Lighter red
      '#ffaa00', // Orange-yellow
      '#ffff00', // Yellow
      '#ff6600', // Orange
      '#aa0000', // Dark red
    ];

    // Fix: Constrain eye positions to safe area (10-90% instead of 0-100%)
    const initialEyes = Array.from({ length: numberOfEyes }, (_, index) => ({
      id: index,
      x: 10 + Math.random() * 80, // 10% to 90% instead of 0% to 100%
      y: 10 + Math.random() * 80, // 10% to 90% instead of 0% to 100%
      isVisible: Math.random() > 0.5, // 50% chance of being visible initially
      isBlinking: false,
      glowIntensity: 0.8 + Math.random() * 0.4, // Random glow intensity
      color: eyeColors[Math.floor(Math.random() * eyeColors.length)]
    }));
    setEyes(initialEyes);

    // Function to toggle eye visibility
    const toggleEyeVisibility = (eyeId: number) => {
      setEyes(prevEyes =>
          prevEyes.map(eye =>
              eye.id === eyeId
                  ? { ...eye, isVisible: !eye.isVisible }
                  : eye
          )
      );
    };

    // Function to make eye blink
    const makeEyeBlink = (eyeId: number) => {
      setEyes(prevEyes =>
          prevEyes.map(eye =>
              eye.id === eyeId
                  ? { ...eye, isBlinking: true }
                  : eye
          )
      );
      setTimeout(() => {
        setEyes(prevEyes =>
            prevEyes.map(eye =>
                eye.id === eyeId
                    ? { ...eye, isBlinking: false }
                    : eye
            )
        );
      }, 100 + Math.random() * 100); // Vary blink duration
    };

    // Function to change glow intensity randomly
    const changeGlowIntensity = (eyeId: number) => {
      setEyes(prevEyes =>
          prevEyes.map(eye =>
              eye.id === eyeId
                  ? { ...eye, glowIntensity: 0.6 + Math.random() * 0.6 }
                  : eye
          )
      );
    };

    // Set up intervals for each eye
    const intervals = initialEyes.map(eye => {
      // Random visibility interval between 3-12 seconds
      const visibilityInterval = setInterval(() => {
        if (Math.random() > 0.3) {
          toggleEyeVisibility(eye.id);
        }
      }, 3000 + Math.random() * 9000);

      // Blinking interval between 1-5 seconds when visible
      const blinkInterval = setInterval(() => {
        const currentEye = eyes.find(e => e.id === eye.id);
        if (currentEye?.isVisible && Math.random() > 0.4) {
          makeEyeBlink(eye.id);
        }
      }, 1000 + Math.random() * 4000);

      // Glow intensity change interval
      const glowInterval = setInterval(() => {
        if (Math.random() > 0.7) {
          changeGlowIntensity(eye.id);
        }
      }, 2000 + Math.random() * 3000);

      return [visibilityInterval, blinkInterval, glowInterval];
    });

    return () => {
      intervals.forEach(([visibilityInterval, blinkInterval, glowInterval]) => {
        clearInterval(visibilityInterval);
        clearInterval(blinkInterval);
        clearInterval(glowInterval);
      });
    };
  }, [numberOfEyes]);

  return (
      <div className={`absolute inset-0 pointer-events-none overflow-hidden p-4 ${className}`}>
        {eyes.map((eye) => (
            <AnimatePresence key={eye.id}>
              {eye.isVisible && (
                  <motion.div
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: eye.glowIntensity,
                        scale: [1, 1.05, 1], // Subtle breathing effect
                      }}
                      exit={{ opacity: 0 }}
                      transition={{
                        opacity: { duration: 0.5 },
                        scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                      }}
                      className="absolute flex gap-3"
                      style={{
                        left: `${eye.x}%`,
                        top: `${eye.y}%`,
                        transform: 'translate(-50%, -50%)',
                        filter: `drop-shadow(0 0 8px ${eye.color}) drop-shadow(0 0 16px ${eye.color}40)`,
                        zIndex: 50, // Ensure eyes are above other content
                      }}
                  >
                    {/* Left Eye */}
                    <motion.div
                        className="relative w-3 h-3"
                        animate={{
                          scaleY: eye.isBlinking ? 0.1 : 1,
                          opacity: eye.isBlinking ? 0.3 : 1,
                        }}
                        transition={{ duration: 0.1 }}
                    >
                      <div
                          className="absolute inset-0 rounded-full"
                          style={{
                            backgroundColor: eye.color,
                            boxShadow: `
                      0 0 6px ${eye.color},
                      0 0 12px ${eye.color},
                      0 0 18px ${eye.color}40,
                      inset 0 0 4px ${eye.color}
                    `,
                          }}
                      >
                        {/* Inner highlight for more depth */}
                        <div
                            className="absolute inset-0.5 rounded-full opacity-60"
                            style={{
                              backgroundColor: '#ffffff',
                              filter: 'blur(0.5px)',
                            }}
                        />
                      </div>
                    </motion.div>

                    {/* Right Eye */}
                    <motion.div
                        className="relative w-3 h-3"
                        animate={{
                          scaleY: eye.isBlinking ? 0.1 : 1,
                          opacity: eye.isBlinking ? 0.3 : 1,
                        }}
                        transition={{ duration: 0.1 }}
                    >
                      <div
                          className="absolute inset-0 rounded-full"
                          style={{
                            backgroundColor: eye.color,
                            boxShadow: `
                      0 0 6px ${eye.color},
                      0 0 12px ${eye.color},
                      0 0 18px ${eye.color}40,
                      inset 0 0 4px ${eye.color}
                    `,
                          }}
                      >
                        {/* Inner highlight for more depth */}
                        <div
                            className="absolute inset-0.5 rounded-full opacity-60"
                            style={{
                              backgroundColor: '#ffffff',
                              filter: 'blur(0.5px)',
                            }}
                        />
                      </div>
                    </motion.div>
                  </motion.div>
              )}
            </AnimatePresence>
        ))}
      </div>
  );
};

export default AnimatedEyes;