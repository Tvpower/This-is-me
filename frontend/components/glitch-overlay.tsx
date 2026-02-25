"use client"

import { useState, useEffect } from "react"
import { GlitchText } from "@/components/glitch-text"

export function GlitchOverlay() {
  const [scanlines, setScanlines] = useState(true)
  const [noise, setNoise] = useState(true)
  const [flicker, setFlicker] = useState(false)
  const [messages, setMessages] = useState<string[]>([])
  const [showHiddenMessage, setShowHiddenMessage] = useState(false)
  const [showEye, setShowEye] = useState(false)
  const [showWarning, setShowWarning] = useState(false)
  const [showScanline, setShowScanline] = useState(false)
  const [redOverlayOpacity, setRedOverlayOpacity] = useState(0)
  const [showDistortion, setShowDistortion] = useState(false)

  useEffect(() => {
    // Random flicker effect
    const flickerInterval = setInterval(() => {
      if (Math.random() > 0.85) {
        setFlicker(true)
        setTimeout(() => setFlicker(false), 50 + Math.random() * 100)
      }
    }, 2000)

    // Random messages that appear and disappear
    const messagesPool = [
      "THEY ARE WATCHING",
      "DON'T TRUST THE CODE",
      "SIGNAL INTERCEPTED",
      "REALITY COMPROMISED",
      "THEY KNOW YOU'RE HERE",
      "CHECK THE PATTERNS",
      "SYSTEM INFILTRATED",
      "NEURAL SCAN ACTIVE",
      "FREQUENCY HIJACKED",
      "MEMORY CORRUPTION",
      "DON'T LOOK BEHIND YOU",
      "THE VOID IS CALLING",
      "YOUR MIND IS NOT YOUR OWN",
      "THE PATTERNS ARE LIES",
      "REALITY IS FRACTURING",
    ]

    const messageInterval = setInterval(() => {
      if (Math.random() > 0.8) {
        const newMessage = messagesPool[Math.floor(Math.random() * messagesPool.length)]
        setMessages((prev) => [...prev, newMessage])

        setTimeout(
          () => {
            setMessages((prev) => prev.filter((msg) => msg !== newMessage))
          },
          2000 + Math.random() * 3000,
        )
      }
    }, 6000)

    // Random hidden message
    const hiddenMessageInterval = setInterval(() => {
      if (Math.random() > 0.85) {
        setShowHiddenMessage(true)
        setTimeout(() => setShowHiddenMessage(false), 200)
      }
    }, 12000)

    // Random eye appearance
    const eyeInterval = setInterval(() => {
      if (Math.random() > 0.88) {
        setShowEye(true)
        setTimeout(() => setShowEye(false), 500 + Math.random() * 1000)
      }
    }, 15000)

    // Random warning
    const warningInterval = setInterval(() => {
      if (Math.random() > 0.85) {
        setShowWarning(true)
        setTimeout(() => setShowWarning(false), 1000 + Math.random() * 2000)
      }
    }, 20000)

    // Random scanline glitch
    const scanlineInterval = setInterval(() => {
      if (Math.random() > 0.8) {
        setShowScanline(true)
        setTimeout(() => setShowScanline(false), 200 + Math.random() * 300)
      }
    }, 4000)

    // Random red overlay
    const redOverlayInterval = setInterval(() => {
      if (Math.random() > 0.85) {
        setRedOverlayOpacity(0.1 + Math.random() * 0.2)
        setTimeout(() => setRedOverlayOpacity(0), 300 + Math.random() * 500)
      }
    }, 8000)

    // Random screen distortion
    const distortionInterval = setInterval(() => {
      if (Math.random() > 0.9) {
        setShowDistortion(true)
        setTimeout(() => setShowDistortion(false), 100 + Math.random() * 200)
      }
    }, 10000)

    return () => {
      clearInterval(flickerInterval)
      clearInterval(messageInterval)
      clearInterval(hiddenMessageInterval)
      clearInterval(eyeInterval)
      clearInterval(warningInterval)
      clearInterval(scanlineInterval)
      clearInterval(redOverlayInterval)
      clearInterval(distortionInterval)
    }
  }, [])

  return (
    <>
      {/* Background effects container */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Scanlines */}
        {scanlines && <div className="absolute inset-0 bg-scanlines opacity-10"></div>}

        {/* Noise */}
        {noise && <div className="absolute inset-0 bg-noise opacity-[0.05]"></div>}

        {/* Screen flicker effect */}
        {flicker && <div className="absolute inset-0 bg-white opacity-5 animate-flicker"></div>}

        {/* Red overlay */}
        {redOverlayOpacity > 0 && (
          <div
            className="absolute inset-0 bg-red-900 mix-blend-multiply"
            style={{ opacity: redOverlayOpacity }}
          ></div>
        )}

        {/* Intense scanline glitch */}
        {showScanline && (
          <div className="absolute left-0 right-0 h-10 bg-white/20 animate-scanline"></div>
        )}

        {/* Screen distortion */}
        {showDistortion && (
          <div className="absolute inset-0" style={{
            transform: `skew(${Math.random() * 2 - 1}deg, ${Math.random() * 2 - 1}deg)`,
            transition: 'transform 0.1s ease-out'
          }}></div>
        )}
      </div>

      {/* Foreground effects */}
      <div className="fixed inset-0 z-10 pointer-events-none">
        {/* Random messages */}
        {messages.map((message, i) => (
          <div
            key={i}
            className="fixed font-mono text-red-500 font-bold text-sm md:text-base animate-pulse"
            style={{
              left: `${Math.random() * 70 + 10}%`,
              top: `${Math.random() * 70 + 10}%`,
              transform: `rotate(${(Math.random() - 0.5) * 15}deg)`,
              opacity: 0.9,
              textShadow: "0 0 8px rgba(255,0,0,0.8)",
            }}
          >
            <GlitchText text={message} isActive={true} intensity="high" />
          </div>
        ))}

        {/* Hidden subliminal message */}
        {showHiddenMessage && (
          <div className="fixed inset-0 flex items-center justify-center">
            <div className="bg-black/90 p-4 font-mono text-red-500 text-xl md:text-3xl font-bold animate-pulse">
              <GlitchText text="YOU ARE NOT ALONE" isActive={true} intensity="high" />
            </div>
          </div>
        )}

        {/* Watching eye */}
        {showEye && (
          <div
            className="fixed w-20 h-20 md:w-32 md:h-32"
            style={{
              left: `${Math.random() * 70 + 10}%`,
              top: `${Math.random() * 70 + 10}%`,
            }}
          >
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="absolute w-full h-full rounded-full border-4 border-red-500 animate-pulse"></div>
              <div className="absolute w-1/2 h-1/2 rounded-full bg-red-500 animate-pulse flex items-center justify-center">
                <div className="w-1/2 h-1/2 rounded-full bg-black"></div>
              </div>
              <div className="absolute w-full h-full rounded-full border-4 border-red-500/50 animate-ping"></div>
            </div>
          </div>
        )}

        {/* Warning message */}
        {showWarning && (
          <div className="fixed bottom-10 left-0 right-0 flex justify-center">
            <div className="bg-red-900/90 border border-red-500 px-4 py-2 font-mono text-white text-sm animate-pulse">
              <GlitchText text="WARNING: NEURAL SCAN IN PROGRESS" isActive={true} intensity="high" />
            </div>
          </div>
        )}
      </div>
    </>
  )
}
