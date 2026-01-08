import { Home, Compass, PlaySquare, Clock, ThumbsUp, Flame, ShoppingBag, Music2, Gamepad2, Trophy } from "lucide-react";

export default function Sidebar({ isOpen }: { isOpen: boolean }) {
    const sidebarItems = [
        { icon: Home, label: "Home", isActive: true },
        { icon: Compass, label: "Shorts" },
        { icon: PlaySquare, label: "Subscriptions" },
    ];

    const secondaryItems = [
        { icon: Clock, label: "History" },
        { icon: PlaySquare, label: "Your videos" },
        { icon: Clock, label: "Watch later" },
        { icon: ThumbsUp, label: "Liked videos" },
    ];

    const exploreItems = [
        { icon: Flame, label: "Trending" },
        { icon: ShoppingBag, label: "Shopping" },
        { icon: Music2, label: "Music" },
        { icon: Gamepad2, label: "Gaming" },
        { icon: Trophy, label: "Sports" },
    ]

    // Mini sidebar for collapsed state on desktop
    if (!isOpen) {
        return (
            <aside className="hidden sm:flex flex-col items-center w-18 sticky top-14 left-0 h-[calc(100vh-56px)] overflow-y-auto pt-4 gap-1">
                {sidebarItems.map((item) => (
                    <button key={item.label} className="flex flex-col items-center gap-1 py-4 px-1 rounded-lg hover:bg-(--secondary-hover) w-10/12 transition-colors">
                        <item.icon className="w-6 h-6 mb-1" />
                        <span className="text-[10px] truncate w-full text-center">{item.label}</span>
                    </button>
                ))}
                <button className="flex flex-col items-center gap-1 py-4 px-1 rounded-lg hover:bg-(--secondary-hover) w-10/12 transition-colors">
                    <Clock className="w-6 h-6 mb-1" />
                    <span className="text-[10px] truncate w-full text-center">You</span>
                </button>
            </aside>
        )
    }

    return (
        <>
            {/* Desktop Sidebar (Expanded) */}
            <aside className="hidden sm:flex w-60 flex-col sticky top-14 left-0 h-[calc(100vh-56px)] overflow-y-auto px-3 hover:overflow-y-scroll custom-scrollbar pb-4 bg-(--background)">
                <div className="py-3 border-b border-(--border)">
                    {sidebarItems.map((item) => (
                        <button
                            key={item.label}
                            className={`flex items-center gap-5 px-3 py-2.5 rounded-lg w-full hover:bg-(--secondary-hover) transition-colors ${item.isActive ? "bg-(--secondary) font-medium" : ""
                                }`}
                        >
                            <item.icon className={`w-6 h-6 ${item.isActive ? "fill-white" : ""}`} />
                            <span className="text-sm">{item.label}</span>
                        </button>
                    ))}
                </div>

                <div className="py-3 border-b border-(--border)">
                    <h3 className="px-3 py-2 text-base font-semibold flex items-center gap-2">
                        You <span className="text-xs text-gray-400">&gt;</span>
                    </h3>
                    {secondaryItems.map((item) => (
                        <button
                            key={item.label}
                            className="flex items-center gap-5 px-3 py-2.5 rounded-lg w-full hover:bg-(--secondary-hover) transition-colors"
                        >
                            <item.icon className="w-6 h-6" />
                            <span className="text-sm">{item.label}</span>
                        </button>
                    ))}
                </div>
            </aside>

            {/* Mobile Drawer (would need a portal or overlay logic for true mobile drawer, 
        but for now we'll just show the same content structure if we were doing a mobile drawer. 
        Usually mobile just has bottom nav or a separate slide-over. 
        For this requested "responsive" YouTube UI, user likely wants the desktop look adapted.
        YouTube Mobile usually uses a bottom bar.
    */}
        </>
    );
}
