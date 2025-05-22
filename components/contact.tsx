"use client"

import type React from "react"

import { useState } from "react"
import { GlitchText } from "@/components/glitch-text"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

export function Contact() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  })

  const [glitchField, setGlitchField] = useState<string | null>(null)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [formError, setFormError] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))

    // Random chance to glitch the field on input
    if (Math.random() > 0.7) {
      setGlitchField(name)
      setTimeout(() => setGlitchField(null), 300)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Simulate form submission with random success/failure
    setGlitchField("form")

    setTimeout(() => {
      setGlitchField(null)
      if (Math.random() > 0.3) {
        setFormSubmitted(true)
      } else {
        setFormError(true)
        setTimeout(() => setFormError(false), 3000)
      }
    }, 1000)
  }

  return (
    <section id="contact" className="py-20 relative">
      <div className="mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          <GlitchText text="CONTACT" isActive={Math.random() > 0.9} />
          <span className="text-red-500">_</span>
        </h2>
        <p className="text-gray-400 max-w-2xl font-mono">
          <GlitchText
            text="Establish a connection to my consciousness. Direct neural interface available upon request."
            isActive={Math.random() > 0.9}
          />
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="border border-white/20 bg-black/50 p-6 relative">
            <h3 className="text-xl font-bold mb-4">
              <GlitchText text="CONNECTION METHODS" isActive={Math.random() > 0.9} />
            </h3>

            <div className="space-y-4 font-mono">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-red-500 animate-pulse" />
                <span>mariopinzonjbb@outlook.com</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-blue-500 animate-pulse" />
                <span>+1 (101) 010-1010</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 animate-pulse" />
                <span>@https://x.com/M4skedTv</span>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/20">
              <h4 className="text-lg font-bold mb-3">
                <GlitchText text="NETWORK STATUS" isActive={Math.random() > 0.9} />
              </h4>

              <div className="space-y-2 font-mono text-sm">
                <div className="flex justify-between">
                  <span>System Uptime</span>
                  <span className="text-green-500">99.8%</span>
                </div>

                <div className="flex justify-between">
                  <span>Response Time</span>
                  <span className="text-yellow-500">24-48h</span>
                </div>

                <div className="flex justify-between">
                  <span>Neural Load</span>
                  <span className="text-red-500">76%</span>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-red-500" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-red-500" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-red-500" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-red-500" />
          </div>
        </div>

        <div className="border border-white/20 bg-black/50 p-6 relative">
          {!formSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h3 className="text-xl font-bold mb-4">
                <GlitchText text="TRANSMIT MESSAGE" isActive={glitchField === "form"} />
              </h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="block font-mono text-sm">
                    <GlitchText text="IDENTIFIER" isActive={glitchField === "name"} />
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formState.name}
                    onChange={handleChange}
                    className={cn(
                      "bg-black/50 border-white/30 font-mono",
                      glitchField === "name" && "border-red-500 text-red-500",
                    )}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="block font-mono text-sm">
                    <GlitchText text="COMMUNICATION CHANNEL" isActive={glitchField === "email"} />
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formState.email}
                    onChange={handleChange}
                    className={cn(
                      "bg-black/50 border-white/30 font-mono",
                      glitchField === "email" && "border-red-500 text-red-500",
                    )}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="block font-mono text-sm">
                    <GlitchText text="MESSAGE CONTENT" isActive={glitchField === "message"} />
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formState.message}
                    onChange={handleChange}
                    className={cn(
                      "bg-black/50 border-white/30 font-mono min-h-[120px]",
                      glitchField === "message" && "border-red-500 text-red-500",
                    )}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className={cn(
                  "w-full py-3 bg-red-900/30 border border-red-500/50 text-red-500 hover:bg-red-900/50 transition-colors relative group overflow-hidden",
                  formError && "bg-red-500 text-white",
                )}
              >
                <span className="relative z-10">
                  <GlitchText
                    text={formError ? "TRANSMISSION ERROR" : "TRANSMIT MESSAGE"}
                    isActive={glitchField === "form" || formError}
                    intensity={formError ? "high" : "medium"}
                  />
                </span>
                <span className="absolute inset-0 bg-glitch-red opacity-0 group-hover:opacity-20 transition-opacity" />
              </button>
            </form>
          ) : (
            <div className="h-full flex flex-col items-center justify-center py-10">
              <div className="text-green-500 text-2xl mb-4">
                <GlitchText text="TRANSMISSION SUCCESSFUL" isActive={Math.random() > 0.8} />
              </div>
              <p className="text-center font-mono mb-6">
                Your message has been received by the neural network. Expect a response within 24-48 hours.
              </p>
              <button
                onClick={() => setFormSubmitted(false)}
                className="py-2 px-6 bg-green-900/30 border border-green-500/50 text-green-500 hover:bg-green-900/50 transition-colors"
              >
                <GlitchText text="SEND ANOTHER MESSAGE" isActive={Math.random() > 0.9} />
              </button>
            </div>
          )}

          {/* Decorative elements */}
          <div className="absolute top-0 left-0 font-mono text-xs text-white/30 px-2">{`SYSTEM.CONTACT`}</div>

          <div className="absolute bottom-0 right-0 font-mono text-xs text-white/30 px-2">{`ENCRYPTION.ENABLED`}</div>
        </div>
      </div>
    </section>
  )
}
