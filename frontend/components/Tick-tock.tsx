"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

interface Flower {
    id: string
    x: number
    y: number
    name: string
    hours: number
}

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api"

export function TickTock() {
    const [eyePosition, setEyePosition] = useState({ x: "15%", y: "15%" })
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [password, setPassword] = useState("")
    const [flowers, setFlowers] = useState<Flower[]>([])
    const [flowerName, setFlowerName] = useState("")
    const [flowerHours, setFlowerHours] = useState("")
    const landRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const updateEyePosition = () => {
            // Get current time in PST
            const now = new Date()
            const pstTime = new Date(now.toLocaleString("en-US", { timeZone: "America/Los_Angeles" }))
            const hours = pstTime.getHours()

            // Position based on time
            // Position 1: 8am-11:59am (left side)
            if (hours >= 8 && hours < 12) {
                setEyePosition({ x: "15%", y: "15%" })
            }
            // Position 2: 12pm-5:59pm (top center)
            else if (hours >= 12 && hours < 18) {
                setEyePosition({ x: "50%", y: "10%" })
            }
            // Position 3: 6pm-7:59am (right side)
            else {
                setEyePosition({ x: "85%", y: "15%" })
            }
        }

        updateEyePosition()
        const interval = setInterval(updateEyePosition, 60000) // Update every minute

        return () => clearInterval(interval)
    }, [])

    //Load flowers from backend on mount
    useEffect(() => {
        fetchFlowers()
    }, []);

    const fetchFlowers = async () => {
        try {
            const response = await fetch(`${API_URL}/flowers`)
            if (response.ok) {
                const data = await response.json()
                setFlowers(data)
            }
        } catch (error) {
            console.error("Failed to fetch flowers", error)
        }
    }

    const handleEyeClick = () => {
        setIsMenuOpen(true)
    }

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Change this to your desired secret password
        if (password === "secret") {
            setIsAuthenticated(true)
            setPassword("")
        }
    }

    const handleLandClick = async (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isAuthenticated || !flowerName || !flowerHours) return

        const rect = e.currentTarget.getBoundingClientRect()
        const x = ((e.clientX - rect.left ) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100

        const newFlower = {
            id: Date.now().toString(),
            x,
            y,
            name: flowerName,
            hours: parseFloat(flowerHours)
        }

        try {
            const response = await fetch(`${API_URL}/flowers`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(newFlower),
            })

            if (response.ok) {
                await fetchFlowers() //Refresh list from backend
                setFlowerName("")
                setFlowerHours("")
            }
        }catch(error) {
            console.error("Failed to fetch flowers", error)
        }
    }

    const removeFlower = async (id: string) => {
        try {
            const response = await fetch(`${API_URL}/flowers/${id}`, {
                method: "DELETE",
            })
            if (response.ok) {
                await fetchFlowers() // Refresh list
            }
        } catch (error) {
            console.error("Failed to delete flowers", error)
        }
    }

    return (
        <div 
            className="absolute inset-0 w-full h-full overflow-hidden"
            style={{
                background: "linear-gradient(to bottom, #3d5a73 0%, #4a6d8c 30%, #5a7d9c 60%, #6a8dac 100%)"
            }}
        >
            {/* Clouds layer */}
            <Image
                src="/imgs/clouds.png"
                alt="Clouds"
                fill
                priority
                className="object-cover object-top"
                style={{
                    objectPosition: "center top"
                }}
                sizes="100vw"
            />

            {/* Eye sun layer */}
            <div
                className="absolute w-[512px] h-[512px] z-30"
                style={{
                    left: eyePosition.x,
                    top: eyePosition.y,
                    transform: "translate(-50%, -50%)"
                }}
            >
                <Image
                    src="/imgs/eye.gif"
                    alt="Eye Sun"
                    width={512}
                    height={512}
                    priority
                    unoptimized
                    onClick={handleEyeClick}
                    className="cursor-pointer"
                />
            </div>
            
            {/* Land layer - anchored to bottom */}
            <div 
                ref={landRef}
                className="absolute inset-0 z-20 pointer-events-none"
            >
                <div
                    className="absolute inset-0 pointer-events-auto"
                    onClick={handleLandClick}
                    style={{
                        cursor: isAuthenticated && flowerName && flowerHours ? "crosshair" : "default"
                    }}
                >
                    <Image
                        src="/imgs/land.png"
                        alt="Land"
                        fill
                        priority
                        className="object-cover object-bottom pointer-events-none"
                        style={{
                            objectPosition: "center bottom"
                        }}
                        sizes="100vw"
                    />
                </div>

                {/* Flowers layer */}
                {flowers.map((flower) => (
                    <div
                        key={flower.id}
                        className="absolute w-[256px] h-[256px] group pointer-events-auto"
                        style={{
                            left: `${flower.x}%`,
                            top: `${flower.y}%`,
                            transform: "translate(-50%, -50%)"
                        }}
                        onClick={(e) => {
                            e.stopPropagation()
                            if(isAuthenticated) {
                                removeFlower(flower.id)
                            }
                        }}
                    >
                        <Image
                            src="/imgs/flower.gif"
                            alt={flower.name}
                            width={256}
                            height={256}
                            unoptimized
                            className="cursor-pointer"
                        />
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black/80 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            {flower.name} (+{flower.hours}h)
                        </div>
                    </div>
                ))}
            </div>

            {/* Menu Dialog */}
            <Dialog open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Flower Garden</DialogTitle>
                        <DialogDescription>
                            This is a time-tracking garden. Place flowers on the land to visualize your activities and time spent.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        {!isAuthenticated ? (
                            <form onSubmit={handlePasswordSubmit} className="space-y-4">
                                <div>
                                    <Label htmlFor="password">Secret Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter password..."
                                        className="mt-1"
                                    />
                                </div>
                                <Button type="submit" className="w-full">
                                    Unlock
                                </Button>
                            </form>
                        ) : (
                            <div className="space-y-4">
                                <div className="text-sm text-green-600 font-medium">
                                    ✓ Authenticated
                                </div>
                                <div>
                                    <Label htmlFor="flowerName">Activity Name</Label>
                                    <Input
                                        id="flowerName"
                                        value={flowerName}
                                        onChange={(e) => setFlowerName(e.target.value)}
                                        placeholder="e.g., Studying, Coding..."
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="flowerHours">Time (hours)</Label>
                                    <Input
                                        id="flowerHours"
                                        type="number"
                                        step="0.5"
                                        value={flowerHours}
                                        onChange={(e) => setFlowerHours(e.target.value)}
                                        placeholder="e.g., 1, 2.5..."
                                        className="mt-1"
                                    />
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Click on the land area to place a flower. Click a flower to remove it.
                                </p>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}