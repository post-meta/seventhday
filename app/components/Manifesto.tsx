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
                {/* Impact Header */}
                <motion.h2
                    variants={itemVariants}
                    className="font-display text-4xl font-bold uppercase leading-tight text-white md:text-6xl lg:text-7xl"
                >
                    We did not invent anything new.
                </motion.h2>

                {/* Body Text */}
                <motion.p
                    variants={itemVariants}
                    className="mt-8 max-w-2xl font-sans text-lg leading-relaxed text-gray-300 md:text-xl"
                >
                    We simply removed what was not needed. The usual way: months of
                    talks and revisions. Our way: seven days. Day one — audit. Day
                    seven — launch. That is all.
                </motion.p>

                {/* The Philosophy */}
                <motion.blockquote
                    variants={itemVariants}
                    className="mt-12 border-l-2 border-holy-gold pl-6 font-serif text-2xl italic text-holy-gold md:text-3xl"
                >
                    "We CREATE in seven days. And you will see that it is good."
                </motion.blockquote>
            </motion.div>
        </section>
    );
}
