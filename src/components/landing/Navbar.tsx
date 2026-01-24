"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-black/50 backdrop-blur-xl border-b border-white/5"
    >
      <Link href="/" className="flex items-center gap-2 group">
        <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110">
          <Play className="w-4 h-4 fill-white text-white" />
        </div>
        <span className="font-syne font-bold text-xl tracking-tighter text-white">
          Feedsage
        </span>
      </Link>

      <div className="hidden md:flex items-center gap-8">
        {["Features", "How it Works", "About"].map((item) => (
          <Link
            key={item}
            href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
            className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
          >
            {item}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <Link href="/auth">
          <button className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
            Sign In
          </button>
        </Link>
        <Link href="/home">
          <button className="px-5 py-2 bg-white text-black text-sm font-bold rounded-full hover:bg-zinc-200 transition-colors">
            Get Started
          </button>
        </Link>
      </div>
    </motion.nav>
  );
}
