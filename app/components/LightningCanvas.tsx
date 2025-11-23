'use client';

import { useEffect, useRef } from 'react';

export default function LightningCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d')!;
        const particles: any[] = [];
        const mouse = { x: 0, y: 0, moving: false };
        let lastMouse = { x: 0, y: 0 };

        // Handle resize
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resize);
        resize();

        // Класс для молний
        class Lightning {
            points: { x: number, y: number }[] = [];
            life = 1;

            constructor(x1: number, y1: number, x2: number, y2: number) {
                const steps = 20;
                for (let i = 0; i <= steps; i++) {
                    const t = i / steps;
                    this.points.push({
                        x: x1 + (x2 - x1) * t + (Math.random() - 0.5) * 30,
                        y: y1 + (y2 - y1) * t + (Math.random() - 0.5) * 30
                    });
                }
            }

            draw(ctx: CanvasRenderingContext2D) {
                ctx.save();
                ctx.strokeStyle = `rgba(255, 255, 255, ${this.life})`;
                ctx.lineWidth = this.life * 2;
                ctx.shadowBlur = 20;
                ctx.shadowColor = 'white';
                ctx.beginPath();
                this.points.forEach((p, i) => {
                    if (i === 0) ctx.moveTo(p.x, p.y);
                    else ctx.lineTo(p.x, p.y);
                });
                ctx.stroke();
                ctx.restore();

                this.life *= 0.9;
            }
        }

        const handleMouseMove = (e: MouseEvent) => {
            lastMouse = { x: mouse.x, y: mouse.y };
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            mouse.moving = true;

            // Создаем молнию при быстром движении
            const dist = Math.hypot(mouse.x - lastMouse.x, mouse.y - lastMouse.y);
            if (dist > 50) {
                particles.push(new Lightning(lastMouse.x, lastMouse.y, mouse.x, mouse.y));
            }
        };

        window.addEventListener('mousemove', handleMouseMove);

        const animate = () => {
            // Затухание вместо полной очистки
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Рисуем и обновляем молнии
            for (let i = particles.length - 1; i >= 0; i--) {
                particles[i].draw(ctx);
                if (particles[i].life < 0.01) {
                    particles.splice(i, 1);
                }
            }

            // Мерцающие звезды в дымке
            if (Math.random() > 0.98) {
                ctx.save();
                const x = Math.random() * canvas.width;
                const y = Math.random() * canvas.height;
                const size = Math.random() * 2;

                ctx.fillStyle = 'white';
                ctx.shadowBlur = 10;
                ctx.shadowColor = 'white';
                ctx.beginPath();
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }

            requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none"
            style={{ zIndex: -1 }}
        />
    );
}
