"use client"

import { useState, useEffect } from "react"
import { GlitchText } from "@/components/glitch-text"
import { GlitchImage } from "@/components/glitch-image"
import { cn } from "@/lib/utils"
import AnimatedEyes from '@/components/AnimatedEyes'
import SchizoText from '@/components/schizo-text'

export function Hero() {
  const [glitchTitle, setGlitchTitle] = useState(false)
  const [glitchSubtitle, setGlitchSubtitle] = useState(false)
  const [scrambledText, setScrambledText] = useState(false)
  const [showWarning, setShowWarning] = useState(false)
  const [showCoordinates, setShowCoordinates] = useState(false)
  useEffect(() => {
    const titleInterval = setInterval(
        () => {
          setGlitchTitle(true)
          setTimeout(() => setGlitchTitle(false), 200)
        },
        Math.random() * 5000 + 3000,
    )

    const subtitleInterval = setInterval(
        () => {
          setGlitchSubtitle(true)
          setTimeout(() => setGlitchSubtitle(false), 200)
        },
        Math.random() * 4000 + 2000,
    )

    const scrambleInterval = setInterval(
        () => {
          setScrambledText(true)
          setTimeout(() => setScrambledText(false), 300)
        },
        Math.random() * 7000 + 5000,
    )

    const warningInterval = setInterval(
        () => {
          setShowWarning(true)
          setTimeout(() => setShowWarning(false), 2000)
        },
        Math.random() * 15000 + 10000,
    )

    const coordinatesInterval = setInterval(
        () => {
          setShowCoordinates(true)
          setTimeout(() => setShowCoordinates(false), 3000)
        },
        Math.random() * 20000 + 15000,
    )

    return () => {
      clearInterval(titleInterval)
      clearInterval(subtitleInterval)
      clearInterval(scrambleInterval)
      clearInterval(warningInterval)
      clearInterval(coordinatesInterval)
    }
  }, [])

  return (
      <section id="home" className="min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-fading-background opacity-50"></div>

          {/* Paranoid warning message */}
          {showWarning && (
              <div className="absolute top-10 left-4 right-4 flex justify-center z-20">
                <div className="bg-red-900/80 border border-red-500 px-4 py-2 animate-pulse max-w-fit">
                  <GlitchText
                      text="WARNING: THOUGHT MONITORING ACTIVE"
                      isActive={true}
                      intensity="high"
                      className="text-white font-mono text-sm"
                  />
                </div>
              </div>
          )}

          {/* Coordinates overlay */}
          {showCoordinates && (
              <div className="absolute bottom-10 left-4 z-20 font-mono text-xs text-green-500 opacity-80 max-w-fit">
                <div>LAT: 37°14′06″N</div>
                <div>LON: 115°48′40″W</div>
                <div className="mt-1 text-red-500 animate-pulse">SUBJECT LOCATED</div>
              </div>
          )}

          <div className="min-h-screen flex items-center py-20 px-4">
            <div className="grid md:grid-cols-2 gap-8 items-center relative z-10 w-full max-w-7xl mx-auto">
              <div className="space-y-6 max-w-xl">
                <div className="relative">
                  <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                    <GlitchText text="DIGITAL MIND" isActive={glitchTitle} className="block" intensity="high" />
                    <GlitchText text="DEVELOPER" isActive={glitchTitle} className="block text-red-500" intensity="high" />
                  </h1>

                  {/* Cryptic overlay */}
                  <div className="absolute -top-4 -left-4 font-mono text-xs text-red-500 opacity-70">
                    <div>SCP-███</div>
                    <div>CLASS: KETER</div>
                  </div>
                </div>

                         <p className={cn("text-lg md:text-xl text-gray-400 font-mono", scrambledText && "text-red-500")}>
                  <GlitchText
                      text="Creating experiences from the fragments of reality. I WANT TO KNOW IT ALL."
                      isActive={glitchSubtitle}
                      intensity="high"
                  />
                </p>

                <div className="pt-4 flex flex-wrap gap-4">
                  <button className="relative px-8 py-3 bg-red-900/30 border border-red-500/50 text-red-500 hover:bg-red-900/50 transition-colors group overflow-hidden">
                  <span className="relative z-10">
                    <GlitchText text="VIEW PROJECTS" isActive={Math.random() > 0.6} intensity="high" />
                  </span>
                    <span className="absolute inset-0 bg-glitch-red opacity-0 group-hover:opacity-20 transition-opacity" />
                  </button>

                  <button className="relative px-8 py-3 bg-blue-900/30 border border-blue-500/50 text-blue-500 hover:bg-blue-900/50 transition-colors group overflow-hidden">
                  <span className="relative z-10">
                    <GlitchText text="CONTACT ME" isActive={Math.random() > 0.6} intensity="high" />
                  </span>
                    <span className="absolute inset-0 bg-glitch-blue opacity-0 group-hover:opacity-20 transition-opacity" />
                  </button>
                </div>

                {/* Paranoid text */}
                <div className="font-mono text-xs text-red-500/70 pt-6 max-w-xs">
                  <GlitchText
                      text="They are watching. They are always watching. The code knows. The patterns reveal the truth."
                      isActive={Math.random() > 0.8}
                      intensity="medium"
                  />
                </div>
              </div>

              <div className="relative overflow-hidden">
                <div className="absolute inset-2 border-2 border-dashed border-red-500/20" />
                <div className="absolute inset-2 border-2 border-dashed border-blue-500/20" />

                <GlitchImage
                    src="/IMG_1550.jpg?height=600&width=600"
                    alt="Developer Portrait"
                    width={600}
                    height={600}
                    className="w-full relative border-2 border-white/50"
                    glitchIntensity="high"
                />

                <div className="absolute top-4 right-4 bg-black/80 border border-red-500/50 px-3 py-1 font-mono text-sm">
                  <GlitchText text="SUBJECT.IDENTITY" isActive={Math.random() > 0.7} intensity="high" />
                </div>

                {/* Surveillance markers */}
                <div className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-red-500"></div>
                <div className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 border-red-500"></div>
                <div className="absolute bottom-0 left-0 w-10 h-10 border-b-2 border-l-2 border-red-500"></div>
                <div className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-red-500"></div>

                {/* Data readouts */}
                <div className="absolute bottom-0 left-0 right-0 font-mono text-xs text-green-500 flex justify-between px-4">
                  <span>PULSE: 72 BPM</span>
                  <span>BRAIN: ACTIVE</span>
                  <span>STATUS: MONITORED</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <AnimatedEyes numberOfEyes={8} className="z-30" />
        <SchizoText className="z-30" />
      </section>
  )
}