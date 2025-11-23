"use client";

import "react";
import SmokeHero from "./components/SmokeHero";
import Manifesto from "./components/Manifesto";
import ProcessSection from "./components/ProcessSection";
import OutputSection from "./components/OutputSection";
import OfferSection from "./components/OfferSection";
import Footer from "./components/Footer";

import AudioPlayer from "./components/AudioPlayer";
import CosmicFluidEngine from "./components/CosmicFluidEngine";

export default function Home() {
  return (
    <>
      {/* GENESIS FLUID ENGINE (Background) */}
      <CosmicFluidEngine />

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
