"use client";

import { motion, Variants } from "framer-motion";

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.3,
            delayChildren: 0.2,
        },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 1.2,
            ease: "easeOut" as const,
        },
    },
};

export default function Manifesto() {
    return (
        <section className="relative w-full bg-black px-4 py-24 md:px-8 lg:py-32">
            <div className="container mx-auto max-w-4xl text-center">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-10%" }}
                >
                    {/* Header */}
                    <motion.h2
                        variants={itemVariants}
                        className="font-display text-5xl font-bold leading-tight tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 md:text-7xl lg:text-8xl"
                    >
                        We did not invent anything new.
                    </motion.h2>

                    {/* Body Text */}
                    <motion.p
                        variants={itemVariants}
                        className="mt-8 max-w-2xl mx-auto font-sans text-base leading-relaxed text-white md:text-lg"
                    >
                        We simply removed what was not needed.
                    </motion.p>

                    <motion.p
                        variants={itemVariants}
                        className="mt-6 max-w-2xl mx-auto font-sans text-base leading-relaxed text-white md:text-lg"
                    >
                        The usual way: months of talks and revisions.<br />
                        Our way: seven days.
                    </motion.p>

                    <motion.p
                        variants={itemVariants}
                        className="mt-6 max-w-2xl mx-auto font-sans text-base leading-relaxed text-white md:text-lg"
                    >
                        Day one — audit.<br />
                        Day seven — launch.
                    </motion.p>

                    <motion.p
                        variants={itemVariants}
                        className="mt-6 max-w-2xl mx-auto font-sans text-base leading-relaxed text-white md:text-lg"
                    >
                        That is all.
                    </motion.p>
                </motion.div>
            </div>
        </section>
    );
}
