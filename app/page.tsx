"use client";

import "react";
import SmokeHero from "./components/SmokeHero";
import Manifesto from "./components/Manifesto";
import ProcessSection from "./components/ProcessSection";
import OutputSection from "./components/OutputSection";
import OfferSection from "./components/OfferSection";
import Footer from "./components/Footer";

import AudioPlayer from "./components/AudioPlayer";
import FluidBackground from "./components/FluidBackground";

export default function Home() {
  return (
    <>
      {/* FLUID BACKGROUND (WebGL) */}
      <FluidBackground />

      {/* Audio Player */}
      <AudioPlayer />

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
