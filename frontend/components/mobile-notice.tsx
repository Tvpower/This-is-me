"use client"

import { useState, useEffect } from "react"

export function MobileNotice() {
    const [show, setShow] = useState(false)
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
        ) || window.innerWidth <= 768

        if (isMobile) setShow(true)
    }, [])

    if (!show) return null

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText("https://this-is-me.dev/")
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch {
            const textarea = document.createElement("textarea")
            textarea.value = "https://this-is-me.dev/"
            document.body.appendChild(textarea)
            textarea.select()
            document.execCommand("copy")
            document.body.removeChild(textarea)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm">
            <div
                className="relative mx-4 w-full max-w-md border-2 border-red-500/60 bg-black p-6 shadow-[0_0_30px_rgba(255,0,0,0.3),inset_0_0_20px_rgba(0,0,0,0.5)]"
                style={{ fontFamily: "'Sys', monospace" }}
            >
                {/* Scanline overlay on the modal */}
                <div
                    className="pointer-events-none absolute inset-0 z-10"
                    style={{
                        background:
                            "linear-gradient(rgba(18,16,16,0) 50%, rgba(0,0,0,0.25) 50%)",
                        backgroundSize: "100% 3px",
                    }}
                />

                <h2
                    className="glitch-text mb-4 text-center text-2xl font-bold uppercase tracking-wider text-red-500"
                    data-text="You are on mobile"
                    style={{
                        textShadow: "0 0 10px rgba(255,0,0,0.7), 0 0 20px rgba(255,0,0,0.4)",
                    }}
                >
                    You are on mobile
                </h2>

                <p
                    className="mb-6 text-center text-sm leading-relaxed text-gray-300"
                    style={{
                        textShadow: "1px 1px 0 rgba(0,0,0,0.9)",
                        filter: "blur(0.3px)",
                    }}
                >
                    You might have opened my site on mobile and that&apos;s ok!
                    <br />
                    But I didn&apos;t do my portfolio with the intention of having mobile
                    responsiveness. I believe it ruins my aesthetic.
                </p>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => setShow(false)}
                        className="w-full border-2 border-green-500/50 bg-green-900/30 px-4 py-3 text-sm uppercase tracking-wider text-green-400 transition-all hover:border-green-400 hover:bg-green-900/50 hover:shadow-[0_0_15px_rgba(0,255,0,0.3)]"
                        style={{ fontFamily: "'Sys', monospace" }}
                    >
                        Ok, still continue
                    </button>

                    <button
                        onClick={handleCopyLink}
                        className="w-full border-2 border-cyan-500/50 bg-cyan-900/30 px-4 py-3 text-sm uppercase tracking-wider text-cyan-400 transition-all hover:border-cyan-400 hover:bg-cyan-900/50 hover:shadow-[0_0_15px_rgba(0,255,255,0.3)]"
                        style={{ fontFamily: "'Sys', monospace" }}
                    >
                        {copied
                            ? "Link copied!"
                            : "I'll open it from my computer"}
                    </button>
                </div>
            </div>
        </div>
    )
}
