"use client";

import { motion } from "framer-motion";

const deliverables = [
    "Brand Platform & Strategy",
    "Visual Identity System (Logo, Color, Typography)",
    "Web Framework (UX/UI concept)",
    "Content Guidelines & TOV",
];

export default function OfferSection() {
    return (
        <section className="relative flex w-full flex-col items-center justify-center bg-tech-blue px-4 py-24 md:px-8 lg:py-32">
            <div className="container mx-auto max-w-4xl">
                {/* Main Offer Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="relative overflow-hidden border border-white/10 bg-white/5 p-8 backdrop-blur-sm md:p-16"
                >
                    {/* Decorative Corner Accents */}
                    <div className="absolute left-0 top-0 h-16 w-16 border-l-2 border-t-2 border-holy-gold" />
                    <div className="absolute bottom-0 right-0 h-16 w-16 border-b-2 border-r-2 border-holy-gold" />

                    <div className="flex flex-col items-center text-center">
                        {/* Header */}
                        <h2 className="font-display text-4xl font-bold uppercase tracking-wide text-white md:text-6xl">
                            Genesis Package
                        </h2>
                        <p className="mt-4 font-sans text-lg text-gray-300 md:text-xl">
                            Your 7-Day path from complexity to clarity.
                        </p>

                        {/* Pricing & Term */}
                        <div className="mt-12 flex flex-col items-center justify-center gap-4 md:flex-row md:gap-12">
                            <div className="text-center">
                                <p className="font-sans text-sm uppercase tracking-wider text-gray-400">
                                    Investment
                                </p>
                                <p className="font-display text-5xl font-bold text-holy-gold">
                                    $8,000
                                </p>
                            </div>
                            <div className="hidden h-16 w-px bg-white/20 md:block" />
                            <div className="text-center">
                                <p className="font-sans text-sm uppercase tracking-wider text-gray-400">
                                    Timeline
                                </p>
                                <p className="font-display text-5xl font-bold text-white">
                                    7 DAYS
                                </p>
                            </div>
                        </div>

                        {/* Deliverables List */}
                        <ul className="mt-12 flex flex-col gap-4 text-left">
                            {deliverables.map((item, index) => (
                                <li key={index} className="flex items-center gap-3 text-lg text-gray-200">
                                    <span className="flex h-6 w-6 items-center justify-center rounded-full border border-holy-gold text-xs text-holy-gold">
                                        ✓
                                    </span>
                                    {item}
                                </li>
                            ))}
                        </ul>

                        {/* Scarcity Trigger */}
                        <p className="mt-12 max-w-md text-center font-serif text-lg italic text-gray-400">
                            We accept <span className="text-white">only 3 projects per month</span> to maintain quality and focus.
                        </p>

                        {/* CTA Button */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            animate={{
                                boxShadow: [
                                    "0 0 0 0 rgba(255, 215, 0, 0)",
                                    "0 0 0 10px rgba(255, 215, 0, 0.1)",
                                    "0 0 0 20px rgba(255, 215, 0, 0)",
                                ],
                            }}
                            transition={{
                                boxShadow: {
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                },
                            }}
                            className="mt-12 rounded-full bg-holy-gold px-10 py-4 font-sans text-lg font-bold uppercase tracking-wide text-tech-blue transition-colors hover:bg-yellow-400"
                        >
                            [ Book Intro Call ]
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
