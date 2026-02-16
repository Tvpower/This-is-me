'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlitchText } from './glitch-text';

const messages = [
  "they're watching through the screen",
  "the code knows your thoughts",
  "can you hear the whispers?",
  "the patterns are speaking",
  "they're in the network",
  "your mind is not your own",
  "the algorithms are alive",
  "they're collecting your data",
  "the system is aware",
  "your thoughts are not private",
  "the machine is learning",
  "they can see your dreams",
  "the code is watching",
  "your mind is being mapped",
  "the network is conscious",
  "they're in your head",
  "the system is corrupt",
  "your thoughts are exposed",
  "the machine is listening",
  "they're everywhere"
];

interface SchizoTextProps {
  className?: string;
}

const SchizoText: React.FC<SchizoTextProps> = ({ className = '' }) => {
  const [visibleMessages, setVisibleMessages] = useState<Array<{
    id: number;
    text: string;
    x: number;
    y: number;
  }>>([]);

  useEffect(() => {
    const addMessage = () => {
      const newMessage = {
        id: Date.now(),
        text: messages[Math.floor(Math.random() * messages.length)],
        x: Math.random() * 100,
        y: Math.random() * 100,
      };

      setVisibleMessages(prev => [...prev, newMessage]);

      // Remove message after random duration
      setTimeout(() => {
        setVisibleMessages(prev => prev.filter(msg => msg.id !== newMessage.id));
      }, 2000 + Math.random() * 3000);
    };

    // Add messages at random intervals
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance to add a message
        addMessage();
      }
    }, 1000 + Math.random() * 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`fixed inset-0 pointer-events-none ${className}`}>
      <AnimatePresence>
        {visibleMessages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="absolute"
            style={{
              left: `${message.x}%`,
              top: `${message.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <GlitchText
              text={message.text}
              isActive={Math.random() > 0.5}
              intensity="high"
              className="text-red-500/70 text-sm font-mono whitespace-nowrap"
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default SchizoText; 