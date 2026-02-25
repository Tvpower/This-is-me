"use client"

import React, { useState } from 'react';
import { GlitchText } from '@/components/glitch-text';
import { cn } from '@/lib/utils';

const organizations = [
  {
    id: 1,
    name: "Diablo Valley College Deep Learning Society",
    role: "Vice-president · Jun 2023",
    description: "Working closely with the president to lead this student organization dedicated to artificial intelligence and machine learning. Responsible for coordinating technical workshops, managing collaborative projects, and organizing guest speaker events from industry professionals. Helped develop the society's strategic direction and growth initiatives while fostering an inclusive learning environment for members of all skill levels. Actively contributed to various deep learning projects exploring neural networks, computer vision, and natural language processing applications. Cultivated partnerships with local tech companies to create networking and internship opportunities for society members. Collaborated with other officers to promote the organization across campus and increase membership engagement through social media and outreach events."
  },
  {
    id: 2,
    name: "Associated Students of Diablo Valley College (ASDVC)",
    role: "Technology Chair · May 2023",
    description: "Served as Technology Chair Assistant for the Associated Students of Diablo Valley College, providing technical support and digital solutions for student government initiatives and campus-wide events. Collaborated closely with the Technology Chair to manage the organization's digital infrastructure, including website maintenance, social media presence, and virtual event platforms. Assisted in implementing technological improvements to streamline student government operations and enhance communication with the student body. Provided technical expertise during ASDVC meetings and events, troubleshooting issues and ensuring smooth execution of digital presentations and virtual components. Participated in committee discussions regarding technological advancements beneficial to student services and campus life. Helped document and archive digital records of student government activities, creating a more accessible information system for future ASDVC members and the broader campus community."
  },
  {
    id: 3,
    name: "CSUF ACM",
    role: "Member",
    description: "Active member of CSUF's ACM chapter, participating in technical workshops, hackathons, and networking events. Collaborating with peers on computing projects and engaging with the latest developments in computer science through this professional organization."
  },
  {
    id: 4,
    name: "Overwatch World Cup - Team Colombia",
    role: "Player / Top 500 Competitor",
    description: "Represented Colombia in the Overwatch World Cup, competing at a high level and consistently maintaining a Top 500 rank. Had the incredible opportunity to meet and interact with world-class talent when Team Colombia was invited to participate in events held in Anaheim, CA."
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
          <GlitchText text="Pilot in Training & Hobbies" isActive={shouldGlitchRandomly()} />
        </h3>
        <p className="text-lg mb-3 leading-relaxed">
          <GlitchText text="I'm currently training to get my pilot license, embracing the thrill of aviation and aerospace." isActive={shouldGlitchRandomly()} intensity="low" />
        </p>
        <p className="text-lg mb-3 leading-relaxed">
          <GlitchText text="Beyond the cockpit and the code, I was a former Overwatch World Cup player for Team Colombia and consistently ranked in the Top 500." isActive={shouldGlitchRandomly()} intensity="low" />
        </p>
        <p className="text-lg mb-3 leading-relaxed">
          <GlitchText text="Beyond the skies, my interests are quite diverse:" isActive={shouldGlitchRandomly()} intensity="low" />
        </p>
        <ul className="list-disc list-inside pl-4 mb-4 space-y-2 text-md">
          {[
            "My wonderful girlfriend/wife",
            "Exploring the frontiers of Machine Learning",
            "The adrenaline rush of FPV Drones",
            "Designing and interacting with 3D Simulation Environments",
            "Analyzing the dynamics of Financial Markets",
            "Building and programming Robotics",
            "Developing Embedded Systems",
            "Working out at the gym",
            "Immersing myself in video games",
            "Appreciating cinematic scenes full of thrilling stories"
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
      `}</style>
    </section>
  );
}

export default About; 