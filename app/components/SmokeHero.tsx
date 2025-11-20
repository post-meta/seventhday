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

        // Конфигурация частиц
        const particleCount = 60; // Количество облаков

        class Particle {
            x: number;
            y: number;
            vx: number;
            radius: number;
            color: string;
            opacity: number;

            constructor() {
                this.x = Math.random() * canvas!.width + canvas!.width * 0.5; // Спавн справа
                this.y = Math.random() * canvas!.height;
                this.vx = -0.2 - Math.random() * 0.5; // Движение влево (медленно)
                this.radius = 100 + Math.random() * 300; // Огромные радиусы для эффекта тумана

                // Цвета: Смесь золота, белого и синего (X.AI palette + Seventh Day Gold)
                const colors = [
                    "255, 215, 0",  // Holy Gold
                    "255, 255, 255", // White
                    "100, 149, 237", // Cornflower Blue (Grok vibe)
                ];
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.opacity = Math.random() * 0.15; // Очень прозрачные
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
        <div className="relative h-screen w-full overflow-hidden bg-black font-sans selection:bg-white/20">

            {/* 1. CANVAS LAYER (The Mist) */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 z-0 blur-3xl opacity-80" // Дополнительный блюр CSS для мягкости
            />


            {/* 3. HERO CONTENT (Center) */}
            <div className="relative z-10 flex h-full w-full flex-col items-center justify-center">
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
            </div>

            {/* 4. BOTTOM INTERACTION (Input Field) */}
            <div className="absolute bottom-12 left-0 right-0 z-50 flex flex-col items-center px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.2, duration: 0.8 }}
                    className="relative w-full max-w-2xl"
                >
                    <input
                        type="text"
                        placeholder="What do you want to know?"
                        className="w-full rounded-2xl border border-white/10 bg-black/50 px-6 py-5 text-lg text-white placeholder-white/30 backdrop-blur-md focus:border-white/30 focus:outline-none focus:ring-0 transition-all"
                    />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-all">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 19V5M5 12l7-7 7 7" />
                        </svg>
                    </button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="mt-8 text-center text-xs text-gray-500"
                >
                    <p>Seventh Day goes Global: Announcing Our Landmark Partnership with Creative Minds and AI.</p>
                    <button className="mt-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[10px] uppercase tracking-wider hover:bg-white/10 transition-colors text-white">
                        Read Announcement →
                    </button>
                </motion.div>
            </div>

        </div>
    );
}
