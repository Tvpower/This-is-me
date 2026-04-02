"use client"

import React, { useState } from 'react';
import { GlitchText } from '@/components/glitch-text';
import { cn } from '@/lib/utils';

const organizations = [
  {
    id: 1,
    name: "Diablo Valley College Deep Learning Society",
    role: "Vice-president · Jun 2023",
    description: "Co-led a student org focused on AI/ML — ran technical workshops, coordinated deep learning projects across computer vision and NLP, organized guest speaker events, and built partnerships with local tech companies for networking and internship opportunities."
  },
  {
    id: 2,
    name: "Associated Students of Diablo Valley College (ASDVC)",
    role: "Technology Chair · May 2023",
    description: "Managed the digital infrastructure for student government — website maintenance, social media, and virtual event platforms. Provided technical support during meetings and events, and helped implement tools to streamline operations and improve communication with the student body."
  },
  {
    id: 3,
    name: "Overwatch World Cup - Team Colombia",
    role: "Player / Top 500 Competitor",
    description: "Represented Colombia in the Overwatch World Cup as a Top 500 competitor. Competed alongside world-class players at events held in Anaheim, CA."
  }
];

export function About() {
  const [hoveredOrg, setHoveredOrg] = useState<number | null>(null);
  const [glitchingOrg, setGlitchingOrg] = useState<number | null>(null);
  const shouldGlitchRandomly = () => Math.random() > 0.9;

  return (
    <section id="about" className="p-8 text-green-400 font-mono">
      <h2 className="text-4xl font-bold mb-8 text-center">
        <GlitchText text="ABOUT ME" isActive={shouldGlitchRandomly()} intensity="medium" />
        <span className="text-red-500 animate-pulse">_</span>
      </h2>

      <div className="bg-black/70 p-6 rounded-lg scanlines-inner mb-12 relative overflow-hidden">
        <h3 className="text-2xl font-semibold mb-4 border-b-2 border-green-500 pb-2">
          <GlitchText text="Life && Hobbies" isActive={shouldGlitchRandomly()} />
        </h3>
        <p className="text-lg mb-3 leading-relaxed">
          <GlitchText text="I am currently working as a Infrastructure engineer for Provista Software Corporation" isActive={shouldGlitchRandomly()} intensity="low" />
        </p>
        <p className="text-lg mb-3 leading-relaxed">
          <GlitchText text="I was a former Overwatch World Cup player for Team Colombia and consistently ranked in the Top 500. I was also training to get Private Pilot License" isActive={shouldGlitchRandomly()} intensity="low" />
        </p>
        <p className="text-lg mb-3 leading-relaxed">
          <GlitchText text="Beyond the skies and my computer, my interests are quite diverse:" isActive={shouldGlitchRandomly()} intensity="low" />
        </p>
        <ul className="list-disc list-inside pl-4 mb-4 space-y-2 text-md">
          {[
            "My wonderful girlfriend/wife",
            "Exploring the frontiers of Machine Learning",
            "Drones",
            "3D Simulation Environments",
            "Monitoring the situation",
            "Programming in holy C",
            "Playing around with embedded",
            "Working out at the gym",
            "Video games (not so often)",
            "Flying planes"
          ].map((hobby, index) => (
            <li key={index} className="hover:text-red-400 transition-colors duration-150">
              <GlitchText text={hobby} isActive={shouldGlitchRandomly()} intensity="low" />
            </li>
          ))}
        </ul>
        <div className="absolute inset-0 pointer-events-none opacity-5">
          <div className="absolute inset-0 bg-red-500/10 mix-blend-screen left-[2px] animate-glitch-1 animation-delay-300" />
          <div className="absolute inset-0 bg-blue-500/10 mix-blend-screen left-[-2px] animate-glitch-2 animation-delay-500" />
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-3xl font-bold mb-6 text-center border-b-2 border-green-700/50 pb-3">
            <GlitchText text="Organizations & Contributions" isActive={shouldGlitchRandomly()} intensity="medium" />
        </h3>
        <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
          {organizations.map((org) => (
            <div
              key={org.id}
              className={cn(
                "group border border-white/20 bg-black/60 relative overflow-hidden transition-all duration-300 p-6 rounded-md",
                "hover:border-red-500/70 hover:shadow-[0_0_20px_rgba(255,0,0,0.4)]",
                hoveredOrg === org.id ? "border-red-500/70 shadow-[0_0_20px_rgba(255,0,0,0.4)]" : "",
                 (Math.random() > 0.85 ? (Math.random() > 0.5 ? "rotate-[0.2deg]" : "-rotate-[0.2deg]") : "")
              )}
              onMouseEnter={() => {
                setHoveredOrg(org.id);
                if (Math.random() > 0.6) {
                  setGlitchingOrg(org.id);
                  setTimeout(() => setGlitchingOrg(null), 300);
                }
              }}
              onMouseLeave={() => {
                setHoveredOrg(null);
              }}
            >
              <h4 className="text-xl font-semibold mb-1 text-green-300 group-hover:text-red-400 transition-colors duration-200">
                <GlitchText text={org.name} isActive={glitchingOrg === org.id || (hoveredOrg === org.id && Math.random() > 0.5)} intensity="low" />
              </h4>
              <p className="text-sm text-green-400/80 mb-3 italic group-hover:text-red-400/80 transition-colors duration-200">
                <GlitchText text={org.role} isActive={glitchingOrg === org.id || (hoveredOrg === org.id && Math.random() > 0.6)} intensity="low" />
              </p>
              <p className="text-sm leading-relaxed text-green-300/70 font-normal">
                <GlitchText text={org.description} isActive={glitchingOrg === org.id && Math.random() > 0.7} intensity="low" />
              </p>

              {(hoveredOrg === org.id || glitchingOrg === org.id) && (
                <div className="absolute inset-0 pointer-events-none opacity-70">
                  <div className={cn("absolute inset-0 bg-red-700/10 mix-blend-screen animate-glitch-1", glitchingOrg === org.id ? "opacity-100" : "opacity-50")} style={{ animationDuration: (glitchingOrg === org.id ? '200ms' : '400ms'), clipPath: `inset(${Math.random()*20}% 0 ${Math.random()*20}% 0)` }} />
                  <div className={cn("absolute inset-0 bg-blue-700/10 mix-blend-screen animate-glitch-2", glitchingOrg === org.id ? "opacity-100" : "opacity-50")} style={{ animationDuration: (glitchingOrg === org.id ? '250ms' : '500ms'), clipPath: `inset(${Math.random()*20}% 0 ${Math.random()*20}% 0)` }} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* NCSA Mosaic Browser Section — powered by system.css */}
      <div className="mb-12">
        <p className="text-center text-green-500/30 text-xs mb-3 tracking-[0.3em] uppercase font-mono">
          <GlitchText text="circa 1993" isActive={shouldGlitchRandomly()} intensity="low" />
        </p>
        <div className="mosaic-wrapper">
          {/* Mac System Menu Bar — system.css ul[role="menu-bar"] */}
          <ul role="menu-bar">
            <li role="menu-item" tabIndex={0} aria-haspopup="false">
              <span className="apple"></span>
            </li>
            <li role="menu-item" tabIndex={0} aria-haspopup="true">
              File
              <ul role="menu">
                <li role="menu-item"><a href="#about">New Window</a></li>
                <li role="menu-item"><a href="#about">Open URL...</a></li>
                <li role="menu-item" className="divider"><a href="#about">Close</a></li>
                <li role="menu-item"><a href="#about">Quit</a></li>
              </ul>
            </li>
            <li role="menu-item" tabIndex={0} aria-haspopup="true">
              Edit
              <ul role="menu">
                <li role="menu-item"><a href="#about">Copy</a></li>
                <li role="menu-item"><a href="#about">Paste</a></li>
              </ul>
            </li>
            <li role="menu-item" tabIndex={0} aria-haspopup="true">
              Options
              <ul role="menu">
                <li role="menu-item"><a href="#about">Preferences</a></li>
              </ul>
            </li>
            <li role="menu-item" tabIndex={0} aria-haspopup="true">
              Navigate
              <ul role="menu">
                <li role="menu-item"><a href="#about">Back</a></li>
                <li role="menu-item"><a href="#about">Forward</a></li>
                <li role="menu-item"><a href="#about">Home</a></li>
              </ul>
            </li>
            <li role="menu-item" tabIndex={0} aria-haspopup="false">Annotate</li>
          </ul>

          {/* Browser Window — system.css .window */}
          <div className="window" style={{ margin: 0, width: '100%' }}>
            <div className="title-bar">
              <button aria-label="Close" className="close"></button>
              <h1 className="title">Mario&apos;s Web Space</h1>
              <button aria-label="Resize" className="resize"></button>
            </div>
            <div className="separator"></div>

            {/* Toolbar — system.css .details-bar + .btn */}
            <div className="details-bar">
              <div style={{ display: 'flex', gap: '4px' }}>
                <button className="btn" title="Back">◄</button>
                <button className="btn" title="Forward">►</button>
                <button className="btn" title="Reload">↺</button>
                <button className="btn" title="Home">⌂</button>
                <button className="btn" title="Open">⊞</button>
                <button className="btn" title="Save">⊡</button>
              </div>
              <select>
                <option>Mario&apos;s Web Space</option>
              </select>
            </div>

            {/* URL Bar — system.css .details-bar + .field-row */}
            <div className="details-bar">
              <section className="field-row" style={{ justifyContent: 'flex-start', width: '100%' }}>
                <label>URL:</label>
                <input type="text" style={{ width: '100%' }} defaultValue="http://mario.dev/" readOnly />
              </section>
            </div>

            {/* Status Line */}
            <div className="details-bar mosaic-status">
              Data transfer complete
            </div>

            {/* Content — system.css .window-pane */}
            <div className="window-pane">
              <h2>Welcome to Mario&apos;s Web Space</h2>
              <p>
                Infrastructure Engineer at Provista Software Corporation.
                Former Overwatch World Cup player for Team Colombia — Top 500 competitor.
                Currently training for a Private Pilot License.
              </p>
              <p>
                This page is best viewed with NCSA Mosaic 3.0 at 1024×768 resolution.
              </p>
              <p><a href="#about">Learn more</a></p>
              <hr />
              <p className="mosaic-visitor">You are visitor #00001337 · Last updated: Jun 2025</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .scanlines-inner {
            position: relative;
        }
        .scanlines-inner::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(rgba(0,0,0,0.2) 50%, transparent 50%);
            background-size: 100% 3px;
            pointer-events: none;
            z-index: 0;
            opacity: 0.4;
            border-radius: inherit;
        }
        .scanlines-inner > * {
            position: relative;
            z-index: 1;
        }
        .animation-delay-200 { animation-delay: 200ms; }
        .animation-delay-300 { animation-delay: 300ms; }
        .animation-delay-500 { animation-delay: 500ms; }
        .animation-delay-600 { animation-delay: 600ms; }

        /* ===== NCSA Mosaic Dark Theme — system.css variable overrides ===== */
        .mosaic-wrapper {
          --primary: #111111;
          --secondary: #22c55e;
          --tertiary: #4ade80;
          --disabled: #22c55e60;
          --box-shadow: 2px 2px rgba(34, 197, 94, 0.2);
          max-width: 48rem;
          margin: 0 auto;
          box-shadow: 0 0 40px rgba(34, 197, 94, 0.08), 0 0 2px rgba(34, 197, 94, 0.2);
        }
        .mosaic-wrapper :global(.window) {
          color: #4ade80;
          min-width: unset;
        }
        .mosaic-wrapper :global(.title-bar .title) {
          text-shadow: 0 0 6px rgba(34, 197, 94, 0.3);
        }
        .mosaic-wrapper :global(.btn) {
          border-image: none !important;
          border: 1px solid #22c55e50;
          border-color: #22c55e50 #22c55e20 #22c55e20 #22c55e50;
          min-width: unset;
          min-height: unset;
          padding: 2px 8px;
          font-size: 12px;
        }
        .mosaic-wrapper :global(.btn:active) {
          border-radius: 0;
          border-color: #22c55e20 #22c55e50 #22c55e50 #22c55e20;
        }
        .mosaic-wrapper :global(select) {
          box-shadow: none;
          width: auto;
          min-width: 150px;
          font-size: 12px;
          padding-left: 8px;
          background-image: none;
        }
        .mosaic-wrapper :global(input) {
          font-size: 12px;
        }
        .mosaic-wrapper :global(input[type="text"]:focus-visible) {
          background: #050505;
          color: #4ade80;
        }
        .mosaic-wrapper :global(.field-row) {
          font-size: 12px;
        }
        .mosaic-wrapper :global(ul[role="menu"]) {
          color: #22c55e;
        }
        .mosaic-wrapper :global(ul[role="menu"] > [role="menu-item"] > a) {
          color: #22c55e;
        }
        .mosaic-wrapper :global(.details-bar) {
          font-size: 12px;
        }
        .mosaic-wrapper :global(.window-pane) {
          color: #4ade80;
          font-size: 14px;
        }
        .mosaic-wrapper :global(.window-pane h2) {
          color: #22c55e;
          text-shadow: 0 0 8px rgba(34, 197, 94, 0.35);
        }
        .mosaic-wrapper :global(.window-pane p) {
          color: #4ade80cc;
          margin-bottom: 8px;
        }
        .mosaic-wrapper :global(.window-pane a) {
          color: #ef4444;
        }
        .mosaic-wrapper :global(.window-pane a:hover) {
          color: #f87171;
        }
        .mosaic-wrapper :global(.window-pane hr) {
          border-color: #22c55e20;
          margin: 16px 0;
        }
        .mosaic-wrapper :global(.apple) {
          filter: invert(48%) sepia(79%) saturate(390%) hue-rotate(86deg) brightness(118%) contrast(85%);
        }
        .mosaic-status {
          font-size: 10px !important;
          color: #4ade80aa !important;
        }
        .mosaic-visitor {
          font-size: 10px;
          color: #4ade8060;
        }
      `}</style>
    </section>
  );
}

export default About;
