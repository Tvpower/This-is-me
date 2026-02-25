"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { GlitchText } from "@/components/glitch-text"
import { cn } from "@/lib/utils"

export function Navbar() {
  const [glitching, setGlitching] = useState(false)

  useEffect(() => {
    const interval = setInterval(
      () => {
        setGlitching(true)
        setTimeout(() => setGlitching(false), 200)
      },
      Math.random() * 5000 + 3000,
    )

    return () => clearInterval(interval)
  }, [])

  return (
    <nav className="py-4 px-6 relative z-10">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold relative">
          <GlitchText text="GOON.MIND" isActive={glitching} />
        </Link>

        <div className="hidden md:flex space-x-1">
          {["HOME", "PROJECTS", "SKILLS", "CONTACT"].map((item, index) => (
            <Link
              key={index}
              href={`#${item.toLowerCase()}`}
              className={cn(
                "px-4 py-2 relative overflow-hidden group",
                Math.random() > 0.7 ? "rotate-[0.5deg]" : "",
                Math.random() > 0.7 ? "-rotate-[0.5deg]" : "",
              )}
            >
              <GlitchText text={item} isActive={Math.random() > 0.8} />
              <span className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-200 ease-in-out" />
            </Link>
          ))}
        </div>

        <button className="md:hidden relative">
          <GlitchText text="MENU" isActive={glitching} />
        </button>
      </div>
    </nav>
  )
}
