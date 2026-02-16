"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface GlitchTextProps {
  text: string
  isActive?: boolean
  className?: string
  intensity?: "low" | "medium" | "high"
}

export function GlitchText({ text, isActive = false, className = "", intensity = "medium" }: GlitchTextProps) {
  const [glitchText, setGlitchText] = useState(text)
  const [isGlitching, setIsGlitching] = useState(false)
  const [randomGlitch, setRandomGlitch] = useState(false)
  const [glitchOffset, setGlitchOffset] = useState({ x: 0, y: 0 })

  useEffect(() => {
    // Random chance to glitch even when not explicitly activated
    const randomGlitchInterval = setInterval(() => {
      const intensityFactor = {
        low: 0.08,
        medium: 0.15,
        high: 0.25,
      }[intensity]

      if (Math.random() < intensityFactor) {
        setRandomGlitch(true)
        setGlitchOffset({
          x: (Math.random() - 0.5) * 4,
          y: (Math.random() - 0.5) * 4,
        })
        setTimeout(() => {
          setRandomGlitch(false)
          setGlitchOffset({ x: 0, y: 0 })
        }, 100 + Math.random() * 200)
      }
    }, 1500)

    return () => clearInterval(randomGlitchInterval)
  }, [intensity])

  useEffect(() => {
    if (!isActive && !randomGlitch) {
      setGlitchText(text)
      setIsGlitching(false)
      return
    }

    setIsGlitching(true)

    const glitchChars = "!<>-_\\/[]{}—=+*^?#█▓▒░▄▀■@$%&()~`|"
    let iteration = 0
    const targetText = text === "REALITY" ? "CRAZY" : text

    const interval = setInterval(() => {
      if (text === "REALITY" && Math.random() < 0.3) {
        setGlitchText(targetText)
        return
      }

      setGlitchText(
        text
          .split("")
          .map((char, index) => {
            if (index < iteration) {
              return text[index]
            }

            if (char === " ") return " "

            const randomIntensity = {
              low: 0.15,
              medium: 0.4,
              high: 0.8,
            }[intensity]

            return Math.random() < randomIntensity ? glitchChars[Math.floor(Math.random() * glitchChars.length)] : char
          })
          .join(""),
      )

      if (iteration >= text.length) {
        clearInterval(interval)
        setGlitchText(text)
        setIsGlitching(false)
      }

      iteration += 1 / 3
    }, 20)

    return () => clearInterval(interval)
  }, [text, isActive, intensity, randomGlitch])

  return (
    <span
      className={cn(
        "inline-block relative",
        (isGlitching || randomGlitch) &&
          "before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-red-500/40 before:animate-glitch-1",
        (isGlitching || randomGlitch) &&
          "after:content-[''] after:absolute after:top-0 after:left-0 after:w-full after:h-full after:bg-blue-500/40 after:animate-glitch-2",
        className,
      )}
      style={{
        textShadow:
          isGlitching || randomGlitch
            ? `0.05em 0 0 rgba(255,0,0,0.75), -0.025em -0.05em 0 rgba(0,255,0,0.75), 0.025em 0.05em 0 rgba(0,0,255,0.75)`
            : "none",
        transform: `translate(${glitchOffset.x}px, ${glitchOffset.y}px)`,
        transition: "transform 0.1s ease-out",
      }}
    >
      {glitchText}

      {/* Random character replacement for high intensity */}
      {intensity === "high" && (isGlitching || randomGlitch) && (
        <>
          <span
            className="absolute top-0 left-0 text-red-500 opacity-80 animate-glitch-1"
            style={{
              clipPath: "inset(25% 0 50% 0)",
              transform: "translateX(-2px)",
            }}
          >
            {text
              .split("")
              .map((char, i) => (Math.random() > 0.7 ? "█" : char))
              .join("")}
          </span>
          <span
            className="absolute top-0 left-0 text-blue-500 opacity-60 animate-glitch-2"
            style={{
              clipPath: "inset(50% 0 25% 0)",
              transform: "translateX(2px)",
            }}
          >
            {text
              .split("")
              .map((char, i) => (Math.random() > 0.7 ? "▓" : char))
              .join("")}
          </span>
        </>
      )}
    </span>
  )
}
