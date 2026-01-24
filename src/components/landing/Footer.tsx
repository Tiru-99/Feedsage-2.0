import { Play } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-20 bg-[#050505] border-t border-white/5 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6 group">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110">
                <Play className="w-4 h-4 fill-white text-white" />
              </div>
              <span className="font-syne font-bold text-xl tracking-tighter text-white">
                Feedsage
              </span>
            </Link>
            <p className="text-zinc-500 max-w-sm leading-relaxed">
              Empowering users to reclaim their digital attention through
              AI-driven intent validation and focused viewing experiences.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 font-syne">Product</h4>
            <ul className="space-y-4 text-sm text-zinc-500">
              <li>
                <Link
                  href="#features"
                  className="hover:text-white transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#how-it-works"
                  className="hover:text-white transition-colors"
                >
                  How it Works
                </Link>
              </li>
              <li>
                <button className="hover:text-white transition-colors">
                  Pricing
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 font-syne">Legal</h4>
            <ul className="space-y-4 text-sm text-zinc-500">
              <li>
                <button className="hover:text-white transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button className="hover:text-white transition-colors">
                  Terms of Service
                </button>
              </li>
              <li>
                <button className="hover:text-white transition-colors">
                  Cookie Policy
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 gap-4">
          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} Feedsage Inc. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="https://x.com/tiru299" target="_blank">
              <button className="text-xs text-zinc-600 hover:text-white transition-colors font-mono">
                TWITTER
              </button>
            </Link>

            <Link href="https://github.com/tiru-99" target="_blank">
              <button className="text-xs text-zinc-600 hover:text-white transition-colors font-mono">
                GITHUB
              </button>
            </Link>

            <Link
              href="https://www.linkedin.com/in/aayush-tirmanwar-b81a62261"
              target="_blank"
            >
              <button className="text-xs text-zinc-600 hover:text-white transition-colors font-mono">
                LINKEDIN
              </button>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
