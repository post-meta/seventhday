"use client";

import { motion } from "framer-motion";

export default function OfferSection() {
    return (
        <section className="relative flex w-full flex-col items-center justify-center bg-black px-4 py-24 md:px-8 lg:py-32">
            <div className="container mx-auto max-w-2xl">
                {/* Main Offer Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="relative overflow-hidden bg-black p-8 md:p-16"
                >
                    <div className="flex flex-col items-center text-center space-y-8">
                        {/* Header */}
                        <h2 className="font-display text-5xl font-bold leading-tight tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 md:text-7xl">
                            Genesis
                        </h2>

                        {/* Timeline */}
                        <p className="font-sans text-lg text-white md:text-xl">
                            7 days
                        </p>

                        {/* Price */}
                        <p className="font-sans text-lg text-white md:text-xl">
                            $8,000
                        </p>

                        {/* Payment Terms */}
                        <p className="font-sans text-base text-white md:text-lg">
                            50% upfront. 50% on day seven.
                        </p>

                        {/* Revisions */}
                        <p className="font-sans text-base text-white md:text-lg">
                            Two rounds of revisions included.
                        </p>

                        {/* CTA Button */}
                        <button className="mt-4 rounded-full border border-white bg-transparent px-8 py-3 font-sans text-sm uppercase tracking-wider text-white transition-colors hover:bg-white hover:text-tech-blue">
                            Begin Day One
                        </button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
