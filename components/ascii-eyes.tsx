"use client"

import React, { useEffect, useRef, useState, useCallback } from 'react'

interface SingleEyeProps {
  x: number
  y: number
  onDestroy?: () => void
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

  constructor(x: number, y: number, container: HTMLElement, onDestroy?: () => void) {
    this.x = x
    this.y = y
    this.onDestroy = onDestroy
    this.createDOM(container)
  }

  createDOM(container: HTMLElement) {
    this.element = document.createElement('div')
    this.element.className = 'absolute whitespace-pre font-mono text-[10px] leading-[10px] font-bold select-none pointer-events-none text-red-500'
    this.element.style.left = this.x + 'px'
    this.element.style.top = this.y + 'px'
    container.appendChild(this.element)
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

  generateEye(pupilOffsetX: number = 0, pupilOffsetY: number = 0): string {
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
    if (!this.element) return
    const offset = this.calculatePupilOffset(mouseX, mouseY)
    this.element.textContent = this.generateEye(offset.x, offset.y)
  }

  destroy() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element)
    }
    this.onDestroy?.()
  }
}

interface AsciiEyesProps {
  className?: string
  maxEyes?: number
}

export default function AsciiEyes({ className = '', maxEyes = 15 }: AsciiEyesProps) {
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

  // Initialize eyes at strategic positions (avoiding empty areas)
  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const rect = container.getBoundingClientRect()
    
    // Define tight corner positions with minimal variation
    const strategicPositions = [
      { x: rect.width * (0.05 + Math.random() * 0.05), y: rect.height * (0.08 + Math.random() * 0.05) },    // Top left corner
      { x: rect.width * (0.88 + Math.random() * 0.05), y: rect.height * (0.08 + Math.random() * 0.05) },    // Top right corner
      { x: rect.width * (0.05 + Math.random() * 0.05), y: rect.height * (0.85 + Math.random() * 0.05) },    // Bottom left corner
      { x: rect.width * (0.88 + Math.random() * 0.05), y: rect.height * (0.85 + Math.random() * 0.05) },    // Bottom right corner
    ]

    // Add initial eyes at strategic positions
    strategicPositions.forEach(pos => {
      addEye(pos.x, pos.y)
    })

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      mousePositionRef.current = { x: e.clientX, y: e.clientY }
      updateAllEyes()
    }

    // Add event listener
    document.addEventListener('mousemove', handleMouseMove)

    // Reduced random eye spawning focused tightly on corners
    const spawnInterval = setInterval(() => {
      if (Math.random() < 0.1 && eyesRef.current.length < maxEyes) {
        const rect = container.getBoundingClientRect()
        // Tight corner zones only
        const cornerZones = [
          { x: rect.width * (0.04 + Math.random() * 0.08), y: rect.height * (0.06 + Math.random() * 0.08) },     // Top left corner
          { x: rect.width * (0.86 + Math.random() * 0.08), y: rect.height * (0.06 + Math.random() * 0.08) },     // Top right corner
          { x: rect.width * (0.04 + Math.random() * 0.08), y: rect.height * (0.82 + Math.random() * 0.08) },     // Bottom left corner
          { x: rect.width * (0.86 + Math.random() * 0.08), y: rect.height * (0.82 + Math.random() * 0.08) },     // Bottom right corner
        ]
        const randomZone = cornerZones[Math.floor(Math.random() * cornerZones.length)]
        addEye(randomZone.x, randomZone.y)
      }
    }, 8000) // Less frequent spawning

    // Clean up excess eyes
    const cleanupInterval = setInterval(() => {
      if (eyesRef.current.length > maxEyes) {
        const eyeToRemove = eyesRef.current.shift()
        eyeToRemove?.destroy()
      }
    }, 2000)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      clearInterval(spawnInterval)
      clearInterval(cleanupInterval)
      removeAllEyes()
    }
  }, [addEye, removeAllEyes, updateAllEyes, maxEyes])

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