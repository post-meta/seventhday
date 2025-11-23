"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { HeroTitle } from "./HeroTitle";

export default function SmokeHero() {
    return (
        <div className="relative h-screen w-full overflow-visible bg-transparent font-sans selection:bg-white/20">
            {/* Hero Content is now overlaid on the global CosmicFluidEngine */}


            {/* 3. HERO CONTENT (Center) */}
            <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-4">
                {/* Blueprint Reveal Title */}
                <HeroTitle />

                {/* CTA Button - Appears after title animation */}
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 3.5, duration: 1 }} // Delayed to appear after "We CREATE"
                    className="mt-12 rounded-full border border-white/30 bg-transparent px-10 py-4 font-mono text-sm uppercase tracking-widest text-white transition-all hover:border-white hover:bg-white/10 md:px-8 md:py-3 md:text-xs"
                >
                    [ Begin Day One ]
                </motion.button>
            </div>

            {/* Bottom Gradient for Smooth Transition */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none z-20" />

        </div>
    );
}
