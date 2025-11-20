"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const tracks = [
    { id: 1, src: "/audio/track1.mp3", title: "Midnight Pulse I" },
    { id: 2, src: "/audio/track2.mp3", title: "Midnight Pulse II" },
    { id: 3, src: "/audio/track3.mp3", title: "Midnight Pulse III" },
];

export default function AudioPlayer() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isExpanded, setIsExpanded] = useState(true);
    const [currentTrack, setCurrentTrack] = useState(0);
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        audio.volume = 0.3;

        // Try autoplay
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise
                .then(() => setIsPlaying(true))
                .catch(() => {
                    setIsPlaying(false);
                    // Interaction fallback
                    const startAudio = () => {
                        audio.play().then(() => setIsPlaying(true));
                        document.removeEventListener("click", startAudio);
                        document.removeEventListener("touchstart", startAudio);
                        document.removeEventListener("keydown", startAudio);
                    };
                    document.addEventListener("click", startAudio);
                    document.addEventListener("touchstart", startAudio);
                    document.addEventListener("keydown", startAudio);
                });
        }
    }, []);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const nextTrack = () => {
        let next = currentTrack + 1;
        if (next >= tracks.length) next = 0;
        setCurrentTrack(next);
    };

    const prevTrack = () => {
        let prev = currentTrack - 1;
        if (prev < 0) prev = tracks.length - 1;
        setCurrentTrack(prev);
    };

    // Auto-play next track when current ends
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.src = tracks[currentTrack].src;
            if (isPlaying) {
                audioRef.current.play();
            }
        }
    }, [currentTrack]);

    // Auto-collapse on scroll
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 100 && isExpanded) {
                setIsExpanded(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [isExpanded]);

    return (
        <>
            <audio
                ref={audioRef}
                onEnded={nextTrack}
                className="hidden"
            />

            <div className="fixed top-6 right-6 z-50 flex flex-col items-end gap-2">
                <AnimatePresence mode="wait">
                    {isExpanded ? (
                        <motion.div
                            key="expanded"
                            initial={{ opacity: 0, scale: 0.9, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: -10 }}
                            className="flex items-center gap-1 rounded-full border border-white/10 bg-black/40 p-2 backdrop-blur-md"
                        >
                            {/* Prev */}
                            <button
                                onClick={prevTrack}
                                className="flex h-10 w-10 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>

                            {/* Play/Pause */}
                            <button
                                onClick={togglePlay}
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                            >
                                {isPlaying ? (
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
                                    </svg>
                                ) : (
                                    <svg className="h-5 w-5 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                    </svg>
                                )}
                            </button>

                            {/* Next */}
                            <button
                                onClick={nextTrack}
                                className="flex h-10 w-10 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>

                            {/* Divider */}
                            <div className="mx-2 h-5 w-px bg-white/10" />

                            {/* Hide */}
                            <button
                                onClick={() => setIsExpanded(false)}
                                className="flex h-10 w-10 items-center justify-center rounded-full text-white/40 transition-colors hover:bg-white/10 hover:text-white"
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </motion.div>
                    ) : (
                        <motion.button
                            key="collapsed"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            onClick={() => setIsExpanded(true)}
                            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-black/40 backdrop-blur-md transition-all hover:border-white/30 hover:bg-black/60"
                        >
                            {isPlaying ? (
                                <div className="flex items-end gap-0.5 h-4">
                                    <motion.div
                                        animate={{ height: [4, 14, 4] }}
                                        transition={{ duration: 0.5, repeat: Infinity }}
                                        className="w-0.5 bg-white/80 rounded-full"
                                    />
                                    <motion.div
                                        animate={{ height: [6, 12, 6] }}
                                        transition={{ duration: 0.4, repeat: Infinity, delay: 0.1 }}
                                        className="w-0.5 bg-white/80 rounded-full"
                                    />
                                    <motion.div
                                        animate={{ height: [4, 10, 4] }}
                                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                                        className="w-0.5 bg-white/80 rounded-full"
                                    />
                                </div>
                            ) : (
                                <svg className="h-5 w-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                                </svg>
                            )}
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
}
