'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Eye {
  id: number;
  x: number;
  y: number;
  isVisible: boolean;
  isBlinking: boolean;
}

interface AnimatedEyesProps {
  className?: string;
  numberOfEyes?: number;
}

const AnimatedEyes: React.FC<AnimatedEyesProps> = ({ 
  className = '',
  numberOfEyes = 5 
}) => {
  const [eyes, setEyes] = useState<Eye[]>([]);

  useEffect(() => {
    // Initialize eyes with random positions
    const initialEyes = Array.from({ length: numberOfEyes }, (_, index) => ({
      id: index,
      x: Math.random() * 100,
      y: Math.random() * 100,
      isVisible: false,
      isBlinking: false
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
      }, 150);
    };

    // Set up intervals for each eye
    const intervals = initialEyes.map(eye => {
      // Random visibility interval between 2-8 seconds
      const visibilityInterval = setInterval(() => {
        if (Math.random() > 0.5) {
          toggleEyeVisibility(eye.id);
        }
      }, 2000 + Math.random() * 6000);

      // Blinking interval between 2-4 seconds
      const blinkInterval = setInterval(() => {
        if (eyes.find(e => e.id === eye.id)?.isVisible) {
          makeEyeBlink(eye.id);
        }
      }, 2000 + Math.random() * 2000);

      return [visibilityInterval, blinkInterval];
    });

    return () => {
      intervals.forEach(([visibilityInterval, blinkInterval]) => {
        clearInterval(visibilityInterval);
        clearInterval(blinkInterval);
      });
    };
  }, [numberOfEyes]);

  return (
    <div className={`fixed inset-0 pointer-events-none ${className}`}>
      {eyes.map((eye) => (
        <AnimatePresence key={eye.id}>
          {eye.isVisible && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="absolute flex gap-4"
              style={{
                left: `${eye.x}%`,
                top: `${eye.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              {/* Left Eye */}
              <div className="relative w-12 h-12">
                <motion.div
                  className="absolute inset-0 bg-white rounded-full shadow-lg"
                  animate={{
                    scaleY: eye.isBlinking ? 0.1 : 1,
                  }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="absolute inset-2 bg-[#2c3e50] rounded-full">
                    <div className="absolute inset-1 bg-black rounded-full">
                      <div className="absolute inset-1 bg-white rounded-full opacity-20" />
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Right Eye */}
              <div className="relative w-12 h-12">
                <motion.div
                  className="absolute inset-0 bg-white rounded-full shadow-lg"
                  animate={{
                    scaleY: eye.isBlinking ? 0.1 : 1,
                  }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="absolute inset-2 bg-[#2c3e50] rounded-full">
                    <div className="absolute inset-1 bg-black rounded-full">
                      <div className="absolute inset-1 bg-white rounded-full opacity-20" />
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      ))}
    </div>
  );
};

export default AnimatedEyes; 