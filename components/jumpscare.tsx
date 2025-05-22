"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

interface JumpscareProps {
  onClose: () => void
}

export function Jumpscare({ onClose }: JumpscareProps) {
  const [visible, setVisible] = useState(false)
  const [phase, setPhase] = useState(0)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)
  const [showBloodEffect, setShowBloodEffect] = useState(false)

  // Create audio element for the scary sound
  useEffect(() => {
    try {
      const audioElement = new Audio()
      audioElement.src = "/jumpscare-sound.mp3"
      audioElement.volume = 0.7
      audioElement.preload = "auto"
      setAudio(audioElement)

      return () => {
        if (audioElement) {
          audioElement.pause()
          audioElement.src = ""
        }
      }
    } catch (error) {
      console.warn("Audio not supported:", error)
    }
  }, [])

  // Control the jumpscare phases
  useEffect(() => {
    let timeouts: NodeJS.Timeout[] = []
    
    // Quick flicker before jumpscare
    const flickerTimer = setTimeout(() => {
      setVisible(true)
      if (audio) audio.play()

      // Phase 1: Static image with TV noise
      timeouts.push(setTimeout(() => setPhase(1), 200))
      
      // Phase 2: Glitching image with shake effect
      timeouts.push(setTimeout(() => setPhase(2), 600))
      
      // Phase 3: Full screen jumpscare with blood effect
      timeouts.push(setTimeout(() => {
        setPhase(3)
        setShowBloodEffect(true)
      }, 1100))
      
      // Phase 4: Zoom effect for extra scare
      timeouts.push(setTimeout(() => setPhase(4), 1800))
      
      // After a delay, close the jumpscare
      timeouts.push(setTimeout(() => {
        setVisible(false)
        setTimeout(() => onClose(), 1000)
      }, 3500))
    }, 600)
    
    timeouts.push(flickerTimer)

    return () => {
      timeouts.forEach(clearTimeout)
    }
  }, [audio, onClose])

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-50 bg-black overflow-hidden">
      {/* TV static background with noise animation */}
      <div className="absolute inset-0 bg-static animate-noise opacity-70"></div>
      
      {/* Red overlay for horror effect */}
      <div className="absolute inset-0 bg-red-900/30 mix-blend-multiply"></div>
      
      {/* Blood drip effect that appears in phase 3 */}
      {showBloodEffect && <div className="blood-drip"></div>}
      
      {/* Flicker effect */}
      <div className="absolute inset-0 bg-white/10 animate-flicker"></div>
      
      {/* Main jumpscare image */}
      <div 
        className={`
          absolute inset-0 flex items-center justify-center transition-all duration-100
          ${phase === 1 ? 'scale-75' : ''}
          ${phase === 2 ? 'scale-100 animate-shake' : ''}
          ${phase === 3 ? 'scale-110 animate-pulsate' : ''}
          ${phase === 4 ? 'animate-zoom' : ''}
        `}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Create a distorted Mario image */}
          <div className="relative w-[80vw] h-[80vh] overflow-hidden">
            {/* Base image */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-full h-full flex justify-center items-center">
                <Image 
                  src="/IMG_1550.jpg"
                  alt="Jumpscare" 
                  width={800} 
                  height={800}
                  className={`
                    object-contain
                    ${phase >= 2 ? 'mix-blend-screen' : ''}
                  `}
                  priority
                />
              </div>
            </div>
            
            {/* Glitch overlays */}
            {phase >= 2 && (
              <div className="absolute inset-0 flex items-center justify-center animate-glitch-1 opacity-70">
                <div className="relative w-full h-full flex justify-center items-center">
                  <Image 
                    src="/mario-jumpscare.jpeg"
                    alt="Jumpscare" 
                    width={800} 
                    height={800}
                    className="object-contain mix-blend-screen"
                    style={{ filter: "hue-rotate(90deg) contrast(2)" }}
                    priority
                  />
                </div>
              </div>
            )}
            
            {phase >= 3 && (
              <div className="absolute inset-0 flex items-center justify-center animate-glitch-3 opacity-70">
                <div className="relative w-full h-full flex justify-center items-center">
                  <Image 
                    src="/mario-jumpscare.jpeg"
                    alt="Jumpscare" 
                    width={800} 
                    height={800}
                    className="object-contain mix-blend-difference"
                    style={{ filter: "invert(0.8)" }}
                    priority
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Scary text */}
      {phase >= 2 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <h1 className={`
            text-red-600 text-9xl font-bold z-10
            ${phase === 2 ? 'animate-glitch-2' : ''}
            ${phase === 3 ? 'animate-shake' : ''}
            ${phase === 4 ? 'animate-pulsate' : ''}
          `}>
            IT'S-A ME
          </h1>
        </div>
      )}
      
      {/* Add subliminal message in phase 3 */}
      {phase >= 3 && (
        <div className="absolute inset-x-0 bottom-10 flex justify-center items-center">
          <p className="text-red-500 font-bold text-3xl animate-glitch-1">YOUR SOUL IS MINE</p>
        </div>
      )}
      
      {/* Add creepy eyes that follow in phase 3 */}
      {phase >= 3 && (
        <>
          <div className="absolute top-[20%] left-[30%] w-8 h-8 rounded-full bg-red-600 animate-pulse"></div>
          <div className="absolute top-[20%] right-[30%] w-8 h-8 rounded-full bg-red-600 animate-pulse"></div>
        </>
      )}
      
      {/* Scanlines overlay */}
      <div className="absolute inset-0 scanlines pointer-events-none"></div>
    </div>
  )
} 