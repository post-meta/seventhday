"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import Manifesto from "./components/Manifesto";
import ProcessSection from "./components/ProcessSection";
import OutputSection from "./components/OutputSection";
import OfferSection from "./components/OfferSection";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <>
      <main ref={containerRef} className="relative h-screen w-full overflow-hidden bg-tech-blue">
        {/* Parallax Background */}
        <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
          <Image
            src="/img/hero.webp"
            alt="Seventh Day Hero Background"
            fill
            className="object-cover object-center"
            priority
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-tech-blue/70" />
        </motion.div>

        {/* Content with Scroll Fade */}
        <motion.div
          style={{ opacity }}
          className="relative z-20 flex h-full flex-col items-center justify-center text-center px-4"
        >
          <h1 className="font-display text-6xl font-bold uppercase tracking-wider text-white md:text-8xl lg:text-9xl">
            SEVENTH DAY
          </h1>
          <p className="mt-6 font-serif text-2xl italic text-holy-gold md:text-4xl">
            We CREATE.
          </p>
          <p className="mx-auto mt-8 max-w-2xl font-sans text-lg leading-relaxed text-gray-400 md:text-xl">
            In the beginning there was chaos. Day one. We began. Day seven. The
            brand is finished. Six days of work between them. No extra meetings.
            No extra words.
          </p>
          <button className="mt-10 rounded-full border border-holy-gold bg-transparent px-8 py-3 font-sans text-sm font-bold uppercase tracking-widest text-holy-gold transition-colors hover:bg-holy-gold hover:text-tech-blue">
            [ Begin Day One ]
          </button>
        </motion.div>

        {/* Bottom Gradient for Seamless Blend */}
        <div className="absolute bottom-0 left-0 right-0 z-30 h-32 bg-gradient-to-t from-tech-blue to-transparent" />
      </main>

      <div className="relative z-40 -mt-20">
        <Manifesto />
        <ProcessSection />
        <OutputSection />
        <OfferSection />
      </div>
    </>
  );
}
