"use client";
import {
  Search,
  MonitorPlay,
  Sparkles,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import UserProfile from "./UserProfile";

interface TopBarProps {
  onOpenFeedModal: () => void;
  onOpenApiKeyModal: () => void;
}

export default function TopBar({
  onOpenFeedModal,
  onOpenApiKeyModal,
}: TopBarProps) {
  const [query, setQuery] = useState<string>("");
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = () => {
    console.log("The button got pressed");
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) setQuery(q);
  }, [searchParams]);

  return (
    <div className="flex justify-between items-center px-4 h-14 sticky top-0 bg-(--background) z-50">
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-1">
          <div className="text-red-600">
            <MonitorPlay className="w-8 h-8 fill-red-600 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tighter hidden sm:block">
            Feedsage
          </span>
        </Link>
        <button
          onClick={() => router.push("/")}
          className="hidden md:flex items-center justify-center px-4 py-2 hover:bg-[#272727] rounded-full transition-colors ml-4 text-sm font-medium"
        >
          Home
        </button>
      </div>

      <div className="flex flex-1 max-w-180 items-center gap-2 sm:gap-4 ml-2 sm:ml-10">
        <div className="flex flex-1 items-center">
          <div className="flex flex-1 items-center bg-(--background) border border-(--border) rounded-l-full ml-2 sm:ml-8 focus-within:border-blue-500 shadow-inner px-4 py-0 pl-5">
            <div className="flex-1 flex">
              <input
                value={query}
                type="text"
                placeholder="Search"
                className="w-full bg-transparent outline-none py-2 text-sm"
                onChange={(e) => {
                  setQuery(e.target.value);
                }}
              />
            </div>
          </div>

          <button
            className="bg-(--secondary) hover:bg-(--secondary-hover) border border-l-0 border-(--border) rounded-r-full px-5 py-2 transition-colors"
            onClick={handleSubmit}
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
        <button
          onClick={onOpenFeedModal}
          className="p-2 bg-(--secondary) hover:bg-(--secondary-hover) rounded-full transition-colors tooltip flex items-center gap-2 px-2 sm:px-4"
          title="Create a new feed"
        >
          <Sparkles className="w-5 h-5 text-purple-400" />
          <span className="text-sm font-medium hidden sm:inline">Create</span>
        </button>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <button
          onClick={onOpenApiKeyModal}
          className="hidden sm:block p-2 hover:bg-(--secondary-hover) rounded-full transition-colors"
          title="API Settings"
        >
          <Settings className="w-6 h-6" />
        </button>
       
        <UserProfile></UserProfile>
      </div>
    </div>
  );
}
