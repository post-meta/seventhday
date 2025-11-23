"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function SmokeHero() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Логика Canvas анимации (Дым/Туман)
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Particle[] = [];

        // Настройка размеров
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener("resize", resize);
        resize();

        // Конфигурация частиц - адаптивная для мобильных
        const isMobile = window.innerWidth < 768;
        const particleCount = isMobile ? 25 : 60; // Меньше частиц на мобильных

        class Particle {
            x: number;
            y: number;
            vx: number;
            radius: number;
            color: string;
            opacity: number;

            constructor() {
                const isMobile = window.innerWidth < 768;
                this.x = Math.random() * canvas!.width + canvas!.width * 0.5; // Спавн справа
                this.y = Math.random() * canvas!.height;
                this.vx = -0.2 - Math.random() * 0.5; // Движение влево (медленно)
                // Меньшие радиусы для мобильных устройств
                this.radius = isMobile
                    ? 80 + Math.random() * 150
                    : 100 + Math.random() * 300;

                // Pure monochrome: White and light gray only (Quiet Luxury)
                const colors = [
                    "255, 255, 255", // Pure White
                    "240, 240, 240", // Light Gray
                    "220, 220, 220", // Soft Gray
                ];
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.opacity = Math.random() * 0.08; // Very subtle (5-8%)
            }

            update() {
                this.x += this.vx;
                // Если ушло влево за экран, возвращаем направо
                if (this.x + this.radius < 0) {
                    this.x = canvas!.width + this.radius;
                }
            }

            draw(ctx: CanvasRenderingContext2D) {
                ctx.beginPath();
                // Создаем градиент для мягкости
                const gradient = ctx.createRadialGradient(
                    this.x, this.y, 0,
                    this.x, this.y, this.radius
                );
                gradient.addColorStop(0, `rgba(${this.color}, ${this.opacity})`);
                gradient.addColorStop(1, `rgba(${this.color}, 0)`);

                ctx.fillStyle = gradient;
                ctx.globalCompositeOperation = "screen"; // Тот самый эффект из логов!
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Инициализация
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        // Анимационный цикл
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Темный фон, чтобы compositeOperation работал красиво
            ctx.fillStyle = "#000000";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            particles.forEach((p) => {
                p.update();
                p.draw(ctx);
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="relative h-screen w-full overflow-visible bg-black font-sans selection:bg-white/20">

            {/* 1. CANVAS LAYER (The Mist) */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 z-0 blur-[100px] opacity-60 md:blur-[120px]" // Extreme blur for Silver Mist
            />


            {/* 3. HERO CONTENT (Center) */}
            <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-4">
                {/* Typography */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="flex flex-col items-center"
                >
                    <h1 className="text-center font-display text-[15vw] font-bold leading-[0.8] tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 select-none">
                        Seventh
                    </h1>
                    <h1 className="text-center font-display text-[15vw] font-bold leading-[0.8] tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white/80 to-white/10 select-none">
                        Day
                    </h1>
                </motion.div>

                {/* Typewriter Text */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 1.2 }}
                    className="mt-12 flex flex-col items-center space-y-6 text-center"
                >
                    <p className="font-mono text-base tracking-wide text-white/80 md:text-lg">
                        We CREATE.
                    </p>

                    <div className="space-y-2">
                        <p className="font-mono text-base tracking-wide text-white/60 md:text-lg">
                            Day one. We begin.
                        </p>
                        <p className="font-mono text-base tracking-wide text-white/60 md:text-lg">
                            Day seven. It is finished.
                        </p>
                    </div>

                    {/* CTA Button */}
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.8 }}
                        className="mt-8 rounded-full border border-white/30 bg-transparent px-10 py-4 font-mono text-sm uppercase tracking-widest text-white transition-all hover:border-white hover:bg-white/10 md:px-8 md:py-3 md:text-xs"
                    >
                        [ Begin Day One ]
                    </motion.button>
                </motion.div>
            </div>

            {/* Bottom Gradient for Smooth Transition */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none z-20" />

        </div>
    );
}
