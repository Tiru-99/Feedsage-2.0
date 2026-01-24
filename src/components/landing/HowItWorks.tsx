"use client";

import { motion } from "framer-motion";
import { Sparkles, Layout, Search } from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Declare Intent",
    description:
      "Input your focus. Our system recalibrates the digital landscape to serve your goals.",
    icon: Sparkles,
  },
  {
    step: "02",
    title: "Filter Reality",
    description:
      "The algorithmic sludge is removed. Only high-signal content remains in your view.",
    icon: Layout,
  },
  {
    step: "03",
    title: "Validated Search",
    description:
      "Every query is verified against your initial intent. Stay on the path.",
    icon: Search,
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-[#050505] py-28 px-6 border-y border-zinc-900/50">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row items-baseline justify-between mb-8">
          <h2 className="font-syne text-4xl md:text-6xl font-bold tracking-tighter text-zinc-100">
            THE <span className="text-zinc-700 outline-text">RECURSION.</span>
          </h2>
          <p className="text-zinc-400 mt-4 md:mt-0 font-medium tracking-[0.2em] text-xs uppercase">
            Three Phases of Curation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-24 relative">
          {steps.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 1,
                delay: i * 0.2,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative group"
            >
              <div className="font-syne text-[10rem] font-bold text-zinc-800/10 absolute -top-20 -left-4 pointer-events-none select-none">
                {item.step}
              </div>
              <div className="relative pt-20">
                <div className="h-px w-12 bg-red-600 mb-8" />
                <h3 className="font-syne text-3xl font-bold tracking-tight text-zinc-100 mb-6 group-hover:text-red-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-zinc-400 text-lg leading-relaxed max-w-xs">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <style jsx>{`
        .outline-text {
          -webkit-text-stroke: 1px #3f3f46;
          color: transparent;
        }
      `}</style>
    </section>
  );
}
