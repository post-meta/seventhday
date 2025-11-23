'use client';

import { useEffect, useRef } from 'react';
import useWebglFluidEnhanced from 'webgl-fluid-enhanced';

export default function FluidBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        let fluid: any = null;

        if (canvasRef.current) {
            // Import dynamically to avoid SSR issues if necessary, though the hook usually handles it.
            // But here we are using the library directly or via hook? 
            // The user prompt showed a script tag approach, but I installed the package.
            // Let's try to import the class from the package.

            import('webgl-fluid-enhanced').then(({ default: WebGLFluid }) => {
                if (!canvasRef.current) return;

                fluid = new WebGLFluid(canvasRef.current);

                fluid.setConfig({
                    densityDissipation: 0.98,
                    velocityDissipation: 0.99,
                    pressure: 0.8,
                    pressureIterations: 20,
                    curl: 30,
                    splatRadius: 0.005,
                    bloom: true,
                    bloomIntensity: 0.5,
                    bloomThreshold: 0.5, // Higher threshold to avoid background glow/spots
                    colorPalette: ['#ffffff', '#e0e0e0', '#c0c0c0'], // Monochrome
                    backColor: '#000000',
                    transparent: false,
                    brightness: 1.0,
                });

                // Attempt to clear any initial splats by not calling any splat function
                // fluid.splats(); // Do not call this
                fluid.start();
            });
        }

        return () => {
            if (fluid) {
                fluid.stop(); // Or destroy if available
            }
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 0, // Background
            }}
        />
    );
}
