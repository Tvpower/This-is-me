"use client"

import { useState } from "react"
import { GlitchText } from "@/components/glitch-text"
import { GlitchImage } from "@/components/glitch-image"
import { cn } from "@/lib/utils"

const projects = [
  {
    id: 1,
    title: "NEURAL INTERFACE",
    description:
      "A mind-machine interface for direct thought-to-code translation. Built with React, TensorFlow, and BrainJS.",
    image: "/placeholder.svg?height=400&width=600",
    tags: ["React", "TensorFlow", "Neural Networks", "WebGL"],
  },
  {
    id: 2,
    title: "REALITY PARSER",
    description:
      "Deconstructs visual input into algorithmic patterns. Identifies hidden structures in everyday objects.",
    image: "/placeholder.svg?height=400&width=600",
    tags: ["Three.js", "Computer Vision", "WebAssembly", "GLSL"],
  },
  {
    id: 3,
    title: "THOUGHT COMPILER",
    description:
      "Converts abstract concepts into executable code. Translates between human thought patterns and machine logic.",
    image: "/placeholder.svg?height=400&width=600",
    tags: ["TypeScript", "NLP", "GraphQL", "Next.js"],
  },
]

export function Projects() {
  const [hoveredProject, setHoveredProject] = useState<number | null>(null)
  const [glitchingProject, setGlitchingProject] = useState<number | null>(null)

  return (
    <section id="projects" className="py-20 relative">
      <div className="mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          <GlitchText text="PROJECTS" isActive={Math.random() > 0.9} />
          <span className="text-red-500">_</span>
        </h2>
        <p className="text-gray-400 max-w-2xl font-mono">
          <GlitchText
            text="gooning manifestations of cognitive processes. Each project is a fragment of a larger system."
            isActive={Math.random() > 0.9}
          />
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className={cn(
              "group border border-white/20 bg-black/50 relative overflow-hidden transition-all duration-300",
              hoveredProject === project.id ? "border-red-500/50 shadow-[0_0_15px_rgba(255,0,0,0.3)]" : "",
              Math.random() > 0.8 ? "rotate-[0.3deg]" : "",
              Math.random() > 0.8 ? "-rotate-[0.3deg]" : "",
            )}
            onMouseEnter={() => {
              setHoveredProject(project.id)
              if (Math.random() > 0.7) {
                setGlitchingProject(project.id)
                setTimeout(() => setGlitchingProject(null), 200)
              }
            }}
            onMouseLeave={() => setHoveredProject(null)}
          >
            <GlitchImage
              src={project.image}
              alt={project.title}
              width={600}
              height={400}
              className="w-full h-48 object-cover"
              glitchIntensity={glitchingProject === project.id ? "high" : "low"}
            />

            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">
                <GlitchText text={project.title} isActive={glitchingProject === project.id} intensity="medium" />
              </h3>

              <p className="text-gray-400 mb-4 font-mono text-sm">{project.description}</p>

              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, index) => (
                  <span
                    key={index}
                    className={cn(
                      "text-xs px-2 py-1 border",
                      hoveredProject === project.id
                        ? "border-red-500/50 text-red-500"
                        : "border-white/30 text-white/70",
                    )}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Glitch overlay on hover */}
            {hoveredProject === project.id && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-red-500/5 mix-blend-screen left-[3px] animate-glitch-1" />
                <div className="absolute inset-0 bg-blue-500/5 mix-blend-screen left-[-3px] animate-glitch-2" />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
