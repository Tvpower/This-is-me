// File: app/page.tsx
import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { Projects } from "@/components/projects"
import { Skills } from "@/components/skills"
import { Contact } from "@/components/contact"
import { GlitchOverlay } from "@/components/glitch-overlay"

export default function Home() {
    return (
        <div className="relative min-h-screen bg-black text-white overflow-hidden">
            <GlitchOverlay />
            <div className="relative z-20">
                <Navbar />
                <main className="container mx-auto px-4">
                    <Hero />
                    <Projects />
                    <Skills />
                    <Contact />
                </main>
            </div>
        </div>
    )
}