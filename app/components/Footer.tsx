"use client";

import { motion } from "framer-motion";

export default function Footer() {
    const contacts = [
        { name: "Email", href: "mailto:hello@seventhday.com", label: "hello@seventhday.com" },
        { name: "LinkedIn", href: "https://linkedin.com/company/seventhday", label: "LinkedIn" },
        { name: "X", href: "https://x.com/seventhday", label: "X.com" },
        { name: "Telegram", href: "https://t.me/seventhday", label: "Telegram" },
        { name: "GitHub", href: "https://github.com/post-meta/seventhday", label: "GitHub" },
    ];

    return (
        <footer className="relative w-full border-t border-white/10 bg-black px-4 py-16 md:px-8 lg:py-24">
            <div className="container mx-auto max-w-6xl">
                <div className="flex flex-col items-center justify-between gap-12 md:flex-row md:items-start">
                    {/* Left: Brand */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center md:text-left"
                    >
                        <h3 className="font-display text-4xl font-bold leading-tight tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 md:text-5xl">
                            SEVENTH DAY
                        </h3>
                        <p className="mt-4 font-mono text-sm text-white/60">
                            We CREATE.
                        </p>
                    </motion.div>

                    {/* Right: Contacts */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="flex flex-col gap-3 text-center md:text-right"
                    >
                        {contacts.map((contact) => (
                            <a
                                key={contact.name}
                                href={contact.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-mono text-sm text-white/60 transition-colors hover:text-white"
                            >
                                {contact.label}
                            </a>
                        ))}
                    </motion.div>
                </div>

                {/* Bottom: Copyright */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="mt-16 border-t border-white/10 pt-8 text-center"
                >
                    <p className="font-mono text-xs text-white/40">
                        © {new Date().getFullYear()} Seventh Day. All rights reserved.
                    </p>
                </motion.div>
            </div>
        </footer>
    );
}
