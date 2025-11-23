"use client";

import React, { useEffect, useRef, useState } from 'react';

/**
 * PROJECT: GENESIS FLUID ENGINE
 * A WebGL2 Real-time Electromagnetic Plasma Simulation for SEVENTH DAY Brand
 * 
 * "In the beginning was the Void, and the Void was with Code, and the Code was Divine..."
 */

// --- SHADERS ---

const VERTEX_SHADER = `#version 300 es
in vec2 a_position;
in vec2 a_uv;
out vec2 v_uv;
void main() {
    v_uv = a_uv;
    gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const SPLAT_SHADER = `#version 300 es
precision highp float;
precision highp sampler2D;

in vec2 v_uv;
uniform sampler2D u_target;
uniform float u_aspectRatio;
uniform vec3 u_color;
uniform vec2 u_point;
uniform float u_radius;
uniform float u_strength; // Charge strength / Thermal energy

out vec4 outColor;

void main() {
    vec2 p = v_uv - u_point.xy;
    p.x *= u_aspectRatio;
    vec3 splat = exp(-dot(p, p) / u_radius) * u_color * u_strength;
    vec3 base = texture(u_target, v_uv).xyz;
    outColor = vec4(base + splat, 1.0);
}
`;

const ADVECTION_SHADER = `#version 300 es
precision highp float;
precision highp sampler2D;

in vec2 v_uv;
uniform sampler2D u_velocity;
uniform sampler2D u_source;
uniform vec2 u_texelSize;
uniform float u_dt;
uniform float u_dissipation;

out vec4 outColor;

void main() {
    vec2 coord = v_uv - u_dt * texture(u_velocity, v_uv).xy * u_texelSize;
    vec4 result = texture(u_source, coord);
    float decay = 1.0 + u_dissipation * u_dt;
    outColor = result / decay;
}
`;

const DIVERGENCE_SHADER = `#version 300 es
precision highp float;
precision highp sampler2D;

in vec2 v_uv;
uniform sampler2D u_velocity;
uniform vec2 u_texelSize;

out float outDivergence;

void main() {
    float L = texture(u_velocity, v_uv - vec2(u_texelSize.x, 0.0)).x;
    float R = texture(u_velocity, v_uv + vec2(u_texelSize.x, 0.0)).x;
    float T = texture(u_velocity, v_uv + vec2(0.0, u_texelSize.y)).y;
    float B = texture(u_velocity, v_uv - vec2(0.0, u_texelSize.y)).y;

    float div = 0.5 * (R - L + T - B);
    outDivergence = div;
}
`;

const PRESSURE_SHADER = `#version 300 es
precision highp float;
precision highp sampler2D;

in vec2 v_uv;
uniform sampler2D u_pressure;
uniform sampler2D u_divergence;
uniform vec2 u_texelSize;

out float outPressure;

void main() {
    float L = texture(u_pressure, v_uv - vec2(u_texelSize.x, 0.0)).x;
    float R = texture(u_pressure, v_uv + vec2(u_texelSize.x, 0.0)).x;
    float T = texture(u_pressure, v_uv + vec2(0.0, u_texelSize.y)).x;
    float B = texture(u_pressure, v_uv - vec2(0.0, u_texelSize.y)).x;
    float C = texture(u_divergence, v_uv).x;

    outPressure = (L + R + T + B - C) * 0.25;
}
`;

const GRADIENT_SUBTRACT_SHADER = `#version 300 es
precision highp float;
precision highp sampler2D;

in vec2 v_uv;
uniform sampler2D u_pressure;
uniform sampler2D u_velocity;
uniform vec2 u_texelSize;

out vec2 outVelocity;

void main() {
    float L = texture(u_pressure, v_uv - vec2(u_texelSize.x, 0.0)).x;
    float R = texture(u_pressure, v_uv + vec2(u_texelSize.x, 0.0)).x;
    float T = texture(u_pressure, v_uv + vec2(0.0, u_texelSize.y)).x;
    float B = texture(u_pressure, v_uv - vec2(0.0, u_texelSize.y)).x;
    
    vec2 velocity = texture(u_velocity, v_uv).xy;
    velocity.xy -= vec2(R - L, T - B);
    outVelocity = velocity;
}
`;

const CURL_SHADER = `#version 300 es
precision highp float;
precision highp sampler2D;

in vec2 v_uv;
uniform sampler2D u_velocity;
uniform vec2 u_texelSize;

out float outCurl;

void main() {
    float L = texture(u_velocity, v_uv - vec2(u_texelSize.x, 0.0)).y;
    float R = texture(u_velocity, v_uv + vec2(u_texelSize.x, 0.0)).y;
    float T = texture(u_velocity, v_uv + vec2(0.0, u_texelSize.y)).x;
    float B = texture(u_velocity, v_uv - vec2(0.0, u_texelSize.y)).x;
    
    // Vorticity magnitude: ω = ∇ × v
    outCurl = R - L - T + B;
}
`;

const VORTICITY_SHADER = `#version 300 es
precision highp float;
precision highp sampler2D;

in vec2 v_uv;
uniform sampler2D u_velocity;
uniform sampler2D u_curl;
uniform float u_curlStrength; // 50.0 (extreme swirls)
uniform float u_dt;
uniform vec2 u_texelSize;

out vec2 outVelocity;

void main() {
    float L = texture(u_curl, v_uv - vec2(u_texelSize.x, 0.0)).x;
    float R = texture(u_curl, v_uv + vec2(u_texelSize.x, 0.0)).x;
    float T = texture(u_curl, v_uv + vec2(0.0, u_texelSize.y)).x;
    float B = texture(u_curl, v_uv - vec2(0.0, u_texelSize.y)).x;
    float C = texture(u_curl, v_uv).x;

    vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
    force /= length(force) + 0.0001;
    force *= u_curlStrength * C;
    force.y *= -1.0;

    vec2 velocity = texture(u_velocity, v_uv).xy;
    outVelocity = velocity + force * u_dt;
}
`;

const DISPLAY_SHADER = `#version 300 es
precision highp float;
precision highp sampler2D;

in vec2 v_uv;
uniform sampler2D u_texture; // Density/Color
uniform sampler2D u_velocity; // For warping/chromatic aberration
uniform float u_time;

out vec4 outColor;

// ACES Filmic Tonemapping
vec3 aces_tonemap(vec3 color) {
    mat3 m1 = mat3(
        0.59719, 0.07600, 0.02840,
        0.35458, 0.90834, 0.13383,
        0.04823, 0.01566, 0.83777
    );
    mat3 m2 = mat3(
        1.60475, -0.10208, -0.00327,
        -0.53108, 1.10813, -0.07276,
        -0.07367, -0.00605, 1.07602
    );
    vec3 v = m1 * color;
    vec3 a = v * (v + 0.0245786) - 0.000090537;
    vec3 b = v * (0.983729 * v + 0.4329510) + 0.238081;
    return clamp(m2 * (a / b), 0.0, 1.0);
}

// Noise for "Film Grain"
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

void main() {
    // Chromatic Aberration based on velocity (Relativistic Shift)
    vec2 vel = texture(u_velocity, v_uv).xy * 0.005;
    float r = texture(u_texture, v_uv - vel).r;
    float g = texture(u_texture, v_uv).g;
    float b = texture(u_texture, v_uv + vel).b;
    
    vec3 color = vec3(r, g, b);
    
    // "Genesis Moment" flash logic could be passed as uniform, but we keep it simple here
    // Apply ACES Tonemapping
    color = aces_tonemap(color);
    
    // Film Grain (Blue noise approximation)
    float noise = random(v_uv + u_time);
    color += (noise - 0.5) * 0.05; // 5% grain
    
    // Bloom/Glow (Simplified inline)
    // In a full pipeline, this would be a separate pass. 
    // Here we boost high values slightly.
    color += max(color - 0.6, 0.0) * 0.5;

    // Strict Monochrome Palette Enforcement with subtle shift
    // void: [0,0,0], plasma: [0.2], energy: [0.7], creation: [1.0]
    // We desaturate slightly to ensure "Quiet Luxury"
    float luminance = dot(color, vec3(0.2126, 0.7152, 0.0722));
    vec3 mono = vec3(luminance);
    
    // Mix back a tiny bit of blue for "Relativistic Shift" at high energy
    vec3 finalColor = mix(mono, vec3(0.9, 0.95, 1.0) * luminance, luminance * luminance * 0.2);

    outColor = vec4(finalColor, 1.0);
}
`;

// --- TYPES & UTILS ---

interface CosmicFluidConfig {
    viscosity: number;
    diffusion: number;
    vorticity: number;
    permittivity: number;
    permeability: number;
    bloomIntensity: number;
    grainAmount: number;
    contrastRatio: number;
}

const DEFAULT_CONFIG: CosmicFluidConfig = {
    viscosity: 0.0001, // nearly inviscid
    diffusion: 0.98,   // slow dissipation
    vorticity: 50.0,   // extreme swirls
    permittivity: 8.854e-12,
    permeability: 1.257e-6,
    bloomIntensity: 0.8,
    grainAmount: 0.02,
    contrastRatio: 100,
};

// --- COMPONENT ---

export default function CosmicFluidEngine() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isSupported, setIsSupported] = useState(true);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const gl = canvas.getContext('webgl2', {
            alpha: true,
            depth: false,
            stencil: false,
            antialias: false,
            preserveDrawingBuffer: false
        });

        if (!gl) {
            console.warn("WebGL2 not supported, falling back.");
            setIsSupported(false);
            return;
        }

        // --- WEBGL HELPERS ---

        function createShader(gl: WebGL2RenderingContext, type: number, source: string) {
            const shader = gl.createShader(type);
            if (!shader) throw new Error("Could not create shader");
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
            console.error(gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            throw new Error("Shader compile error");
        }

        function createProgram(gl: WebGL2RenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) {
            const program = gl.createProgram();
            if (!program) throw new Error("Could not create program");
            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
            gl.linkProgram(program);
            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return program;
            console.error(gl.getProgramInfoLog(program));
            gl.deleteProgram(program);
            throw new Error("Program link error");
        }

        function getUniforms(program: WebGLProgram) {
            let uniforms: any = {};
            let uniformCount = gl!.getProgramParameter(program, gl!.ACTIVE_UNIFORMS);
            for (let i = 0; i < uniformCount; i++) {
                let uniformName = gl!.getActiveUniform(program, i)!.name;
                uniforms[uniformName] = gl!.getUniformLocation(program, uniformName);
            }
            return uniforms;
        }

        // --- TEXTURE MANAGEMENT ---

        let simWidth: number = 0;
        let simHeight: number = 0;
        let dyeWidth: number = 0;
        let dyeHeight: number = 0;

        function initResolution() {
            let aspect = canvas!.clientWidth / canvas!.clientHeight;
            dyeWidth = canvas!.clientWidth;
            dyeHeight = canvas!.clientHeight;
            simWidth = dyeWidth >> 1; // 0.5x resolution for physics
            simHeight = dyeHeight >> 1;

            canvas!.width = dyeWidth;
            canvas!.height = dyeHeight;
        }
        initResolution();

        const ext = gl.getExtension("EXT_color_buffer_float");
        const linearFiltering = gl.getExtension("OES_texture_float_linear");

        function createDoubleFBO(w: number, h: number, internalFormat: number, format: number, type: number, param: number) {
            let fbo1 = createFBO(w, h, internalFormat, format, type, param);
            let fbo2 = createFBO(w, h, internalFormat, format, type, param);
            return {
                get read() { return fbo1; },
                get write() { return fbo2; },
                swap() {
                    let temp = fbo1;
                    fbo1 = fbo2;
                    fbo2 = temp;
                }
            };
        }

        function createFBO(w: number, h: number, internalFormat: number, format: number, type: number, param: number) {
            gl!.activeTexture(gl!.TEXTURE0);
            let texture = gl!.createTexture();
            gl!.bindTexture(gl!.TEXTURE_2D, texture);
            gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, param);
            gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, param);
            gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE);
            gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE);
            gl!.texImage2D(gl!.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);

            let fbo = gl!.createFramebuffer();
            gl!.bindFramebuffer(gl!.FRAMEBUFFER, fbo);
            gl!.framebufferTexture2D(gl!.FRAMEBUFFER, gl!.COLOR_ATTACHMENT0, gl!.TEXTURE_2D, texture, 0);
            gl!.viewport(0, 0, w, h);
            gl!.clear(gl!.COLOR_BUFFER_BIT);

            return {
                texture,
                fbo,
                width: w,
                height: h,
                attach(id: number) {
                    gl!.activeTexture(gl!.TEXTURE0 + id);
                    gl!.bindTexture(gl!.TEXTURE_2D, texture);
                    return id;
                }
            };
        }

        // --- SETUP PROGRAMS ---

        const baseVertexShader = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
        const splatShader = createShader(gl, gl.FRAGMENT_SHADER, SPLAT_SHADER);
        const advectionShader = createShader(gl, gl.FRAGMENT_SHADER, ADVECTION_SHADER);
        const divergenceShader = createShader(gl, gl.FRAGMENT_SHADER, DIVERGENCE_SHADER);
        const curlShader = createShader(gl, gl.FRAGMENT_SHADER, CURL_SHADER);
        const vorticityShader = createShader(gl, gl.FRAGMENT_SHADER, VORTICITY_SHADER);
        const pressureShader = createShader(gl, gl.FRAGMENT_SHADER, PRESSURE_SHADER);
        const gradientSubtractShader = createShader(gl, gl.FRAGMENT_SHADER, GRADIENT_SUBTRACT_SHADER);
        const displayShader = createShader(gl, gl.FRAGMENT_SHADER, DISPLAY_SHADER);

        const splatProgram = createProgram(gl, baseVertexShader, splatShader);
        const advectionProgram = createProgram(gl, baseVertexShader, advectionShader);
        const divergenceProgram = createProgram(gl, baseVertexShader, divergenceShader);
        const curlProgram = createProgram(gl, baseVertexShader, curlShader);
        const vorticityProgram = createProgram(gl, baseVertexShader, vorticityShader);
        const pressureProgram = createProgram(gl, baseVertexShader, pressureShader);
        const gradientSubtractProgram = createProgram(gl, baseVertexShader, gradientSubtractShader);
        const displayProgram = createProgram(gl, baseVertexShader, displayShader);

        const splatUniforms = getUniforms(splatProgram);
        const advectionUniforms = getUniforms(advectionProgram);
        const divergenceUniforms = getUniforms(divergenceProgram);
        const curlUniforms = getUniforms(curlProgram);
        const vorticityUniforms = getUniforms(vorticityProgram);
        const pressureUniforms = getUniforms(pressureProgram);
        const gradientSubtractUniforms = getUniforms(gradientSubtractProgram);
        const displayUniforms = getUniforms(displayProgram);

        // --- BUFFERS ---

        // Use half-float textures for HDR
        const texType = ext ? gl.HALF_FLOAT : gl.FLOAT; // Fallback if needed, but WebGL2 usually supports HALF_FLOAT
        const texInternalFormat = ext ? gl.RGBA16F : gl.RGBA32F; // Or RGBA16F

        let density = createDoubleFBO(dyeWidth, dyeHeight, texInternalFormat, gl.RGBA, texType, linearFiltering ? gl.LINEAR : gl.NEAREST);
        let velocity = createDoubleFBO(simWidth, simHeight, texInternalFormat, gl.RGBA, texType, linearFiltering ? gl.LINEAR : gl.NEAREST);
        let divergence = createFBO(simWidth, simHeight, texInternalFormat, gl.RGBA, texType, gl.NEAREST);
        let curl = createFBO(simWidth, simHeight, texInternalFormat, gl.RGBA, texType, gl.NEAREST);
        let pressure = createDoubleFBO(simWidth, simHeight, texInternalFormat, gl.RGBA, texType, gl.NEAREST);

        // Quad for rendering
        gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(0);

        // --- SIMULATION LOOP ---

        let lastTime = Date.now();
        let splats: any[] = [];

        function splat(x: number, y: number, dx: number, dy: number, color: number[]) {
            splats.push({ x, y, dx, dy, color });
        }

        // "Genesis Moment" - Initial Flash
        splat(0.5, 0.5, 0, 0, [10.0, 10.0, 10.0]); // Big white flash

        function update() {
            const dt = Math.min((Date.now() - lastTime) / 1000, 0.016);
            lastTime = Date.now();

            gl!.viewport(0, 0, simWidth, simHeight);

            // 1. ADVECTION (Velocity)
            gl!.useProgram(advectionProgram);
            gl!.uniform2f(advectionUniforms.u_texelSize, 1.0 / simWidth, 1.0 / simHeight);
            gl!.uniform1i(advectionUniforms.u_velocity, velocity.read.attach(0));
            gl!.uniform1i(advectionUniforms.u_source, velocity.read.attach(0));
            gl!.uniform1f(advectionUniforms.u_dt, dt);
            gl!.uniform1f(advectionUniforms.u_dissipation, DEFAULT_CONFIG.viscosity);
            blit(velocity.write.fbo);
            velocity.swap();

            // 2. ADVECTION (Density/Dye)
            gl!.viewport(0, 0, dyeWidth, dyeHeight);
            gl!.useProgram(advectionProgram);
            gl!.uniform2f(advectionUniforms.u_texelSize, 1.0 / dyeWidth, 1.0 / dyeHeight);
            gl!.uniform1i(advectionUniforms.u_velocity, velocity.read.attach(0));
            gl!.uniform1i(advectionUniforms.u_source, density.read.attach(1));
            gl!.uniform1f(advectionUniforms.u_dissipation, DEFAULT_CONFIG.diffusion);
            blit(density.write.fbo);
            density.swap();

            // 3. SPLATS (Interaction)
            gl!.viewport(0, 0, simWidth, simHeight);
            if (splats.length > 0) {
                gl!.useProgram(splatProgram);
                gl!.uniform1i(splatUniforms.u_target, velocity.read.attach(0));
                gl!.uniform1f(splatUniforms.u_aspectRatio, simWidth / simHeight);

                for (let i = splats.length - 1; i >= 0; i--) {
                    const s = splats[i];
                    gl!.uniform2f(splatUniforms.u_point, s.x, s.y);
                    gl!.uniform3f(splatUniforms.u_color, s.dx, s.dy, 0.0);
                    gl!.uniform1f(splatUniforms.u_radius, 0.002); // Small radius for velocity
                    gl!.uniform1f(splatUniforms.u_strength, 5.0); // Force multiplier
                    blit(velocity.write.fbo);
                    velocity.swap();
                }

                gl!.viewport(0, 0, dyeWidth, dyeHeight);
                gl!.uniform1i(splatUniforms.u_target, density.read.attach(0));
                for (let i = splats.length - 1; i >= 0; i--) {
                    const s = splats[i];
                    gl!.uniform2f(splatUniforms.u_point, s.x, s.y);
                    gl!.uniform3f(splatUniforms.u_color, s.color[0], s.color[1], s.color[2]);
                    gl!.uniform1f(splatUniforms.u_radius, 0.005); // Larger radius for dye
                    gl!.uniform1f(splatUniforms.u_strength, 1.0);
                    blit(density.write.fbo);
                    density.swap();
                }
                splats = [];
            }

            // 4. VORTICITY CONFINEMENT
            gl!.viewport(0, 0, simWidth, simHeight);
            gl!.useProgram(curlProgram);
            gl!.uniform2f(curlUniforms.u_texelSize, 1.0 / simWidth, 1.0 / simHeight);
            gl!.uniform1i(curlUniforms.u_velocity, velocity.read.attach(0));
            blit(curl.fbo);

            gl!.useProgram(vorticityProgram);
            gl!.uniform2f(vorticityUniforms.u_texelSize, 1.0 / simWidth, 1.0 / simHeight);
            gl!.uniform1i(vorticityUniforms.u_velocity, velocity.read.attach(0));
            gl!.uniform1i(vorticityUniforms.u_curl, curl.attach(1));
            gl!.uniform1f(vorticityUniforms.u_curlStrength, DEFAULT_CONFIG.vorticity);
            gl!.uniform1f(vorticityUniforms.u_dt, dt);
            blit(velocity.write.fbo);
            velocity.swap();

            // 5. DIVERGENCE
            gl!.useProgram(divergenceProgram);
            gl!.uniform2f(divergenceUniforms.u_texelSize, 1.0 / simWidth, 1.0 / simHeight);
            gl!.uniform1i(divergenceUniforms.u_velocity, velocity.read.attach(0));
            blit(divergence.fbo);

            // 6. PRESSURE SOLVER (Jacobi Iteration)
            gl!.useProgram(pressureProgram);
            gl!.uniform2f(pressureUniforms.u_texelSize, 1.0 / simWidth, 1.0 / simHeight);
            gl!.uniform1i(pressureUniforms.u_divergence, divergence.attach(0));

            // Clear pressure first? Usually 0 is fine start
            // gl.bindFramebuffer(gl.FRAMEBUFFER, pressure.read.fbo);
            // gl.clear(gl.COLOR_BUFFER_BIT);

            for (let i = 0; i < 20; i++) { // 20 iterations for stability
                gl!.uniform1i(pressureUniforms.u_pressure, pressure.read.attach(1));
                blit(pressure.write.fbo);
                pressure.swap();
            }

            // 7. GRADIENT SUBTRACT (Project)
            gl!.useProgram(gradientSubtractProgram);
            gl!.uniform2f(gradientSubtractUniforms.u_texelSize, 1.0 / simWidth, 1.0 / simHeight);
            gl!.uniform1i(gradientSubtractUniforms.u_pressure, pressure.read.attach(0));
            gl!.uniform1i(gradientSubtractUniforms.u_velocity, velocity.read.attach(1));
            blit(velocity.write.fbo);
            velocity.swap();

            // 8. DISPLAY RENDER
            gl!.viewport(0, 0, dyeWidth, dyeHeight);
            gl!.bindFramebuffer(gl!.FRAMEBUFFER, null);
            gl!.useProgram(displayProgram);
            gl!.uniform1i(displayUniforms.u_texture, density.read.attach(0));
            gl!.uniform1i(displayUniforms.u_velocity, velocity.read.attach(1)); // For chromatic aberration
            gl!.uniform1f(displayUniforms.u_time, performance.now() / 1000);
            gl!.drawElements(gl!.TRIANGLES, 6, gl!.UNSIGNED_SHORT, 0);

            requestAnimationFrame(update);
        }

        function blit(fbo: WebGLFramebuffer | null) {
            gl!.bindFramebuffer(gl!.FRAMEBUFFER, fbo);
            gl!.drawElements(gl!.TRIANGLES, 6, gl!.UNSIGNED_SHORT, 0);
        }

        // --- INTERACTION ---

        let isMouseDown = false;
        let lastMouse = { x: 0, y: 0 };

        const handleMouseDown = (e: MouseEvent) => {
            isMouseDown = true;
            lastMouse.x = e.clientX;
            lastMouse.y = e.clientY;
        };

        const handleMouseUp = () => {
            isMouseDown = false;
        };

        const handleMouseMove = (e: MouseEvent) => {
            // Always interact on move, not just drag
            const x = e.clientX;
            const y = e.clientY;
            const dx = x - lastMouse.x;
            const dy = y - lastMouse.y;

            // Normalize coordinates
            const nx = x / window.innerWidth;
            const ny = 1.0 - y / window.innerHeight; // Flip Y for WebGL

            // Velocity scaling
            const velocityScale = 10.0;

            // Add splat
            // Color based on velocity? Or just white/silver
            // "Gentle Touch" vs "Cosmic Impact" logic
            const speed = Math.sqrt(dx * dx + dy * dy);
            let color = [0.7, 0.7, 0.7]; // Silver

            if (speed > 50) { // Cosmic Impact
                color = [1.0, 1.0, 1.0]; // Pure White
            } else if (speed < 5) { // Gentle
                color = [0.2, 0.2, 0.2]; // Dark Plasma
            }

            splat(nx, ny, dx * velocityScale, -dy * velocityScale, color);

            lastMouse.x = x;
            lastMouse.y = y;
        };

        // Touch support
        const handleTouchMove = (e: TouchEvent) => {
            e.preventDefault();
            const touch = e.touches[0];
            const x = touch.clientX;
            const y = touch.clientY;
            // Similar logic...
            const dx = x - lastMouse.x;
            const dy = y - lastMouse.y;
            const nx = x / window.innerWidth;
            const ny = 1.0 - y / window.innerHeight;
            splat(nx, ny, dx * 10.0, -dy * 10.0, [0.8, 0.8, 0.8]);
            lastMouse.x = x;
            lastMouse.y = y;
        };

        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('touchstart', (e) => {
            lastMouse.x = e.touches[0].clientX;
            lastMouse.y = e.touches[0].clientY;
        });
        window.addEventListener('touchmove', handleTouchMove);

        // Start loop
        update();

        return () => {
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('touchmove', handleTouchMove);
        };
    }, []);

    if (!isSupported) {
        return <div className="fixed inset-0 bg-black" />;
    }

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 w-full h-full z-0 pointer-events-auto"
            style={{ touchAction: 'none' }}
        />
    );
}
