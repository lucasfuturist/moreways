"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic } from "lucide-react";

export function VoiceOrb({ onTranscript }: { onTranscript: (text: string) => void }) {
  const [isListening, setIsListening] = useState(false);
  const [volume, setVolume] = useState(0);
  
  // Refs for audio handling
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const frameRef = useRef<number>(0);
  const recognitionRef = useRef<any>(null); // For Web Speech API

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsListening(true);

      // 1. Setup Audio Analysis (Visuals)
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContext();
      audioContextRef.current = ctx;
      
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);
      sourceRef.current = source;

      // Animation Loop to detect volume
      const updateVolume = () => {
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(dataArray);
        
        // Calculate average volume
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        setVolume(average); // 0 to 255
        
        frameRef.current = requestAnimationFrame(updateVolume);
      };
      updateVolume();

      // 2. Setup Speech Recognition (Logic)
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          const text = event.results[0][0].transcript;
          onTranscript(text);
          stopListening();
        };

        recognition.onerror = () => stopListening();
        recognition.start();
        recognitionRef.current = recognition;
      } else {
        alert("Speech recognition not supported in this browser.");
        stopListening();
      }

    } catch (err) {
      console.error("Mic Access Denied", err);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    setIsListening(false);
    setVolume(0);
    
    // Cleanup
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    if (sourceRef.current) sourceRef.current.disconnect();
    if (audioContextRef.current) audioContextRef.current.close();
    if (recognitionRef.current) recognitionRef.current.stop();
  };

  // Dynamic Styles based on volume
  // Scale range: 1.0 to 1.5
  // Glow range: 0px to 30px
  const scale = 1 + (volume / 255) * 0.8;
  const glow = (volume / 255) * 40;

  return (
    <div className="relative flex items-center justify-center h-[46px] w-[46px]">
        <AnimatePresence mode="wait">
            {!isListening ? (
                <motion.button
                    key="mic-btn"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={startListening}
                    // UPDATED: Added dark mode colors
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                    <Mic className="w-5 h-5" />
                </motion.button>
            ) : (
                <motion.div
                    key="orb"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="relative cursor-pointer"
                    onClick={stopListening}
                >
                    {/* The Inner Core */}
                    <motion.div 
                        className="w-10 h-10 rounded-full bg-indigo-600 relative z-20 flex items-center justify-center"
                        animate={{ scale }}
                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    >
                        <Mic className="w-5 h-5 text-white" />
                    </motion.div>

                    {/* The Outer Aura (Audio Reactive) */}
                    <motion.div 
                        className="absolute inset-0 rounded-full bg-indigo-500/50 z-10"
                        animate={{ 
                            scale: scale * 1.4,
                            opacity: 0.5 + (volume / 255)
                        }}
                    />
                    
                    {/* The Deep Glow */}
                    <motion.div 
                        className="absolute inset-0 rounded-full bg-indigo-400 blur-xl z-0"
                        animate={{ 
                            opacity: (volume / 255) * 2
                        }}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    </div>
  );
}