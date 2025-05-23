"use client"

import { useState, useEffect } from "react"
import { Hero } from "@/components/hero"
import { Skills } from "@/components/skills"
import { Contact } from "@/components/contact"
import { GlitchOverlay } from "@/components/glitch-overlay"
import { CRTFrontScreen } from "@/components/crt-front-screen"
import { Work } from "@/components/Work"
import { About } from "@/components/about"

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

        const handleMenuSelectEvent = (e: CustomEvent) => {
            handleMenuSelect(e.detail)
        }

        window.addEventListener("keydown", handleKeyDown)
        window.addEventListener("menuSelect", handleMenuSelectEvent as EventListener)
        
        return () => {
            window.removeEventListener("keydown", handleKeyDown)
            window.removeEventListener("menuSelect", handleMenuSelectEvent as EventListener)
        }
    }, [showFrontScreen])

    // Render the active section content
    const renderContent = () => {
        switch (activeSection) {
            case "me":
                return <Hero />
            case "stack":
                return <Work />
            case "about":
                return <About />
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
                                <div className="screen relative w-full h-full overflow-y-auto custom-scrollbar">
                                    <div className="content-container p-4 relative">
                                        {renderContent()}
                                        
                                        <button 
                                            className="absolute top-4 right-4 bg-red-500 px-4 py-2 rounded-md hover:bg-red-600 transition-colors z-50"
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