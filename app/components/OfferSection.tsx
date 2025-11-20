"use client";

import { motion } from "framer-motion";

export default function OfferSection() {
    const packages = [
        {
            name: "Genesis",
            days: "7 days",
            price: "$8,000",
            features: [
                "Brand essence · Visual identity · Core messaging",
                "Two rounds of revisions included.",
                "50% upfront. 50% on day seven."
            ]
        },
        {
            name: "Exodus",
            days: "21 days",
            price: "$22,000",
            features: [
                "Everything in Genesis",
                "+ Full brand book · Content system · AI voice & tone guidelines",
                "+ Initial chatbot prototype · Auto-content templates",
                "Unlimited revisions.",
                "50% upfront. 50% on day twenty one."
            ]
        },
        {
            name: "Revelation",
            days: "90 days",
            price: "$80,000",
            features: [
                "Everything in Exodus",
                "+ Complete AI ecosystem",
                "Custom chatbots · Voice clone · RAG knowledge base",
                "Auto-content engine · 12-month content & growth strategy",
                "Revisions tailored individually.",
                "50% upfront. 50% on day ninety."
            ]
        }
    ];

    return (
        <section className="relative flex w-full flex-col items-center justify-center bg-black px-4 py-32 md:px-8 lg:py-48">
            <div className="container mx-auto max-w-6xl">
                {/* Packages Grid */}
                <div className="grid gap-8 md:grid-cols-3">
                    {packages.map((pkg, index) => (
                        <motion.div
                            key={pkg.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: index * 0.2 }}
                            viewport={{ once: true }}
                            className={`group relative flex flex-col bg-black p-8 transition-all hover:border-white/30 ${pkg.name === "Genesis"
                                ? "border border-white/30"
                                : "border border-white/10"
                                }`}
                        >
                            {/* Package Name */}
                            <h3 className="font-display text-3xl font-bold leading-tight tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 md:text-4xl">
                                {pkg.name}
                            </h3>

                            {/* Days & Price */}
                            <div className="mt-6 space-y-2">
                                <p className="font-mono text-base text-white md:text-lg">{pkg.days}</p>
                                <p className="font-mono text-lg text-white md:text-xl">{pkg.price}</p>
                            </div>

                            {/* Features */}
                            <div className="mt-6 flex-1 space-y-3">
                                {pkg.features.map((feature, i) => (
                                    <p key={i} className="font-mono text-sm leading-relaxed text-white/60 md:text-base">
                                        {feature}
                                    </p>
                                ))}
                            </div>

                            {/* CTA - appears on hover */}
                            <button className="mt-8 w-full rounded-full border border-white/30 bg-transparent py-3 font-mono text-xs uppercase tracking-widest text-white opacity-0 transition-all group-hover:opacity-100 hover:border-white hover:bg-white/10">
                                Begin Day One
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
