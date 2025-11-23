"use client";
import { motion } from "framer-motion";

export const HeroTitle = () => {
    return (
        <div className="relative flex flex-col items-center justify-center z-10">

            {/* SEVENTH - Blueprint Reveal Animation */}
            <motion.h1
                className="text-[12vw] leading-[0.8] font-bold tracking-tighter text-center uppercase font-sans select-none"
                initial={{
                    // Initial state: Transparent text, Thin outline, Blurred (Grok style)
                    color: "rgba(255, 255, 255, 0)",
                    // @ts-ignore
                    WebkitTextStroke: "1px rgba(255, 255, 255, 0.4)",
                    opacity: 0,
                    filter: "blur(10px)",
                }}
                animate={{
                    // Final state: Silver/White text, No outline, Focused
                    color: "#e5e7eb", // text-gray-200 (Silver)
                    // @ts-ignore
                    WebkitTextStroke: "0px rgba(255, 255, 255, 0)",
                    opacity: 1,
                    filter: "blur(0px)",
                }}
                transition={{
                    duration: 2.5,
                    ease: "easeInOut",
                    delay: 0.2,
                }}
            >
                SEVENTH
            </motion.h1>

            {/* DAY - Blueprint Reveal Animation (Delayed) */}
            <motion.h1
                className="text-[12vw] leading-[0.8] font-bold tracking-tighter text-center uppercase font-sans select-none"
                initial={{
                    color: "rgba(255, 255, 255, 0)",
                    // @ts-ignore
                    WebkitTextStroke: "1px rgba(255, 255, 255, 0.4)",
                    opacity: 0,
                    filter: "blur(10px)",
                }}
                animate={{
                    color: "#e5e7eb",
                    // @ts-ignore
                    WebkitTextStroke: "0px rgba(255, 255, 255, 0)",
                    opacity: 1,
                    filter: "blur(0px)",
                }}
                transition={{
                    duration: 2.5,
                    ease: "easeInOut",
                    delay: 0.6, // Rhythm: One-Two
                }}
            >
                DAY
            </motion.h1>

            {/* Slogan "We CREATE" */}
            <motion.p
                className="mt-8 font-mono text-sm text-gray-400 tracking-[0.2em]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.5, duration: 1 }}
            >
                We CREATE.
            </motion.p>
        </div>
    );
};
