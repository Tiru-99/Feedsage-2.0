"use client";

import { Sparkles, ArrowRight } from "lucide-react";

export default function PromptInput() {
    return (
        <div className="w-full flex-col flex items-center justify-center py-10 px-4">
            <div className="w-full max-w-3xl relative">
                <div className="absolute -inset-0.5 bg-linear-to-r from-pink-500 to-purple-600 rounded-2xl blur opacity-30 animate-pulse"></div>
                <div className="relative flex items-center bg-(--background) border border-(--border) rounded-2xl p-2 shadow-2xl">
                    <div className="pl-4 pr-2 text-purple-400">
                        <Sparkles className="w-6 h-6" />
                    </div>
                    <input
                        type="text"
                        placeholder="Describe the feed you want to see..."
                        className="w-full bg-transparent text-lg px-3 py-3 outline-none text-(--foreground) placeholder-gray-500"
                    />
                    <button className="bg-(--foreground) hover:bg-white/90 text-(--background) p-3 rounded-xl transition-all hover:scale-105 active:scale-95">
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
            <p className="text-gray-500 text-sm mt-4 font-medium">
                Try Entering some prompt
            </p>
        </div>
    );
}
