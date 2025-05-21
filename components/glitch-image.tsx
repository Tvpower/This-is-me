"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface GlitchImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  glitchIntensity?: "low" | "medium" | "high"
}

export function GlitchImage({ src, alt, width, height, className = "", glitchIntensity = "medium" }: GlitchImageProps) {
  const [isGlitching, setIsGlitching] = useState(false)
  const [isIntenseGlitch, setIsIntenseGlitch] = useState(false)
  const [glitchX, setGlitchX] = useState(0)
  const [glitchY, setGlitchY] = useState(0)

  useEffect(() => {
    const intensityFactor = {
      low: 0.1,
      medium: 0.3,
      high: 0.6,
    }[glitchIntensity]

    const glitchInterval = setInterval(
      () => {
        const shouldGlitch = Math.random() > 1 - intensityFactor

        if (shouldGlitch) {
          setIsGlitching(true)
          setGlitchX((Math.random() - 0.5) * 10)
          setGlitchY((Math.random() - 0.5) * 10)

          // Chance for more intense glitch
          if (Math.random() > 0.7) {
            setIsIntenseGlitch(true)
          }

          setTimeout(
            () => {
              setIsGlitching(false)
              setIsIntenseGlitch(false)
            },
            Math.random() * 200 + 50,
          )
        }
      },
      Math.random() * 2000 + 1000,
    )

    return () => clearInterval(glitchInterval)
  }, [glitchIntensity])

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image
        src={src || "/placeholder.svg"}
        alt={alt}
        width={width}
        height={height}
        className={cn(
          "transition-all duration-100",
          isGlitching && "scale-[1.01] brightness-150 contrast-150",
          isIntenseGlitch && "hue-rotate-180",
        )}
        style={{
          transform: isGlitching ? `translate(${glitchX}px, ${glitchY}px)` : "none",
        }}
      />

      {isGlitching && (
        <>
          <div
            className="absolute inset-0 bg-red-500/20 mix-blend-screen animate-glitch-1"
            style={{ left: `${glitchX + 5}px` }}
          />
          <div
            className="absolute inset-0 bg-blue-500/20 mix-blend-screen animate-glitch-2"
            style={{ left: `${glitchX - 5}px` }}
          />
          <div
            className="absolute inset-0 bg-green-500/20 mix-blend-screen animate-glitch-3"
            style={{ top: `${glitchY + 3}px` }}
          />

          {/* Horizontal glitch lines */}
          {isIntenseGlitch &&
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="absolute left-0 right-0 h-[2px] bg-white/80"
                style={{
                  top: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.8 + 0.2,
                }}
              />
            ))}

          {/* Offset duplicate for intense glitch */}
          {isIntenseGlitch && (
            <div
              className="absolute inset-0 overflow-hidden opacity-70"
              style={{
                clipPath: "inset(10% 0 70% 0)",
                transform: `translateX(${(Math.random() - 0.5) * 20}px)`,
              }}
            >
              <Image
                src={src || "/placeholder.svg"}
                alt=""
                width={width}
                height={height}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </>
      )}

      {/* Scan line effect */}
      <div
        className="absolute left-0 right-0 h-[1px] bg-white/30 opacity-50 pointer-events-none"
        style={{
          top: `${(Date.now() / 50) % 100}%`,
          animation: "scanline 3s linear infinite",
        }}
      />

      {/* Surveillance markers */}
      <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-red-500/70 opacity-70" />
      <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-red-500/70 opacity-70" />
      <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-red-500/70 opacity-70" />
      <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-red-500/70 opacity-70" />
    </div>
  )
}
