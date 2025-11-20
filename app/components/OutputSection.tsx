"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function OutputSection() {
    return (
        <section className="relative w-full bg-tech-blue px-4 py-24 md:px-8 lg:py-32">
            <div className="container mx-auto">
                {/* Header */}
                <div className="mb-16 text-center md:mb-24">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="font-display text-4xl font-bold uppercase leading-tight text-white md:text-6xl lg:text-7xl"
                    >
                        The Revelation: <br />
                        <span className="text-gray-400">Beyond the Logo.</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="mt-6 text-lg text-gray-300 md:text-xl"
                    >
                        We deliver a unified brand ecosystem, not just artifacts.
                    </motion.p>
                </div>

                {/* Ecosystem Grid */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                    {/* Visual 1 (Large/Hero) - Spans 2 cols on large screens */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="relative aspect-video w-full overflow-hidden rounded-lg bg-gray-900 md:col-span-2 lg:col-span-2 lg:row-span-2"
                    >
                        <Image
                            src="/img/brand_box.png"
                            alt="Premium Brand Box"
                            fill
                            className="object-cover transition-transform duration-700 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-tech-blue/80 to-transparent" />
                        <div className="absolute bottom-6 left-6">
                            <h3 className="font-display text-2xl font-bold text-white">Physical Touchpoints</h3>
                        </div>
                    </motion.div>

                    {/* Visual 2 (Medium) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-900"
                    >
                        <Image
                            src="/img/smartphone.png"
                            alt="Digital Experience"
                            fill
                            className="object-cover transition-transform duration-700 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-tech-blue/80 to-transparent" />
                        <div className="absolute bottom-6 left-6">
                            <h3 className="font-display text-xl font-bold text-white">Digital Experience</h3>
                        </div>
                    </motion.div>

                    {/* Visual 3 (Medium) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        viewport={{ once: true }}
                        className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-900"
                    >
                        <Image
                            src="/img/neon_sign.png"
                            alt="Brand Presence"
                            fill
                            className="object-cover transition-transform duration-700 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-tech-blue/80 to-transparent" />
                        <div className="absolute bottom-6 left-6">
                            <h3 className="font-display text-xl font-bold text-white">Brand Presence</h3>
                        </div>
                    </motion.div>
                </div>

                {/* Case Study Data */}
                <div className="mt-16 grid grid-cols-1 gap-8 border-t border-white/10 pt-16 md:grid-cols-3">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h4 className="font-sans text-sm uppercase tracking-wider text-gray-400">Case Study</h4>
                        <p className="mt-2 font-display text-2xl font-bold text-white">Rebel Coffee</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        <h4 className="font-sans text-sm uppercase tracking-wider text-gray-400">Results</h4>
                        <p className="mt-2 font-display text-4xl font-bold text-holy-gold">+187%</p>
                        <p className="text-sm text-gray-300">Site traffic in 30 days</p>
                        <p className="mt-4 font-display text-4xl font-bold text-white">1</p>
                        <p className="text-sm text-gray-300">Revision round</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        viewport={{ once: true }}
                        className="flex items-center"
                    >
                        <blockquote className="border-l-2 border-holy-gold pl-6 font-serif text-xl italic text-white">
                            "And they saw that it was good."
                            <footer className="mt-2 font-sans text-sm not-italic text-gray-400">— Founder, Rebel Coffee</footer>
                        </blockquote>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
