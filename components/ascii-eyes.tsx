"use client"

import React, { useEffect, useRef, useState, useCallback } from 'react'

interface SingleEyeProps {
  x: number
  y: number
  onDestroy?: () => void
}

enum EyeState {
  APPEARING,
  ALIVE,
  BLINKING,
  FADING,
  DEAD
}

class SingleEye {
  x: number
  y: number
  width: number = 50
  height: number = 20
  eyeCenterX: number = 25
  eyeCenterY: number = 10
  maxPupilOffset: number = 3
  element: HTMLDivElement | null = null
  onDestroy?: () => void
  state: EyeState = EyeState.APPEARING
  
  // Lifecycle timing
  lifespan: number = 15000 + Math.random() * 10000 // 15-25 seconds
  birthTime: number = Date.now()
  
  // Blinking
  lastBlinkTime: number = Date.now()
  blinkInterval: number = 2000 + Math.random() * 4000 // 2-6 seconds between blinks
  blinkDuration: number = 150 + Math.random() * 100 // 150-250ms blink duration
  isBlinking: boolean = false
  
  // Animation
  opacity: number = 0

  constructor(x: number, y: number, container: HTMLElement, onDestroy?: () => void) {
    this.x = x
    this.y = y
    this.onDestroy = onDestroy
    this.createDOM(container)
    this.startAppearAnimation()
  }

  createDOM(container: HTMLElement) {
    this.element = document.createElement('div')
    this.element.className = 'absolute whitespace-pre font-mono text-[10px] leading-[10px] font-bold select-none pointer-events-none text-red-500'
    this.element.style.left = this.x + 'px'
    this.element.style.top = this.y + 'px'
    this.element.style.opacity = '0'
    this.element.style.transition = 'opacity 0.5s ease-in-out'
    container.appendChild(this.element)
  }

  startAppearAnimation() {
    // Fade in over 500ms
    setTimeout(() => {
      if (this.element) {
        this.element.style.opacity = '1'
        this.opacity = 1
        this.state = EyeState.ALIVE
      }
    }, 50)
  }

  startFadeAnimation() {
    this.state = EyeState.FADING
    if (this.element) {
      this.element.style.opacity = '0'
      // Destroy after fade animation completes
      setTimeout(() => {
        this.destroy()
      }, 500)
    }
  }

  updateLifecycle() {
    const now = Date.now()
    const age = now - this.birthTime
    
    // Check if it's time to start fading
    if (this.state === EyeState.ALIVE && age >= this.lifespan) {
      this.startFadeAnimation()
      return
    }
    
    // Handle blinking
    if (this.state === EyeState.ALIVE) {
      const timeSinceLastBlink = now - this.lastBlinkTime
      
      if (!this.isBlinking && timeSinceLastBlink >= this.blinkInterval) {
        // Start blink
        this.isBlinking = true
        this.state = EyeState.BLINKING
        this.lastBlinkTime = now
        
        // End blink after duration
        setTimeout(() => {
          if (this.state === EyeState.BLINKING) {
            this.isBlinking = false
            this.state = EyeState.ALIVE
            // Set next blink interval
            this.blinkInterval = 2000 + Math.random() * 4000
          }
        }, this.blinkDuration)
      }
    }
  }

  isInsideEye(x: number, y: number): boolean {
    const dx = x - this.eyeCenterX
    const dy = y - this.eyeCenterY
    
    const normalizedX = Math.abs(dx) / 20
    const normalizedY = Math.abs(dy) / 7
    
    const almondFactor = 1 - (normalizedX * normalizedX) - (normalizedY * normalizedY * (1 + normalizedX * 0.8))
    
    return almondFactor > 0
  }

  isEyeBoundary(x: number, y: number): boolean {
    if (!this.isInsideEye(x, y)) return false
    
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (!this.isInsideEye(x + dx, y + dy)) {
          return true
        }
      }
    }
    return false
  }

  generateBlinkEye(): string {
    const grid: string[][] = []
    
    for (let y = 0; y < this.height; y++) {
      grid[y] = new Array(this.width).fill(' ')
    }

    // Draw closed eye as a horizontal line
    const blinkY = this.eyeCenterY
    for (let x = 5; x < this.width - 5; x++) {
      const dx = x - this.eyeCenterX
      const distance = Math.abs(dx)
      
      if (distance <= 18) {
        if (distance <= 15) {
          grid[blinkY][x] = '─'
        } else {
          grid[blinkY][x] = '╌'
        }
      }
    }

    // Add eyelash details
    if (grid[blinkY] && grid[blinkY][this.eyeCenterX - 8]) {
      grid[blinkY - 1] = grid[blinkY - 1] || new Array(this.width).fill(' ')
      grid[blinkY - 1][this.eyeCenterX - 8] = '╱'
      grid[blinkY - 1][this.eyeCenterX + 8] = '╲'
    }

    return grid.map(row => row.join('')).join('\n')
  }

  generateEye(pupilOffsetX: number = 0, pupilOffsetY: number = 0): string {
    // If blinking, return blink pattern
    if (this.isBlinking) {
      return this.generateBlinkEye()
    }

    const grid: string[][] = []
    
    for (let y = 0; y < this.height; y++) {
      grid[y] = new Array(this.width).fill(' ')
    }

    const constrainedOffsetX = Math.max(-3, Math.min(3, pupilOffsetX))
    const constrainedOffsetY = Math.max(-2, Math.min(2, pupilOffsetY))
    const pupilCenterX = this.eyeCenterX + constrainedOffsetX
    const pupilCenterY = this.eyeCenterY + constrainedOffsetY

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const dx = x - this.eyeCenterX
        const dy = y - this.eyeCenterY
        const distFromCenter = Math.sqrt(dx * dx + dy * dy)
        
        const pupilDx = x - pupilCenterX
        const pupilDy = y - pupilCenterY
        const distFromPupil = Math.sqrt(pupilDx * pupilDx + pupilDy * pupilDy)

        if (this.isInsideEye(x, y)) {
          if (this.isEyeBoundary(x, y)) {
            grid[y][x] = '#'
          } else if (distFromPupil <= 2.5) {
            grid[y][x] = '@'
          } else if (distFromPupil <= 4) {
            grid[y][x] = '█'
          } else if (distFromCenter <= 6) {
            const angle = Math.atan2(pupilDy, pupilDx)
            const pattern = Math.sin(angle * 6) > 0 ? '▓' : '█'
            grid[y][x] = pattern
          } else {
            const veinPattern1 = Math.sin(x * 0.3 + y * 0.4) * Math.sin(y * 0.2)
            const veinPattern2 = Math.sin(x * 0.2 - y * 0.3) * Math.sin(x * 0.15)
            
            if (veinPattern1 > 0.7 || veinPattern2 > 0.6) {
              grid[y][x] = '.'
            } else if (distFromCenter > 8) {
              grid[y][x] = ':'
            } else {
              grid[y][x] = ' '
            }
          }
        } else {
          const shadowDist = 15
          if (distFromCenter <= shadowDist) {
            const shadowIntensity = (shadowDist - distFromCenter) / shadowDist
            if (shadowIntensity > 0.7) {
              grid[y][x] = '"'
            } else if (shadowIntensity > 0.4) {
              grid[y][x] = "'"
            } else if (shadowIntensity > 0.2) {
              grid[y][x] = '.'
            }
          }
        }
      }
    }

    if (this.isInsideEye(2, this.eyeCenterY)) {
      grid[this.eyeCenterY][2] = '<'
      grid[this.eyeCenterY][3] = '('
    }

    return grid.map(row => row.join('')).join('\n')
  }

  calculatePupilOffset(mouseX: number, mouseY: number): { x: number, y: number } {
    if (!this.element) return { x: 0, y: 0 }
    
    const rect = this.element.getBoundingClientRect()
    const eyeScreenX = rect.left + rect.width / 2
    const eyeScreenY = rect.top + rect.height / 2

    const deltaX = mouseX - eyeScreenX
    const deltaY = mouseY - eyeScreenY
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    
    if (distance === 0) return { x: 0, y: 0 }
    
    const normalizedX = deltaX / distance
    const normalizedY = deltaY / distance
    
    const easingFactor = Math.min(distance / 200, 1)
    
    return {
      x: normalizedX * this.maxPupilOffset * easingFactor,
      y: normalizedY * this.maxPupilOffset * easingFactor
    }
  }

  update(mouseX: number, mouseY: number) {
    if (!this.element || this.state === EyeState.DEAD || this.state === EyeState.FADING) return
    
    // Update lifecycle state (handles blinking and fading)
    this.updateLifecycle()
    
    const offset = this.calculatePupilOffset(mouseX, mouseY)
    this.element.textContent = this.generateEye(offset.x, offset.y)
  }

  destroy() {
    this.state = EyeState.DEAD
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element)
    }
    this.onDestroy?.()
  }
}

interface AsciiEyesProps {
  className?: string
  maxEyes?: number
  startupDelay?: number // Delay before first eyes appear (in ms)
  initialSpawnDelay?: number // Delay between initial eye spawns (in ms)
}

export default function AsciiEyes({ 
  className = '', 
  maxEyes = 6, 
  startupDelay = 2000, 
  initialSpawnDelay = 1500 
}: AsciiEyesProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const eyesRef = useRef<SingleEye[]>([])
  const mousePositionRef = useRef({ x: 0, y: 0 })
  const [, forceUpdate] = useState({})

  const triggerUpdate = useCallback(() => {
    forceUpdate({})
  }, [])

  const addEye = useCallback((x: number, y: number) => {
    if (!containerRef.current) return
    
    const eye = new SingleEye(x, y, containerRef.current, () => {
      eyesRef.current = eyesRef.current.filter(e => e !== eye)
      triggerUpdate()
    })
    eyesRef.current.push(eye)
    eye.update(mousePositionRef.current.x, mousePositionRef.current.y)
    triggerUpdate()
  }, [triggerUpdate])

  const removeAllEyes = useCallback(() => {
    eyesRef.current.forEach(eye => eye.destroy())
    eyesRef.current = []
    triggerUpdate()
  }, [triggerUpdate])

  const updateAllEyes = useCallback(() => {
    eyesRef.current.forEach(eye => eye.update(mousePositionRef.current.x, mousePositionRef.current.y))
  }, [])

  const getRandomEyePosition = useCallback(() => {
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    
    // Eye dimensions (from SingleEye class)
    const eyeWidth = 50
    const eyeHeight = 20
    
    // Calculate safe boundaries
    const minX = 10
    const maxX = viewportWidth - eyeWidth - 10
    const minY = 10
    const maxY = viewportHeight - eyeHeight - 10
    
    // Check collision with existing eyes
    const checkCollision = (x: number, y: number) => {
      const collisionDistance = 80 // Minimum distance between eye centers
      return eyesRef.current.some(eye => {
        const dx = x - eye.x
        const dy = y - eye.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        return distance < collisionDistance
      })
    }
    
    // Try to find a valid position (max 50 attempts to avoid infinite loop)
    for (let attempt = 0; attempt < 50; attempt++) {
      // Alternate between left and right sides for better distribution
      const isLeftSide = attempt % 2 === 0 ? Math.random() < 0.5 : (attempt % 4 < 2)
      
      // Define spawn zones with safe boundaries
      const leftZones = [
        { x: Math.max(minX, viewportWidth * 0.05), y: Math.max(minY, viewportHeight * 0.1) },      // Top-left corner
        { x: Math.max(minX, viewportWidth * 0.05), y: Math.min(maxY, viewportHeight * 0.9) },      // Bottom-left corner
        { x: Math.max(minX, viewportWidth * 0.05), y: Math.max(minY, Math.min(maxY, viewportHeight * (0.3 + Math.random() * 0.4))) },  // Left side
      ]
      
      const rightZones = [
        { x: Math.min(maxX, viewportWidth * 0.95), y: Math.max(minY, viewportHeight * 0.1) },      // Top-right corner
        { x: Math.min(maxX, viewportWidth * 0.95), y: Math.min(maxY, viewportHeight * 0.9) },      // Bottom-right corner
        { x: Math.min(maxX, viewportWidth * 0.95), y: Math.max(minY, Math.min(maxY, viewportHeight * (0.3 + Math.random() * 0.4))) },  // Right side
      ]
      
      // Choose from appropriate side
      const zones = isLeftSide ? leftZones : rightZones
      const randomZone = zones[Math.floor(Math.random() * zones.length)]
      
      // Add some randomness to the position (constrained to safe bounds)
      const maxOffsetX = Math.min(50, (maxX - minX) * 0.1) // 10% of available space or 50px max
      const maxOffsetY = Math.min(25, (maxY - minY) * 0.1) // 10% of available space or 25px max
      
      const randomOffsetX = (Math.random() - 0.5) * maxOffsetX
      const randomOffsetY = (Math.random() - 0.5) * maxOffsetY
      
      // Final position with boundary clamping
      const finalX = Math.max(minX, Math.min(maxX, randomZone.x + randomOffsetX))
      const finalY = Math.max(minY, Math.min(maxY, randomZone.y + randomOffsetY))
      
      // Check if this position is collision-free
      if (!checkCollision(finalX, finalY)) {
        return { x: finalX, y: finalY }
      }
    }
    
    // If we can't find a collision-free position, return a fallback position
    const fallbackX = Math.max(minX, Math.min(maxX, viewportWidth * (Math.random() < 0.5 ? 0.1 : 0.9)))
    const fallbackY = Math.max(minY, Math.min(maxY, viewportHeight * (0.2 + Math.random() * 0.6)))
    
    return { x: fallbackX, y: fallbackY }
  }, [])

  // Initialize eyes at strategic positions
  useEffect(() => {
    if (!containerRef.current) return

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      mousePositionRef.current = { x: e.clientX, y: e.clientY }
      updateAllEyes()
    }

    // Add event listener immediately
    document.addEventListener('mousemove', handleMouseMove)

    // Update loop for smooth animation
    const updateInterval = setInterval(() => {
      updateAllEyes()
    }, 50) // 20 FPS for smooth blinking animation

    // Delayed startup: spawn initial eyes
    const startupTimeout = setTimeout(() => {
      // Spawn initial eyes with delays
      for (let i = 0; i < maxEyes; i++) {
        setTimeout(() => {
          const position = getRandomEyePosition()
          addEye(position.x, position.y)
        }, i * initialSpawnDelay)
      }
    }, startupDelay)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      clearTimeout(startupTimeout)
      clearInterval(updateInterval)
      removeAllEyes()
    }
  }, [addEye, removeAllEyes, updateAllEyes, maxEyes, startupDelay, initialSpawnDelay, getRandomEyePosition])

  return (
    <div 
      ref={containerRef} 
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      style={{ 
        fontFamily: "'Courier New', monospace",
        fontSize: '10px',
        lineHeight: '10px'
      }}
    />
  )
} 