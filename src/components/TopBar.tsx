import { Menu, Search, Mic, Video, Bell, User, MonitorPlay, Sparkles, Settings } from "lucide-react";
import Link from 'next/link';

interface TopBarProps {
  onOpenFeedModal: () => void;
  onOpenApiKeyModal: () => void;
}

export default function TopBar({ onOpenFeedModal, onOpenApiKeyModal }: TopBarProps) {
  return (
    <div className="flex justify-between items-center px-4 h-14 sticky top-0 bg-(--background) z-50">
      <div className="flex items-center gap-4">
        
        <Link href="/" className="flex items-center gap-1">
          <div className="text-red-600">
            <MonitorPlay className="w-8 h-8 fill-red-600 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tighter hidden sm:block">Feedsage</span>
        </Link>
      </div>

      <div className="hidden sm:flex flex-1 max-w-180 items-center gap-4 ml-10">
        <div className="flex flex-1 items-center">
          <div className="flex flex-1 items-center bg-(--background) border border-(--border) rounded-l-full ml-8 focus-within:border-blue-500 shadow-inner px-4 py-0 pl-5">
            <div className="flex-1 flex" >
              <input
                type="text"
                placeholder="Search"
                className="w-full bg-transparent outline-none py-2"
              />
            </div>
          </div>
          <button className="bg-(--secondary) hover:bg-(--secondary-hover) border border-l-0 border-(--border) rounded-r-full px-5 py-2 transition-colors">
            <Search className="w-5 h-5" />
          </button>
        </div>
        <button
          onClick={onOpenFeedModal}
          className="p-2 bg-(--secondary) hover:bg-(--secondary-hover) rounded-full transition-colors tooltip flex items-center gap-2 px-4"
          title="Create a new feed"
        >
          <Sparkles className="w-5 h-5 text-purple-400" />
          <span className="text-sm font-medium">Create</span>
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
        <button className="p-2 hover:bg-(--secondary-hover) rounded-full transition-colors relative">
          <Bell className="w-6 h-6" />
          <span className="absolute top-1 right-1 bg-red-600 text-xs rounded-full px-1 border-2 border-(--background)">9+</span>
        </button>
        <button className="p-1 hover:bg-(--secondary-hover) rounded-full transition-colors">
          <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-sm font-medium">
            T
          </div>
        </button>
      </div>
    </div>
  );
}
