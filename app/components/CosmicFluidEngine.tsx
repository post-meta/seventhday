"use client";

import React, { useEffect, useRef, useState } from 'react';

/**
 * PROJECT: GENESIS FLUID ENGINE (REFINED: ELECTRIC STORM)
 * A WebGL2 Real-time Electromagnetic Plasma Simulation for SEVENTH DAY Brand
 * 
 * REFINEMENT: "Electric Storm" Physics
 * - High Curl (65.0) for lightning twists
 * - Fast Decay (0.96) for flash effect
 * - Sharp Input (0.1) for plasma injection
 * - Star/Grain Noise for texture
 */

// --- SHADERS ---

const VERTEX_SHADER = `#version 300 es
layout(location=0) in vec2 a_position;
out vec2 v_uv;
void main() {
    v_uv = a_position * 0.5 + 0.5;
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
uniform float u_strength;

out vec4 outColor;

void main() {
    vec2 p = v_uv - u_point.xy;
    p.x *= u_aspectRatio;
    // Sharper falloff for "Electric" feel (power 3.0 instead of exp)
    // float falloff = exp(-dot(p, p) / u_radius); 
    float dist = length(p);
    float falloff = 1.0 / (1.0 + pow(dist / u_radius, 4.0)); // Sharper edge
    falloff = smoothstep(1.0, 0.0, dist / u_radius); // Hard cut

    vec3 splat = falloff * u_color * u_strength;
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
    outColor = result * u_dissipation; // Multiplicative decay for faster fade
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
    
    outCurl = R - L - T + B;
}
`;

const VORTICITY_SHADER = `#version 300 es
precision highp float;
precision highp sampler2D;

in vec2 v_uv;
uniform sampler2D u_velocity;
uniform sampler2D u_curl;
uniform float u_curlStrength;
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
uniform sampler2D u_texture;
uniform sampler2D u_velocity;
uniform float u_time;

out vec4 outColor;

// Noise for "Stars" and "Grain"
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

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

void main() {
    vec3 color = texture(u_texture, v_uv).rgb;
    
    // 1. High-Frequency Noise (Stars)
    // If density is low but non-zero, multiply by noise to create "twinkling"
    float noise = random(v_uv * 100.0 + u_time * 0.5); // High freq
    
    if (color.r < 0.3 && color.r > 0.01) {
        // Create sparkles in the tails
        float sparkle = step(0.98, noise); // Only top 2% are stars
        color += vec3(sparkle * color.r * 2.0); 
    }

    // 2. Film Grain (Heavy)
    float grain = (random(v_uv + u_time) - 0.5) * 0.15; // Increased grain
    color += grain;

    // 3. Tonemap
    color = aces_tonemap(color);

    // 4. Bloom (Simple threshold)
    vec3 bloom = max(color - 0.6, 0.0) * 2.0;
    color += bloom;

    // 5. Monochrome / Electric Shift
    float luminance = dot(color, vec3(0.2126, 0.7152, 0.0722));
    vec3 finalColor = vec3(luminance);
    
    // Subtle blue shift for high energy (Electric)
    finalColor = mix(finalColor, vec3(0.9, 0.95, 1.0), luminance * 0.5);

    outColor = vec4(finalColor, 1.0);
}
`;

// --- CONFIG ---

interface CosmicFluidConfig {
    curlStrength: number;
    splatForce: number;
    splatRadius: number;
    dyeIntensity: number;
    bloomThreshold: number;
    bloomIntensity: number;
    pressureIterations: number;
    dissipation: number;
    velocityDissipation: number;
    simResolution: number;
}

const CONFIG: CosmicFluidConfig = {
    curlStrength: 65.0,      // Extremely high for lightning swirls
    splatForce: 6000.0,      // High energy injection
    splatRadius: 0.1,        // Very thin, sharp injection point
    dyeIntensity: 20.0,      // Blindingly bright
    bloomThreshold: 0.6,     // Only brightest parts glow
    bloomIntensity: 2.0,     // Strong bloom
    pressureIterations: 30,  // Better physics accuracy
    dissipation: 0.96,       // Fades faster (electric flash)
    velocityDissipation: 0.99, // Momentum keeps going
    simResolution: 0.5,
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
            preserveDrawingBuffer: false,
            powerPreference: "high-performance"
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
            if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;

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
            if (gl.getProgramParameter(program, gl.LINK_STATUS)) return program;

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
            dyeWidth = canvas!.clientWidth;
            dyeHeight = canvas!.clientHeight;
            simWidth = Math.floor(dyeWidth * CONFIG.simResolution);
            simHeight = Math.floor(dyeHeight * CONFIG.simResolution);

            canvas!.width = dyeWidth;
            canvas!.height = dyeHeight;
        }
        initResolution();

        const ext = gl.getExtension("EXT_color_buffer_float");
        const linearFiltering = gl.getExtension("OES_texture_float_linear");

        // Use HALF_FLOAT for better performance on mobile, FLOAT for desktop if needed
        const texType = ext ? gl.HALF_FLOAT : gl.FLOAT;
        const texInternalFormat = ext ? gl.RGBA16F : gl.RGBA32F;

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

        // NO INITIAL SPLAT - Start in Void

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
            gl!.uniform1f(advectionUniforms.u_dissipation, CONFIG.velocityDissipation);
            blit(velocity.write.fbo);
            velocity.swap();

            // 2. ADVECTION (Density/Dye)
            gl!.viewport(0, 0, dyeWidth, dyeHeight);
            gl!.useProgram(advectionProgram);
            gl!.uniform2f(advectionUniforms.u_texelSize, 1.0 / dyeWidth, 1.0 / dyeHeight);
            gl!.uniform1i(advectionUniforms.u_velocity, velocity.read.attach(0));
            gl!.uniform1i(advectionUniforms.u_source, density.read.attach(1));
            gl!.uniform1f(advectionUniforms.u_dissipation, CONFIG.dissipation);
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
                    gl!.uniform1f(splatUniforms.u_radius, CONFIG.splatRadius);
                    gl!.uniform1f(splatUniforms.u_strength, CONFIG.splatForce);
                    blit(velocity.write.fbo);
                    velocity.swap();
                }

                gl!.viewport(0, 0, dyeWidth, dyeHeight);
                gl!.uniform1i(splatUniforms.u_target, density.read.attach(0));
                for (let i = splats.length - 1; i >= 0; i--) {
                    const s = splats[i];
                    gl!.uniform2f(splatUniforms.u_point, s.x, s.y);
                    gl!.uniform3f(splatUniforms.u_color, s.color[0], s.color[1], s.color[2]);
                    gl!.uniform1f(splatUniforms.u_radius, CONFIG.splatRadius);
                    gl!.uniform1f(splatUniforms.u_strength, CONFIG.dyeIntensity);
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
            gl!.uniform1f(vorticityUniforms.u_curlStrength, CONFIG.curlStrength);
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

            for (let i = 0; i < CONFIG.pressureIterations; i++) {
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
            gl!.uniform1i(displayUniforms.u_velocity, velocity.read.attach(1));
            gl!.uniform1f(displayUniforms.u_time, performance.now() / 1000);
            gl!.drawElements(gl!.TRIANGLES, 6, gl!.UNSIGNED_SHORT, 0);

            requestAnimationFrame(update);
        }

        function blit(fbo: WebGLFramebuffer | null) {
            gl!.bindFramebuffer(gl!.FRAMEBUFFER, fbo);
            gl!.drawElements(gl!.TRIANGLES, 6, gl!.UNSIGNED_SHORT, 0);
        }

        // --- INTERACTION ---

        let lastMouse = { x: 0, y: 0 };

        const handleMouseMove = (e: MouseEvent) => {
            const x = e.clientX;
            const y = e.clientY;
            const dx = x - lastMouse.x;
            const dy = y - lastMouse.y;

            const nx = x / window.innerWidth;
            const ny = 1.0 - y / window.innerHeight; // Flip Y for WebGL

            // Velocity scaling
            const velocityScale = 10.0;

            // Electric Blue/White color
            const color = [0.8, 0.9, 1.0];

            splat(nx, ny, dx * velocityScale, -dy * velocityScale, color);

            lastMouse.x = x;
            lastMouse.y = y;
        };

        const handleTouchMove = (e: TouchEvent) => {
            e.preventDefault();
            const touch = e.touches[0];
            const x = touch.clientX;
            const y = touch.clientY;
            const dx = x - lastMouse.x;
            const dy = y - lastMouse.y;
            const nx = x / window.innerWidth;
            const ny = 1.0 - y / window.innerHeight;
            splat(nx, ny, dx * 10.0, -dy * 10.0, [0.8, 0.9, 1.0]);
            lastMouse.x = x;
            lastMouse.y = y;
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('touchstart', (e) => {
            lastMouse.x = e.touches[0].clientX;
            lastMouse.y = e.touches[0].clientY;
        });
        window.addEventListener('touchmove', handleTouchMove);

        // Start loop
        update();

        return () => {
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
            style={{
                touchAction: 'none',
                mixBlendMode: 'screen' // Ensure light adds to background
            }}
        />
    );
}
