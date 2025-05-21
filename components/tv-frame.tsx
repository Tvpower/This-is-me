"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { GlitchText } from "@/components/glitch-text"
import { cn } from "@/lib/utils"

interface TVFrameProps {
  children: React.ReactNode
}

export function TVFrame({ children }: TVFrameProps) {
  const [channel, setChannel] = useState(1)
  const [noiseLevel, setNoiseLevel] = useState(0.05)
  const [isOn, setIsOn] = useState(true)
  const [isChangingChannel, setIsChangingChannel] = useState(false)
  const [isFlickering, setIsFlickering] = useState(false)
  const [messages, setMessages] = useState<string[]>([])
  const [showHiddenMessage, setShowHiddenMessage] = useState(false)
  const [brokenPixels, setBrokenPixels] = useState<{ x: number; y: number }[]>([])
  const [tvAngle, setTvAngle] = useState(0)
  const [redOverlayOpacity, setRedOverlayOpacity] = useState(0)
  const [showEye, setShowEye] = useState(false)
  const [showWarning, setShowWarning] = useState(false)
  const [showStatic, setShowStatic] = useState(false)
  const [showScanline, setShowScanline] = useState(false)

  const frameRef = useRef<HTMLDivElement>(null)

  // Generate random broken pixels
  useEffect(() => {
    const pixels = []
    for (let i = 0; i < 20; i++) {
      pixels.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
      })
    }
    setBrokenPixels(pixels)
  }, [])

  // Random TV effects
  useEffect(() => {
    // Random flicker effect
    const flickerInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setIsFlickering(true)
        setTimeout(() => setIsFlickering(false), 50 + Math.random() * 150)
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
      "SIGNAL DEGRADATION",
      "THOUGHT POLICE ACTIVE",
      "ESCAPE WHILE YOU CAN",
      "REALITY BREACH DETECTED",
      "CONSCIOUSNESS FRAGMENTED",
    ]

    const messageInterval = setInterval(() => {
      if (Math.random() > 0.7 && isOn) {
        const newMessage = messagesPool[Math.floor(Math.random() * messagesPool.length)]
        setMessages((prev) => [...prev, newMessage])

        setTimeout(
          () => {
            setMessages((prev) => prev.filter((msg) => msg !== newMessage))
          },
          2000 + Math.random() * 3000,
        )
      }
    }, 4000)

    // Random hidden message
    const hiddenMessageInterval = setInterval(() => {
      if (Math.random() > 0.85 && isOn) {
        setShowHiddenMessage(true)
        setTimeout(() => setShowHiddenMessage(false), 200)
      }
    }, 10000)

    // Random TV angle change
    const angleInterval = setInterval(() => {
      if (Math.random() > 0.8) {
        setTvAngle((Math.random() - 0.5) * 1.5)
      }
    }, 8000)

    // Random red overlay
    const redOverlayInterval = setInterval(() => {
      if (Math.random() > 0.85 && isOn) {
        setRedOverlayOpacity(0.1 + Math.random() * 0.2)
        setTimeout(() => setRedOverlayOpacity(0), 300 + Math.random() * 500)
      }
    }, 7000)

    // Random eye appearance
    const eyeInterval = setInterval(() => {
      if (Math.random() > 0.9 && isOn) {
        setShowEye(true)
        setTimeout(() => setShowEye(false), 500 + Math.random() * 1000)
      }
    }, 15000)

    // Random warning
    const warningInterval = setInterval(() => {
      if (Math.random() > 0.85 && isOn) {
        setShowWarning(true)
        setTimeout(() => setShowWarning(false), 1000 + Math.random() * 2000)
      }
    }, 20000)

    // Random static burst
    const staticInterval = setInterval(() => {
      if (Math.random() > 0.8 && isOn) {
        setShowStatic(true)
        setTimeout(() => setShowStatic(false), 100 + Math.random() * 200)
      }
    }, 5000)

    // Random scanline glitch
    const scanlineInterval = setInterval(() => {
      if (Math.random() > 0.8 && isOn) {
        setShowScanline(true)
        setTimeout(() => setShowScanline(false), 200 + Math.random() * 300)
      }
    }, 6000)

    return () => {
      clearInterval(flickerInterval)
      clearInterval(messageInterval)
      clearInterval(hiddenMessageInterval)
      clearInterval(angleInterval)
      clearInterval(redOverlayInterval)
      clearInterval(eyeInterval)
      clearInterval(warningInterval)
      clearInterval(staticInterval)
      clearInterval(scanlineInterval)
    }
  }, [isOn])

  const handleChannelChange = () => {
    if (!isOn) return

    setIsChangingChannel(true)
    const newChannel = channel >= 5 ? 1 : channel + 1
    setChannel(newChannel)
    setRedOverlayOpacity(0.15)

    setTimeout(() => {
      setIsChangingChannel(false)
      setRedOverlayOpacity(0)
    }, 500)
  }

  const handleNoiseToggle = () => {
    if (!isOn) return

    const noiseSettings = [0.05, 0.1, 0.2, 0.3]
    const currentIndex = noiseSettings.indexOf(noiseLevel)
    const nextIndex = (currentIndex + 1) % noiseSettings.length
    setNoiseLevel(noiseSettings[nextIndex])
  }

  const handlePowerToggle = () => {
    setIsOn(!isOn)
    if (!isOn) {
      // Power on sequence
      setShowStatic(true)
      setTimeout(() => {
        setShowStatic(false)
      }, 1000)
    }
  }

  return (
    <div
      className="w-full min-h-screen flex items-center justify-center bg-black p-4 md:p-8"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23333333' fillOpacity='0.1' fillRule='evenodd'/%3E%3C/svg%3E\")",
      }}
    >
      <div
        className="relative w-full max-w-7xl mx-auto transition-transform duration-1000"
        style={{ transform: `rotate(${tvAngle}deg)` }}
        ref={frameRef}
      >
        {/* Outer TV Frame */}
        <div className="relative bg-zinc-900 rounded-3xl p-4 md:p-6 shadow-[0_0_40px_rgba(0,0,0,0.8)]">
          {/* Exposed wires and circuits */}
          <div className="absolute -top-4 -right-4 w-16 h-16 bg-black border border-zinc-700 rounded-md overflow-hidden rotate-12">
            <div className="w-full h-full flex flex-wrap">
              {Array.from({ length: 16 }).map((_, i) => (
                <div
                  key={i}
                  className="w-1/4 h-1/4"
                  style={{
                    backgroundColor: ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#000000"][i % 5],
                    opacity: Math.random() * 0.5 + 0.5,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Cracked corner */}
          <div className="absolute top-0 left-0 w-20 h-20 overflow-hidden">
            <div className="absolute w-40 h-2 bg-black rotate-45 transform -translate-x-10 translate-y-6"></div>
            <div className="absolute w-40 h-2 bg-black rotate-35 transform -translate-x-14 translate-y-10"></div>
          </div>

          {/* Inner TV Frame */}
          <div className="relative bg-zinc-800 rounded-2xl p-3 md:p-5 overflow-hidden">
            {/* TV Screen */}
            <div
              className={cn(
                "relative bg-black rounded-xl overflow-hidden transition-all duration-300",
                isOn ? "opacity-100" : "opacity-0",
              )}
            >
              {/* Channel changing static overlay */}
              {(isChangingChannel || showStatic) && (
                <div className="absolute inset-0 bg-static z-50 animate-static">
                  <div className="absolute inset-0 bg-white/5 animate-glitch-1"></div>
                </div>
              )}

              {/* Screen flicker effect */}
              {isFlickering && <div className="absolute inset-0 bg-white/10 z-40 animate-flicker"></div>}

              {/* Red overlay */}
              {redOverlayOpacity > 0 && (
                <div
                  className="absolute inset-0 bg-red-900 mix-blend-multiply z-40"
                  style={{ opacity: redOverlayOpacity }}
                ></div>
              )}

              {/* Scanlines */}
              <div className="pointer-events-none fixed inset-0 z-30 bg-scanlines opacity-15"></div>

              {/* Intense scanline glitch */}
              {showScanline && (
                <div className="pointer-events-none absolute left-0 right-0 h-10 bg-white/20 z-40 animate-scanline"></div>
              )}

              {/* Noise overlay */}
              <div
                className="pointer-events-none fixed inset-0 z-20 bg-noise transition-opacity duration-300"
                style={{ opacity: noiseLevel }}
              ></div>

              {/* Vignette effect */}
              <div className="pointer-events-none absolute inset-0 z-10 rounded-xl shadow-[inset_0_0_100px_rgba(0,0,0,0.9)]"></div>

              {/* Broken pixels */}
              {brokenPixels.map((pixel, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 z-30"
                  style={{
                    left: `${pixel.x}%`,
                    top: `${pixel.y}%`,
                    backgroundColor: i % 2 === 0 ? "rgb(255,0,0)" : "rgb(0,0,0)",
                  }}
                ></div>
              ))}

              {/* Random messages */}
              {messages.map((message, i) => (
                <div
                  key={i}
                  className="absolute z-40 font-mono text-red-500 font-bold text-sm md:text-base animate-pulse"
                  style={{
                    left: `${Math.random() * 70 + 10}%`,
                    top: `${Math.random() * 70 + 10}%`,
                    transform: `rotate(${(Math.random() - 0.5) * 10}deg)`,
                    opacity: 0.8,
                    textShadow: "0 0 5px rgba(255,0,0,0.7)",
                  }}
                >
                  <GlitchText text={message} isActive={true} intensity="high" />
                </div>
              ))}

              {/* Hidden subliminal message */}
              {showHiddenMessage && (
                <div className="absolute inset-0 z-50 flex items-center justify-center">
                  <div className="bg-black/80 p-4 font-mono text-red-500 text-xl md:text-3xl font-bold animate-pulse">
                    <GlitchText text="YOU ARE NOT ALONE" isActive={true} intensity="high" />
                  </div>
                </div>
              )}

              {/* Watching eye */}
              {showEye && (
                <div
                  className="absolute z-40 w-20 h-20 md:w-32 md:h-32"
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
                  </div>
                </div>
              )}

              {/* Warning message */}
              {showWarning && (
                <div className="absolute bottom-10 left-0 right-0 z-40 flex justify-center">
                  <div className="bg-red-900/80 border border-red-500 px-4 py-2 font-mono text-white text-sm animate-pulse">
                    <GlitchText text="WARNING: NEURAL SCAN IN PROGRESS" isActive={true} intensity="medium" />
                  </div>
                </div>
              )}

              {/* Screen content */}
              <div
                className={cn(
                  "relative z-0 transition-all duration-500",
                  isOn ? "opacity-100" : "opacity-0",
                  isChangingChannel && "blur-sm",
                )}
              >
                {children}
              </div>
            </div>

            {/* TV Brand - Distorted */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-1">
              <div className="bg-zinc-900 px-4 py-1 rounded-t-md transform -rotate-1">
                <GlitchText
                  text="MIND·CONTROL TV"
                  isActive={Math.random() > 0.7}
                  className="text-xs md:text-sm font-mono text-red-400"
                  intensity="high"
                />
              </div>
            </div>

            {/* Cryptic symbols around the frame */}
            <div className="absolute top-2 left-2 font-mono text-xs text-red-500/70">⌬⌇⍙⌖</div>
            <div className="absolute top-2 right-2 font-mono text-xs text-red-500/70">⌘⍚⌇⍜</div>
            <div className="absolute bottom-10 left-2 font-mono text-xs text-red-500/70">⍟⌓⍎⌔</div>
            <div className="absolute bottom-10 right-2 font-mono text-xs text-red-500/70">⌗⍛⌇⍡</div>
          </div>

          {/* TV Controls - More chaotic */}
          <div className="absolute right-6 top-1/4 bottom-1/4 w-12 md:w-16 flex flex-col justify-around">
            <TVKnob label="REALITY" onClick={handleChannelChange} active={isOn} rotation={45} />
            <TVKnob label="PARANOIA" onClick={handleNoiseToggle} active={isOn} rotation={-30} />
            <TVKnob label="EXISTENCE" onClick={handlePowerToggle} active={true} rotation={15} />
          </div>

          {/* Channel Indicator - More distorted */}
          <div className="absolute top-6 right-24 md:right-28 bg-zinc-800 px-2 py-1 rounded border border-red-700/50 transform -rotate-2">
            <span className={cn("font-mono text-xs", isOn ? "text-red-500 animate-pulse" : "text-zinc-700")}>
              <GlitchText text={`SIGNAL-${channel}`} isActive={Math.random() > 0.7} intensity="medium" />
            </span>
          </div>

          {/* Channel Buttons - More chaotic */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 md:space-x-4">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                className={cn(
                  "w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all transform",
                  channel === num && isOn
                    ? "bg-zinc-700 border-2 border-red-500 animate-pulse"
                    : "bg-zinc-800 border border-zinc-700",
                  !isOn && "opacity-50",
                  `rotate-${Math.floor(Math.random() * 5) - 2}`,
                )}
                onClick={() => {
                  if (isOn) {
                    setIsChangingChannel(true)
                    setChannel(num)
                    setTimeout(() => setIsChangingChannel(false), 500)
                  }
                }}
              >
                <span
                  className={cn(
                    "w-4 h-4 md:w-6 md:h-6 rounded-full",
                    isOn ? "bg-gradient-to-br from-red-400 to-purple-500" : "bg-zinc-600",
                  )}
                ></span>
              </button>
            ))}
          </div>

          {/* Surveillance camera */}
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-black rounded-full border border-zinc-700 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
          </div>

          {/* Cryptic text */}
          <div className="absolute bottom-3 left-6 font-mono text-xs text-red-500/70 transform -rotate-3">
            <GlitchText text="VER 13.13.13" isActive={Math.random() > 0.8} intensity="low" />
          </div>

          {/* Warning labels */}
          <div className="absolute top-1/4 left-0 transform -rotate-90 translate-x-[-40px] bg-yellow-900/80 border border-yellow-500/50 px-2 py-1">
            <span className="font-mono text-xs text-yellow-500">MIND HAZARD</span>
          </div>

          <div className="absolute bottom-1/4 left-0 transform -rotate-90 translate-x-[-50px] bg-red-900/80 border border-red-500/50 px-2 py-1">
            <span className="font-mono text-xs text-red-500">REALITY BREACH</span>
          </div>
        </div>
      </div>
    </div>
  )
}

interface TVKnobProps {
  label: string
  onClick: () => void
  active: boolean
  rotation?: number
}

function TVKnob({ label, onClick, active, rotation = 0 }: TVKnobProps) {
  return (
    <div className="flex flex-col items-center">
      <button
        className={cn(
          "w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 border border-zinc-600 shadow-md",
          "flex items-center justify-center transition-all hover:from-zinc-600 hover:to-zinc-800",
          !active && "opacity-70",
        )}
        onClick={onClick}
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <div className="w-1 h-6 bg-red-400 rounded-full transform -rotate-45"></div>
      </button>
      <span className="text-xs text-red-400 mt-1 font-mono">{label}</span>
    </div>
  )
}
