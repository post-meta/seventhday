"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import clsx from "clsx";

const steps = [
    {
        day: "Day 1",
        title: "There was chaos.",
        description: "We came.",
    },
    {
        day: "Day 2",
        title: "We separated signal",
        description: "from noise.",
    },
    {
        day: "Day 3",
        title: "We built the foundation.",
        description: "",
    },
    {
        day: "Day 4",
        title: "We gave it form.",
        description: "",
    },
    {
        day: "Day 5",
        title: "We gave it voice.",
        description: "",
    },
    {
        day: "Day 6",
        title: "We tuned it",
        description: "to your audience.",
    },
    {
        day: "Day 7",
        title: "It is finished.",
        description: "Rest.",
    },
];

function StepBlock({
    step,
    index,
    setActiveStep,
}: {
    step: (typeof steps)[0];
    index: number;
    setActiveStep: (index: number) => void;
}) {
    const ref = useRef(null);
    const isInView = useInView(ref, { margin: "-50% 0px -50% 0px" });

    useEffect(() => {
        if (isInView) {
            setActiveStep(index);
        }
    }, [isInView, index, setActiveStep]);

    return (
        <div
            ref={ref}
            id={`day-${index + 1}`}
            className="flex min-h-screen flex-col justify-center px-8 py-24 md:px-16"
        >
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                viewport={{ once: true, margin: "-20%" }}
            >
                <span className="font-sans text-sm text-white/70 md:text-base">
                    {step.day}
                </span>
                <h3 className="mt-2 font-sans text-lg font-normal text-white md:text-xl">
                    {step.title}
                </h3>
                {step.description && (
                    <p className="mt-1 font-sans text-lg font-normal text-white md:text-xl">
                        {step.description}
                    </p>
                )}
            </motion.div>
        </div>
    );
}

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

            {/* Right Column: Scrollable Steps */}
            <div className="w-full md:w-[60%]">
                {steps.map((step, index) => (
                    <StepBlock
                        key={index}
                        step={step}
                        index={index}
                        setActiveStep={setActiveStep}
                    />
                ))}
            </div>
        </section>
    );
}
