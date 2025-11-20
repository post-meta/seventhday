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
            Output
          </motion.h2>
        </div>

      </motion.div>
    </div>
      </div >
    </section >
  );
}
