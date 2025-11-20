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
        <section className="relative flex w-full flex-col bg-black md:flex-row">
            {/* Left Column: Simple Day List */}
            <div className="flex h-screen w-full flex-col justify-center bg-black px-8 md:sticky md:top-0 md:w-[40%] md:pl-16">
                <div className="flex flex-col gap-6">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            animate={{
                                opacity: activeStep === index ? 1 : 0.4,
                            }}
                            transition={{ duration: 0.5 }}
                            className="cursor-pointer font-sans text-base text-white md:text-lg"
                            onClick={() => {
                                document
                                    .getElementById(`day-${index + 1}`)
                                    ?.scrollIntoView({ behavior: "smooth" });
                            }}
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
                        id={`day-${index + 1}`}
                        className="flex min-h-screen items-center justify-start"
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
                        <p className="font-sans text-xl leading-relaxed text-white md:text-2xl lg:text-3xl">
                            {step.text}
                        </p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
