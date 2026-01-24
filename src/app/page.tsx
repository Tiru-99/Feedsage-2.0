import { Syne } from "next/font/google";

import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Footer from "@/components/landing/Footer";
import HowItWorks from "@/components/landing/HowItWorks";

const syne = Syne({
  subsets: ["latin"],
});

export default function Home() {
  return (
    <main
      className={`${syne.className} min-h-screen bg-[#050505] overflow-x-hidden pt-16`}
    >
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
      <Footer />
    </main>
  );
}
