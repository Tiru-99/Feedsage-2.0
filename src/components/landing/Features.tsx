"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Sliders, Search, Zap, ShieldCheck } from "lucide-react";

const features = [
  {
    id: "01",
    title: "Precision Curation",
    description:
      "Define your focus with natural language. Our AI surgically removes algorithmic noise.",
    icon: Sliders,
  },
  {
    id: "02",
    title: "Validated Search",
    description:
      "Search results are cross-referenced with your intent. Irrelevant content is discarded.",
    icon: Search,
  },
  {
    id: "03",
    title: "Cognitive Shield",
    description:
      "We hide the psychological traps designed to keep you scrolling aimlessly.",
    icon: ShieldCheck,
  },
  {
    id: "04",
    title: "Neural Context",
    description:
      "Shift focus instantly. Transition between deep work and light exploration seamlessly.",
    icon: Zap,
  },
];

export default function Features() {
  return (
    <section className="bg-[#050505] py-40 px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row gap-20">
          <div className="md:w-1/3 sticky top-40 h-fit">
            <h2 className="font-syne text-4xl font-bold tracking-tighter mb-6 text-zinc-100">
              ENGINEERED FOR <br />
              <span className="text-red-600">MODERN MINDS.</span>
            </h2>
            <p className="text-zinc-400 max-w-xs leading-relaxed font-medium">
              We've stripped away the complexity to give you total sovereignty
              over your digital consumption.
            </p>
          </div>

          <div className="md:w-2/3 space-y-40">
            {features.map((feature, index) => (
              <FeatureItem key={feature.id} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureItem({ feature, index }: { feature: any; index: number }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [0.3, 1]);
  const scale = useTransform(scrollYProgress, [0.8, 1], [0.95, 1]);

  return (
    <motion.div
      ref={ref}
      style={{ opacity, scale }}
      className="group relative flex flex-col gap-8"
    >
      <div className="flex items-baseline gap-6">
        <span className="font-syne text-xs text-red-600 font-bold tracking-widest">
          {feature.id}
        </span>
        <h3 className="font-syne text-5xl md:text-7xl font-bold tracking-tighter text-zinc-100 group-hover:text-red-600 transition-colors">
          {feature.title}
        </h3>
      </div>
      <div className="md:pl-16 max-w-xl">
        <p className="text-xl md:text-2xl text-zinc-400 font-medium leading-snug">
          {feature.description}
        </p>
      </div>

      {/* Subtle line reveal */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="h-px bg-zinc-800/50 w-full mt-12 origin-left"
      />
    </motion.div>
  );
}
