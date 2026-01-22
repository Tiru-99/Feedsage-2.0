"use client";
import { useState, useRef } from "react";

const categories = [
    "All",
    "Gaming",
    "Music",
    "Mixes",
    "Live",
    "Programming",
    "Podcasts",
    "News",
    "Sports",
    "Recently uploaded",
    "New to you",
    "Computer Science",
    "Contemporary R&B",
    "Action-adventure games",
    "Visual arts",
    "Tourist destinations",
];

export default function CategoryPills() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isLeftVisible, setIsLeftVisible] = useState(false);
    const [isRightVisible, setIsRightVisible] = useState(true);

    // In a real app, we'd add scroll event listeners to toggle arrows

    return (
        <div className="sticky top-0 z-10 bg-(--background) pt-3 pb-3 w-full overflow-hidden flex items-center gap-2">
            <div
                ref={containerRef}
                className="flex overflow-x-auto gap-3 items-center scrollbar-hide w-full px-2"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {categories.map((category, idx) => (
                    <button
                        key={category}
                        className={`whitespace-nowrap py-1.5 px-3 rounded-lg text-sm font-semibold transition-colors ${idx === 0
                                ? "bg-(--foreground) text-(--background)"
                                : "bg-(--secondary) hover:bg-(--secondary-hover) text-(--foreground)"
                            }`}
                    >
                        {category}
                    </button>
                ))}
            </div>
        </div>
    );
}
