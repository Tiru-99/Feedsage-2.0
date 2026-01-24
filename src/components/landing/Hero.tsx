"use client";

import { motion } from "framer-motion";
import { ArrowRight, Search, Sparkles } from "lucide-react";
import { useState } from "react";
// import EnergyBeam from "./energy-beam";
import { redirect } from "next/navigation";

export default function Hero() {
  const [prompt, setPrompt] = useState("");

  return (
    <section className="relative py-20 md:py-32 flex flex-col items-center justify-center overflow-hidden bg-[#050505] px-6">
      {/*<div className="absolute inset-0 z-0">
        <EnergyBeam className="opacity-40" />
      </div>*/}

      <div className="container mx-auto max-w-5xl relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/50 border border-white/5 mb-4"
        >
          <Sparkles className="w-3.5 h-3.5 text-red-500" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
            Powered by Intent-Engine v2.0
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-space text-5xl md:text-8xl font-bold tracking-tighter text-white leading-[0.9] mb-6"
        >
          CURATE YOUR <br />
          <span className="text-zinc-500">DIGITAL FEED.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-8 leading-relaxed"
        >
          Stop the aimless scrolling. Use natural language to define exactly
          what you want to see on YouTube, and let our AI handle the rest.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative max-w-2xl mx-auto"
        >
          <div className="relative group w-full max-w-3xl mx-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-600/20 to-zinc-800/20 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />

            <div className="relative flex flex-col md:flex-row md:items-center gap-3 bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-3 md:px-6 md:py-4 shadow-2xl">
              {/* Search icon + input */}
              <div className="flex items-center gap-3 flex-1">
                <Search className="w-5 h-5 text-zinc-500 shrink-0" />

                <input
                  type="text"
                  placeholder="What do you want to learn today?"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="flex-1 bg-transparent text-base md:text-lg text-white outline-none placeholder:text-zinc-600 min-w-0"
                />
              </div>

              {/* Button */}
              <button
                className="
                  flex items-center justify-center gap-2
                  w-full md:w-auto
                  px-5 py-3 md:px-6 md:py-2
                  bg-white text-black font-bold
                  rounded-full
                  hover:bg-zinc-200
                  transition-all
                  shrink-0
                "
                onClick={() => {
                  redirect("/home");
                }}
              >
                Enter
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap justify-center gap-3">
            {["System Design", "Lofi Beats", "Indie Hacking"].map((tag) => (
              <button
                key={tag}
                onClick={() => setPrompt(tag)}
                className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 hover:text-white transition-colors border border-white/5 hover:border-white/10 px-4 py-2 rounded-full bg-white/5"
              >
                {tag}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
