"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Manifesto from "./components/Manifesto";
import ProcessSection from "./components/ProcessSection";
import OutputSection from "./components/OutputSection";
import OfferSection from "./components/OfferSection";

export default function Home() {
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Auto-play audio on mount
    if (audioRef.current) {
      audioRef.current.volume = 0.3; // Set volume to 30%
      audioRef.current.play().catch(error => {
        console.log("Audio autoplay prevented:", error);
      });
    }
  }, []);

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <>
      {/* Background Audio */}
      <audio ref={audioRef} loop>
        <source src="/audio/background.m4a" type="audio/mp4" />
      </audio>

      {/* Mute Button - Top Right */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        onClick={toggleMute}
        className="fixed top-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/40 backdrop-blur-sm transition-all hover:border-holy-gold hover:bg-black/60"
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? (
          <svg className="h-5 w-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
          </svg>
        ) : (
          <svg className="h-5 w-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
        )}
      </motion.button>

      {/* HERO SECTION: X.AI-STYLE LIGHT REVEAL */}
      <div className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-[#050505]">

        {/* 1. PRIMARY LIGHT: Holy Gold Nebula (The Reveal) */}
        {/* Moves from off-screen Right to Center-Left */}
        <motion.div
          initial={{ x: "100%", opacity: 0, scale: 0.8 }}
          animate={{ x: "-20%", opacity: 0.8, scale: 1.1 }}
          transition={{ duration: 4, ease: "easeOut" }}
          className="absolute -top-20 -right-32 h-[90vw] w-[90vw] rounded-full blur-[140px]"
          style={{
            background: "radial-gradient(circle, #FFD700 0%, rgba(255,215,0,0.2) 35%, rgba(10,14,39,0.1) 70%, transparent 100%)"
          }}
        />

        {/* 2. SECONDARY LIGHT: Deep Tech Blue (Balance) */}
        {/* Moves slightly to add depth */}
        <motion.div
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: "-40%", opacity: 0.4 }}
          transition={{ duration: 5, delay: 0.5, ease: "easeOut" }}
          className="absolute top-0 left-0 h-[80vw] w-[80vw] rounded-full blur-[160px] bg-[#0A0E27]"
        />

        {/* 3. TYPOGRAPHY: Stencil Effect */}
        {/* mix-blend-overlay makes the text interact with the light behind it */}
        <div className="relative z-10 text-center mix-blend-overlay">
          <h1 className="font-black text-[14vw] leading-[0.85] tracking-tight text-white/90 select-none">
            SEVENTH<br />DAY
          </h1>
          <p className="mt-8 text-[1.5vw] font-light tracking-[0.2em] text-white/80 uppercase">
            We Create.
          </p>
        </div>

        {/* 4. SCROLL HINT */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3, duration: 1.2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 text-center"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-white/30">
            Scroll ↓
          </p>
        </motion.div>

      </div>

      <div className="relative z-40 -mt-20">
        <Manifesto />
        <ProcessSection />
        <OutputSection />
        <OfferSection />
      </div>
    </>
  );
}
