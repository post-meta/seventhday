"use client";

import { useState, useEffect, useRef } from "react";
import SmokeHero from "./components/SmokeHero";
import Manifesto from "./components/Manifesto";
import ProcessSection from "./components/ProcessSection";
import OutputSection from "./components/OutputSection";
import OfferSection from "./components/OfferSection";
import Footer from "./components/Footer";

export default function Home() {
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Set initial volume
    audio.volume = 0.3;

    // Try to play immediately
    const playPromise = audio.play();

    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Auto-play was prevented.
        // Add a one-time click listener to start audio
        const startAudio = () => {
          audio.play();
          document.removeEventListener("click", startAudio);
          document.removeEventListener("touchstart", startAudio);
          document.removeEventListener("keydown", startAudio);
        };

        document.addEventListener("click", startAudio);
        document.addEventListener("touchstart", startAudio);
        document.addEventListener("keydown", startAudio);
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
        <source src="/audio/background.mp3" type="audio/mpeg" />
      </audio>

      {/* Mute Button - Top Right */}
      <button
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
      </button>

      {/* SMOKE HERO SECTION */}
      <SmokeHero />

      {/* Other Sections */}
      <div className="relative z-40">
        <Manifesto />
        <ProcessSection />
        <OutputSection />
        <OfferSection />
        <Footer />
      </div>
    </>
  );
}
