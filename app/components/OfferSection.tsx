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
                        {/* Pricing Details */}
                        <div className="space-y-4">
                            <p className="font-mono text-lg text-white md:text-xl">7 days</p>
                            <p className="font-mono text-lg text-white md:text-xl">$8,000</p>
                            <p className="font-mono text-base text-white/60 md:text-lg">
                                50% upfront. 50% on day seven.
                            </p>
                            <p className="font-mono text-base text-white/60 md:text-lg">
                                Two rounds of revisions included.
                            </p>
                        </div>

                        {/* CTA */}
                        <button className="mt-8 rounded-full border border-white/30 bg-transparent px-10 py-4 font-mono text-sm uppercase tracking-widest text-white transition-all hover:border-white hover:bg-white/10">
                            Begin Day One
                        </button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
