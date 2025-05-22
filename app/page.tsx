"use client"

import { useState, useEffect } from "react"
import { Hero } from "@/components/hero"
import { Skills } from "@/components/skills"
import { Contact } from "@/components/contact"
import { GlitchOverlay } from "@/components/glitch-overlay"
import { CRTFrontScreen } from "@/components/crt-front-screen"

export default function Home() {
    const [showFrontScreen, setShowFrontScreen] = useState(true)
    const [activeSection, setActiveSection] = useState<string | null>(null)

    const handleMenuSelect = (option: string) => {
        setShowFrontScreen(false)
        setActiveSection(option)
    }

    const handleBackToMenu = () => {
        setShowFrontScreen(true)
        setActiveSection(null)
    }

    // Add keyboard event handler
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "1" && !showFrontScreen) {
                handleBackToMenu()
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [showFrontScreen])

    // Render the active section content
    const renderContent = () => {
        switch (activeSection) {
            case "me":
                return <Hero />
            case "stack":
                return <Skills />
            case "about":
                return (
                    <section id="about" className="p-8">
                        <h2 className="text-4xl font-bold mb-6 text-center">About</h2>
                        <div className="bg-black/50 p-6 rounded-lg scanlines">
                            <p className="text-lg mb-4">This is an experimental CRT TV interface for the web.</p>
                            <p className="text-lg mb-4">The design mimics old cathode ray tube televisions with their characteristic scanlines, noise, and glitchy effects.</p>
                            <p className="text-lg">Use the menu to navigate between different sections of the site.</p>
                        </div>
                    </section>
                )
            case "contact":
                return <Contact />
            default:
                return <Hero />
        }
    }

    return (
        <div className="relative min-h-screen w-full bg-black text-white overflow-hidden">
            <GlitchOverlay />
            <div className="relative z-20 h-screen w-full">
                {/* Full CRT TV container */}
                <div className="relative w-full h-full overflow-hidden border-4 border-gray-800 rounded-lg">
                    {showFrontScreen ? (
                        <CRTFrontScreen onMenuSelect={handleMenuSelect} fullscreen={true} />
                    ) : (
                        <div className="scanlines on min-h-screen w-full h-full">
                            <div className="overlay h-full">
                                <div className="text">
                                    <span>LIVE</span>
                                </div>
                                <div className="screen relative w-full h-full">
                                    <div className="content-container p-4 relative">
                                        {renderContent()}
                                        
                                        <button 
                                            className="fixed top-4 right-4 bg-red-500 px-4 py-2 rounded-md hover:bg-red-600 transition-colors z-50"
                                            onClick={(e) => {
                                                e.preventDefault()
                                                e.stopPropagation()
                                                handleBackToMenu()
                                            }}
                                            type="button"
                                        >
                                            Back to Menu
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}