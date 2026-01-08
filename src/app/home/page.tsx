"use client";

import PageLayout from "@/components/PageLayout";
import FeedGrid from "@/components/FeedGrid";
import { VideoProps } from "@/components/VideoCard";

const MOCK_VIDEOS: VideoProps[] = [
  {
    id: "1",
    thumbnailUrl: "https://images.unsplash.com/photo-1593789382576-8c2405d47156?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    duration: "10:05",
    title: "Building a YouTube Clone with Next.js 14 and Tailwind CSS in 2025",
    channelName: "Code Master",
    channelAvatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    views: "1.2M",
    postedAt: "2 days ago",
  },
  {
    id: "2",
    thumbnailUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    duration: "4:20",
    title: "Top 10 VS Code Extensions You Need in 2025",
    channelName: "Dev Tips",
    channelAvatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    views: "450K",
    postedAt: "5 hours ago",
  },
  {
    id: "3",
    thumbnailUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    duration: "25:30",
    title: "Complete Guide to System Design - Designing a Scalable Application",
    channelName: "Tech Explained",
    channelAvatarUrl: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    views: "2.8M",
    postedAt: "1 year ago",
  },
  {
    id: "4",
    thumbnailUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    duration: "15:45",
    title: "Why Typescript is better than Javascript? - The Ultimate Comparison",
    channelName: "Frontend Daily",
    channelAvatarUrl: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    views: "120K",
    postedAt: "3 weeks ago",
  },
  {
    id: "5",
    thumbnailUrl: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    duration: "8:12",
    title: "AI in 2025: What you need to know about DeepMind's new agents",
    channelName: "AI Research",
    channelAvatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    views: "900K",
    postedAt: "1 day ago",
  },
  {
    id: "6",
    thumbnailUrl: "https://images.unsplash.com/photo-1555421689-d68471e189f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    duration: "32:10",
    title: "Learn Rust in 30 Minutes",
    channelName: "System Programming",
    channelAvatarUrl: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    views: "34K",
    postedAt: "10 hours ago",
  },
  {
    id: "7",
    thumbnailUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    duration: "12:55",
    title: "Next Level Gameplay - Elden Ring DLC First Look",
    channelName: "GamerHub",
    channelAvatarUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    views: "5.5M",
    postedAt: "1 week ago",
  },
  {
    id: "8",
    thumbnailUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    duration: "58:00",
    title: "Lo-Fi Beats to Relax/Study to - 24/7 Radio",
    channelName: "Chill Vibes",
    channelAvatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    views: "22K watching",
    postedAt: "LIVE",
  },
  {
    id: "9",
    thumbnailUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    duration: "10:05",
    title: "Building an Agent from scratch",
    channelName: "Agent Master",
    channelAvatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    views: "1.2M",
    postedAt: "2 days ago",
  },
  {
    id: "10",
    thumbnailUrl: "https://images.unsplash.com/photo-1629904853716-617fd7592182?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    duration: "4:20",
    title: "Top 10 VS Code Themes 2025",
    channelName: "UI Tips",
    channelAvatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    views: "450K",
    postedAt: "5 hours ago",
  },
  {
    id: "11",
    thumbnailUrl: "https://images.unsplash.com/photo-1607705703571-c5a8695f18f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    duration: "25:30",
    title: "How to actually learn",
    channelName: "Mind Explained",
    channelAvatarUrl: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    views: "2.8M",
    postedAt: "1 year ago",
  },
  {
    id: "12",
    thumbnailUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    duration: "15:45",
    title: "Why security is crucial",
    channelName: "Cyber Daily",
    channelAvatarUrl: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    views: "120K",
    postedAt: "3 weeks ago",
  }
];

export default function Home() {
  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto w-full">
        <FeedGrid videos={MOCK_VIDEOS} />
      </div>
    </PageLayout>
  );
}
