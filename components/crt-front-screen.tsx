"use client"

import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { Jumpscare } from "@/components/jumpscare"
import { GlitchText } from "@/components/glitch-text"

interface CRTFrontScreenProps {
  onMenuSelect: (option: string) => void
  fullscreen?: boolean
}

export function CRTFrontScreen({ onMenuSelect, fullscreen = false }: CRTFrontScreenProps) {
  const [isOn, setIsOn] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [showJumpscare, setShowJumpscare] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const tvRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const menuOptions = ["ME", "STACK", "ABOUT", "RESTLESS DREAMS", "CONTACT"]
  const animationRef = useRef<number | null>(null)

  // Generate CRT noise
  const generateNoise = (ctx: CanvasRenderingContext2D) => {
    const w = ctx.canvas.width
    const h = ctx.canvas.height
    const imgData = ctx.createImageData(w, h)
    const data = new Uint32Array(imgData.data.buffer)
    const len = data.length

    for (let i = 0; i < len; i++) {
      data[i] = ((255 * Math.random()) | 0) << 24
    }

    ctx.putImageData(imgData, 0, 0)
  }

  const animate = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d")
      if (ctx) generateNoise(ctx)
    }
    animationRef.current = requestAnimationFrame(animate)
  }

  // Create the glitch effect for the text
  useEffect(() => {
    if (textRef.current && isOn) {
      const textElement = textRef.current
      const originalSpan = textElement.querySelector('span')
      
      if (originalSpan) {
        // Clone the span 4 times for the glitch effect
        for (let i = 0; i < 4; i++) {
          const spanClone = originalSpan.cloneNode(true) as HTMLElement
          textElement.appendChild(spanClone)
        }
      }
    }
  }, [isOn])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOn || showJumpscare) return

      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.preventDefault()
        const prev = activeIndex

        if (e.key === "ArrowUp") {
          setActiveIndex(prev => (prev > 0 ? prev - 1 : prev))
        } else if (e.key === "ArrowDown") {
          setActiveIndex(prev => (prev < menuOptions.length - 1 ? prev + 1 : prev))
        }
      } else if (e.key === "Enter" || e.key === "2") {
        handleMenuSelect(menuOptions[activeIndex])
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [activeIndex, isOn, menuOptions, showJumpscare])

  // Handle menu selection with jumpscare for ABOUT
  const handleMenuSelect = (option: string) => {
    if (option === "ABOUT") {
      // Trigger jumpscare for the ABOUT option
      setShowJumpscare(true)
      
      // Add some TV glitching effects before the jumpscare
      const glitchTV = () => {
        setIsOn(false)
        setTimeout(() => setIsOn(true), 100)
        setTimeout(() => setIsOn(false), 200)
        setTimeout(() => setIsOn(true), 300)
      }
      
      glitchTV()
      
      // After jumpscare is done, continue with normal navigation
      return
    }
    
    // For other options, proceed normally
    onMenuSelect(option.toLowerCase())
  }

  // Setup resize observer to handle container size changes
  useEffect(() => {
    // Make sure canvas matches container dimensions on resize
    const updateCanvasSize = () => {
      if (canvasRef.current && tvRef.current) {
        const containerWidth = tvRef.current.clientWidth || window.innerWidth
        const containerHeight = tvRef.current.clientHeight || window.innerHeight
        canvasRef.current.width = containerWidth / 3
        canvasRef.current.height = containerHeight / 3
      }
    }
    
    // Initial size setup
    updateCanvasSize()
    
    // Handle resize
    const resizeObserver = new ResizeObserver(updateCanvasSize)
    if (tvRef.current) {
      resizeObserver.observe(tvRef.current)
    }
    
    // Handle window resize too
    window.addEventListener('resize', updateCanvasSize)
    
    // Turn on TV after a delay
    const timer = setTimeout(() => {
      setIsOn(true)
      animate()
    }, 1000)

    return () => {
      if (tvRef.current) {
        resizeObserver.unobserve(tvRef.current)
      }
      resizeObserver.disconnect()
      window.removeEventListener('resize', updateCanvasSize)
      clearTimeout(timer)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <>
      <main 
        ref={tvRef} 
        className={cn(
          "scanlines w-full h-full", 
          isOn ? "on" : "off",
          fullscreen ? "min-h-screen" : ""
        )}
      >
        <div className="screen relative w-full h-full">
          <canvas 
            ref={canvasRef} 
            className="picture"
          />
          
          <div className="overlay h-full">
            <div className="text" ref={textRef}>
              <span>LIVE</span>
            </div>
            
            {isOn && (
              <div className={cn(
                "flex h-full",
                fullscreen ? "w-full items-center justify-between px-10" : ""
              )}>
                {fullscreen && (
                  <div className="text-left mt-20 ml-10 w-1/2">
                    <h1 className="text-5xl md:text-8xl font-bold leading-tight mb-6">
                      <GlitchText 
                        text="My" 
                        isActive={true} 
                        intensity="high"
                        className="block text-white"
                      />
                      <GlitchText 
                        text="REALITY" 
                        isActive={true} 
                        intensity="high"
                        className="block text-red-500"
                      />
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-xl">
                      Select an option from the TV menu to explore different sections.
                    </p>
                  </div>
                )}
                
                <div className={cn(
                  "menu",
                  fullscreen ? "mr-10 mt-20" : ""
                )}>
                  <header>
                    Main Menu
                  </header>
                  
                  <ul>
                    {menuOptions.map((option, index) => (
                      <li 
                        key={option} 
                        className={activeIndex === index ? "active" : ""}
                        onClick={() => {
                          setActiveIndex(index)
                          handleMenuSelect(option)
                        }}
                      >
                        <a href="#" title="">{option}</a>
                      </li>
                    ))}
                  </ul>
                  
                  <footer>
                    <div className="key">Exit: <span>1</span></div>
                    <div className="key">Select: <span>2</span></div>
                  </footer>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      {/* Jumpscare Component */}
      {showJumpscare && (
        <Jumpscare onClose={() => {
          setShowJumpscare(false)
          onMenuSelect("about") // Continue with normal navigation after jumpscare
        }} />
      )}
    </>
  )
} 