"use client";

import { motion } from "framer-motion";

export default function OutputSection() {
  return (
    <section className="relative w-full bg-black px-4 py-24 md:px-8 lg:py-32">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-16 text-center md:mb-24">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="font-display text-5xl font-bold leading-tight tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 md:text-7xl lg:text-8xl"
          >
            Case Study
          </motion.h2>
        </div>

        {/* Case Study Data - Text Only */}
        <div className="space-y-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p className="font-sans text-lg text-white md:text-xl">Rebel Coffee</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <p className="font-sans text-base text-white md:text-lg">Monday — chaos in positioning.</p>
            <p className="font-sans text-base text-white md:text-lg">Sunday — new brand.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <p className="font-sans text-base text-white md:text-lg">Before: 12 logo options. None worked.</p>
            <p className="font-sans text-base text-white md:text-lg">After: one. It works.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <p className="font-sans text-base text-white md:text-lg">+187% site traffic in first 30 days.</p>
            <p className="font-sans text-base text-white md:text-lg">Revisions: 1.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            viewport={{ once: true }}
          >
            <p className="font-sans text-base text-white md:text-lg">"And they saw that it was good."</p>
            <p className="font-sans text-sm text-white/70 md:text-base">— Founder, Rebel Coffee</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
