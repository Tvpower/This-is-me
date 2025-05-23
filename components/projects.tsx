"use client"

import { useState } from "react"
import { GlitchText } from "@/components/glitch-text"
import { GlitchImage } from "@/components/glitch-image"
import { cn } from "@/lib/utils"

const projects = [
  {
    id: 1,
    title: "Advanced RFID Simulation System for Robotics",
    description: "Pioneered a cutting-edge RFID simulation plugin for the Gazebo robotics simulator, enabling realistic tag-reader interactions in virtual environments. Engineered a high-performance C++ simulation system capable of handling hundreds of RFID tags with realistic detection ranges. Developed seamless ROS integration allowing robotic systems to utilize simulated RFID data identically to real-world sensor data. Open-sourced the complete solution, contributing to the global robotics community and enabling faster prototyping of RFID-based robotic systems.",
    image: "/placeholder.svg?height=400&width=600",
    tags: ["C++", "ROS", "Gazebo", "Robotics", "Simulation"],
  },
  {
    id: 2,
    title: "Campus Navigator",
    description: "Integrated Flask framework to create a full-stack site for campus navigation. Utilized Map Nodes and Dijkstra's algorithm to improve navigation speeds and path efficiency by 22%. Implemented JS front end with Python backend.",
    image: "/placeholder.svg?height=400&width=600",
    tags: ["Django", "Data Structures", "JavaScript", "Flask"],
    isChampion: true,
  },
  {
    id: 3,
    title: "Chat App",
    description: "Utilized QT libraries to set up an easy to read UI. Implemented Multiple threads to efficiently receive and send messages in an orderly manner. Established a local network to facilitate communication among various computers within LAN environments.",
    image: "/placeholder.svg?height=400&width=600",
    tags: ["C++", "Qt", "Windows Networking"],
  },
  {
    id: 4,
    title: "Cuda Neural Network",
    description: "Engineered High-Performance CUDA Neural Network capable of processing data 87x faster than CPU implementations. Developed Real-Time 3D Network Visualization Tool allowing intuitive inspection of neural network training dynamics. Implemented Interactive Layer Exploration Features enabling deep inspection and troubleshooting of model behavior. Optimized Memory Management reducing VRAM usage by 63% while maintaining visualization quality. Created Training Evolution View showing animated progression of network learning, crucial for stakeholder demonstrations.",
    image: "/placeholder.svg?height=400&width=600",
    tags: ["CUDA", "Neural Networks", "C++", "3D Visualization", "Performance Optimization"],
  },
  {
    id: 5,
    title: "Mantis_ShrimpOS - Custom Operative System",
    description: "Architected and engineered a fully custom, bare-metal operating system from the ground up, implementing critical kernel functionalities and hardware abstraction layers that established robust communication between software and underlying hardware components. Designed and implemented UEFI bootloader systems utilizing GNU-EFI framework, enabling seamless system initialization across various hardware platforms while maintaining compatibility with modern firmware interfaces. Engineered a comprehensive memory management subsystem featuring virtual memory implementation, efficient paging mechanisms, and memory protection features, dramatically improving system security and resource allocation. Developed a modular kernel infrastructure with extensible architecture allowing for future feature expansion, third-party driver integration, and system optimization without compromising core system stability.",
    image: "/placeholder.svg?height=400&width=600",
    tags: ["Operating Systems", "Kernel Development", "UEFI", "C", "Assembly", "Memory Management"],
  },
  {
    id: 6,
    title: "SustainableEnergy",
    description: "Developed a map website to indicate the best places to build solar panels depending on the solar insolation on that specific area. Implemented Wolfram Alpha API to get necessary information and make calculations on specific areas of the map. Collaborated with other team members to ensure consistent work operations.",
    image: "/placeholder.svg?height=400&width=600",
    tags: ["Svelte", "OpenAI API", "Wolfram Language"],
    isChampion: true,
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
            text="Manifestations of cognitive processes. Each project is a fragment of a larger system."
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
              {project.isChampion && (
                <div className="mb-2 text-sm font-semibold text-yellow-400 flex items-center">
                  <span className="mr-1">🏆</span> Champion Project
                </div>
              )}
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
