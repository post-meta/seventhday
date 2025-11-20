"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import clsx from "clsx";

const steps = [
    { id: 1, day: "Day 1", text: "We begin." },
    { id: 2, day: "Day 2", text: "We listen." },
    { id: 3, day: "Day 3", text: "We build the foundation." },
    { id: 4, day: "Day 4", text: "We give it form." },
    { id: 5, day: "Day 5", text: "We give it voice." },
    { id: 6, day: "Day 6", text: "We tune it to your audience." },
    { id: 7, day: "Day 7", text: "It is finished." },
    { id: 8, day: "", text: "Rest." },
];

export default function ProcessSection() {
    const [activeStep, setActiveStep] = useState(0);

    return (
        <section className="relative flex w-full bg-black px-4 py-16 md:flex-row md:px-8 lg:py-24">
            {/* Left Column: Day Numbers (Desktop Only) */}
            <div className="sticky top-24 hidden h-screen w-[20%] md:block">
                <div className="flex h-full flex-col justify-center space-y-8">
                    {steps.map((step, index) => (
                        <motion.div
                            key={step.id}
                            initial={{ opacity: 0.3 }}
                            animate={{
                                opacity: activeStep === index ? 1 : 0.3,
                                scale: activeStep === index ? 1.1 : 1,
                            }}
                            transition={{ duration: 0.3 }}
                            className="font-display text-2xl font-bold leading-tight tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40"
                        >
                            {step.day}
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Right Column: Step Descriptions */}
            <div className="relative w-full md:w-[60%] md:pl-16">
                {steps.map((step, index) => (
                    <motion.div
                        key={step.id}
                        className="flex min-h-screen flex-col items-start justify-center"
                        initial={{ opacity: 0 }}
                        whileInView={{
                            opacity: 1,
                            filter: "blur(0px)"
                        }}
                        viewport={{
                            once: false,
                            amount: 0.5,
                            margin: "-20% 0px -20% 0px"
                        }}
                        transition={{
                            duration: 0.8,
                            ease: "easeOut"
                        }}
                        style={{
                            filter: "blur(8px)",
                            opacity: 0
                        }}
                        onViewportEnter={() => setActiveStep(index)}
                    >
                        {/* Day number - Mobile Only */}
                        {step.day && (
                            <p className="mb-4 font-display text-xl font-bold text-white/40 md:hidden">
                                {step.day}
                            </p>
                        )}

                        <p className="font-mono text-xl leading-relaxed text-white md:text-2xl lg:text-3xl">
                            {step.text}
                        </p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
