"use client"

import { useState, useEffect } from "react"
import { GlitchText } from "@/components/glitch-text"
import { cn } from "@/lib/utils"

const skillCategories = [
  {
    name: "FRONTEND",
    skills: ["React", "Next.js", "Three.js", "WebGL", "GLSL", "CSS/SCSS", "Framer Motion"],
  },
  {
    name: "BACKEND",
    skills: ["Node.js", "Express", "GraphQL", "PostgreSQL", "MongoDB", "Redis", "WebSockets"],
  },
  {
    name: "LANGUAGES",
    skills: ["JavaScript", "TypeScript", "Python", "Rust", "C++", "WebAssembly"],
  },
  {
    name: "TOOLS",
    skills: ["Git", "Docker", "AWS", "Vercel", "Figma", "TensorFlow.js", "Neural Networks"],
  },
]

export function Skills() {
  const [activeCategory, setActiveCategory] = useState(0)
  const [glitchCategory, setGlitchCategory] = useState(false)
  const [scrambledSkills, setScrambledSkills] = useState<number[]>([])

  useEffect(() => {
    // Occasionally glitch the category title
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.8) {
        setGlitchCategory(true)
        setTimeout(() => setGlitchCategory(false), 200)
      }
    }, 5000)

    // Randomly scramble individual skills
    const scrambleInterval = setInterval(() => {
      const randomSkillIndex = Math.floor(Math.random() * skillCategories[activeCategory].skills.length)
      setScrambledSkills((prev) => [...prev, randomSkillIndex])

      setTimeout(() => {
        setScrambledSkills((prev) => prev.filter((i) => i !== randomSkillIndex))
      }, 300)
    }, 3000)

    return () => {
      clearInterval(glitchInterval)
      clearInterval(scrambleInterval)
    }
  }, [activeCategory])

  return (
    <section id="skills" className="py-20 relative">
      <div className="mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          <GlitchText text="SKILLS" isActive={Math.random() > 0.9} />
          <span className="text-red-500">_</span>
        </h2>
        <p className="text-gray-400 max-w-2xl font-mono">
          <GlitchText
            text="Technical capabilities and cognitive extensions. Tools for manipulating reality."
            isActive={Math.random() > 0.9}
          />
        </p>
      </div>

      <div className="grid md:grid-cols-[250px_1fr] gap-8 relative">
        {/* Category tabs */}
        <div className="space-y-2 relative">
          {skillCategories.map((category, index) => (
            <button
              key={index}
              className={cn(
                "w-full text-left px-4 py-3 border font-mono transition-all",
                activeCategory === index
                  ? "border-red-500 bg-red-900/20 text-white"
                  : "border-white/20 text-white/70 hover:border-white/40",
              )}
              onClick={() => setActiveCategory(index)}
            >
              <GlitchText
                text={category.name}
                isActive={activeCategory === index && glitchCategory}
                intensity="medium"
              />
            </button>
          ))}

          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-red-500" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-red-500" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-red-500" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-red-500" />
        </div>

        {/* Skills grid */}
        <div className="border border-white/20 bg-black/50 p-6 relative">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {skillCategories[activeCategory].skills.map((skill, index) => (
              <div
                key={index}
                className={cn(
                  "px-4 py-3 border relative group transition-all duration-200",
                  scrambledSkills.includes(index) ? "border-red-500 text-red-500" : "border-white/30 text-white/80",
                )}
              >
                <div className="relative z-10">
                  <GlitchText text={skill} isActive={scrambledSkills.includes(index)} intensity="high" />
                </div>

                {/* Progress bar */}
                <div className="absolute bottom-0 left-0 h-[2px] bg-white/30 w-full">
                  <div className="h-full bg-red-500" style={{ width: `${Math.random() * 40 + 60}%` }} />
                </div>

                {/* Hover effect */}
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>

          {/* Decorative elements */}
          <div className="absolute top-0 right-0 font-mono text-xs text-white/30 px-2">
            {`SYSTEM.SKILLS[${activeCategory}]`}
          </div>

          <div className="absolute bottom-0 left-0 font-mono text-xs text-white/30 px-2">
            {`PROFICIENCY.LEVEL > 0.8`}
          </div>
        </div>
      </div>
    </section>
  )
}
