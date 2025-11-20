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
      <main ref={containerRef} className="relative min-h-screen w-full overflow-hidden" style={{
        background: 'radial-gradient(circle at center, #1A1F38 0%, #0A0E27 70%)'
      }}>
        {/* Content */}
        <motion.div
          style={{ opacity }}
          className="relative z-20 flex min-h-screen flex-col items-center justify-center text-center px-4 py-24"
        >
          <h1 className="font-sans text-5xl font-normal text-white md:text-7xl lg:text-8xl">
            SEVENTH DAY
          </h1>
          <p className="mt-6 font-sans text-xl text-white md:text-2xl">
            We CREATE brands in seven days.
          </p>

          <div className="mt-16 max-w-2xl space-y-8">
            <p className="font-sans text-base leading-relaxed text-white md:text-lg">
              In the beginning there was chaos.<br />
              Day one. We began.<br />
              Day seven. The brand is finished.
            </p>

            <p className="font-sans text-base leading-relaxed text-white md:text-lg">
              Six days of work between them.<br />
              No extra meetings. No extra words.
            </p>

            <p className="font-sans text-base leading-relaxed text-white md:text-lg">
              Ready to start Monday?
            </p>
          </div>

          <button className="mt-12 rounded-full border border-white bg-transparent px-8 py-3 font-sans text-sm uppercase tracking-wider text-white transition-colors hover:bg-white hover:text-tech-blue">
            Begin Day One
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
