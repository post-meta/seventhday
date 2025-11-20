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
        <section className="relative flex min-h-screen w-full items-center justify-center bg-tech-blue px-4 py-24">
            <motion.div
                className="container mx-auto flex max-w-4xl flex-col items-center text-center"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-10%" }}
            >
                {/* Header */}
                <motion.h2
                    variants={itemVariants}
                    className="font-sans text-3xl font-normal text-white md:text-5xl lg:text-6xl"
                >
                    We did not invent anything new.
                </motion.h2>

                {/* Body Text */}
                <motion.p
                    variants={itemVariants}
                    className="mt-8 max-w-2xl font-sans text-base leading-relaxed text-white md:text-lg"
                >
                    We simply removed what was not needed.
                </motion.p>

                <motion.p
                    variants={itemVariants}
                    className="mt-6 max-w-2xl font-sans text-base leading-relaxed text-white md:text-lg"
                >
                    The usual way: months of talks and revisions.<br />
                    Our way: seven days.
                </motion.p>

                <motion.p
                    variants={itemVariants}
                    className="mt-6 max-w-2xl font-sans text-base leading-relaxed text-white md:text-lg"
                >
                    Day one — audit.<br />
                    Day seven — launch.
                </motion.p>

                <motion.p
                    variants={itemVariants}
                    className="mt-6 max-w-2xl font-sans text-base leading-relaxed text-white md:text-lg"
                >
                    That is all.
                </motion.p>
            </motion.div>
        </section>
    );
}
