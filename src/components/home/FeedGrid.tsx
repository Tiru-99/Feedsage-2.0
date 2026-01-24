"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import VideoCard from "./VideoCard";
import VideoCardSkeleton from "../skeletons/VideoCardSkeleton";
import { VideoProps } from "@/utils/types";
import { usePromptSubmit } from "@/context/PromptSubmitContext";
import ErrorDisplay from "@/components/ui/ErrorDisplay";
import { AlertCircle, Ban, Clock, KeyRound } from "lucide-react";
import Link from "next/link";

type FeedStatus =
  | "PENDING"
  | "COMPLETED"
  | "ERROR"
  | "EXPIRED"
  | "NSFW"
  | "NO_API_KEY"
  | "YOUTUBE_RATE_LIMIT";

interface FeedItem {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    channelTitle: string;
    thumbnails: {
      high?: { url: string };
      medium?: { url: string };
      default?: { url: string };
    };
    publishTime: string;
  };
  finalScore: number;
  views: string;
  duration: string;
  channelAvatarUrl: string;
  likes: number;
  channelSubscribers: number;
}

interface FeedEvent {
  status: FeedStatus;
  message?: string;
  feed?: FeedItem[];
}

export default function FeedGrid() {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [feedStatus, setFeedStatus] = useState<FeedStatus>("PENDING");
  const { promptChanged } = usePromptSubmit();
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    const es = new EventSource("/api/feed");
    eventSourceRef.current = es;

    es.onopen = () => {
      console.log("[SSE] connected");
    };

    es.onmessage = (event) => {
      try {
        const data: FeedEvent = JSON.parse(event.data);
        if (!data?.status) return;

        switch (data.status) {
          case "PENDING":
            setFeedStatus("PENDING");
            setIsLoading(true);
            setMessage("Generating your personalized feed...");
            break;

          case "COMPLETED":
            setFeedStatus("COMPLETED");
            setIsLoading(false);
            setFeed(data.feed ?? []);
            setMessage("Feed ready");
            es.close();
            break;

          case "NSFW":
            setFeedStatus("NSFW");
            setIsLoading(false);
            setMessage("NSFW prompt detected.");
            es.close();
            break;

          case "YOUTUBE_RATE_LIMIT":
            setFeedStatus("YOUTUBE_RATE_LIMIT");
            setIsLoading(false);
            setMessage("Youtube api limit over, please change your api key");
            es.close();
            break;

          case "EXPIRED":
            setFeedStatus("EXPIRED");
            setIsLoading(false);
            setMessage("Feed expired");
            es.close();
            break;

          case "NO_API_KEY":
            setFeedStatus("NO_API_KEY");
            setIsLoading(false);
            setMessage("YouTube API key not found");
            es.close();
            break;

          case "ERROR":
            setFeedStatus("ERROR");
            setIsLoading(false);
            setMessage("Failed to generate feed");
            es.close();
            break;
        }
      } catch (err) {
        console.error("[SSE] parse error:", err);
        setIsLoading(false);
        setMessage("Invalid feed response");
      }
    };

    es.onerror = (err) => {
      console.error("[SSE] error:", err);
      setIsLoading(false);
      setMessage("Connection lost");
      es.close();
    };

    return () => {
      es.close();
    };
  }, [promptChanged]);

  //rank feed bruh
  const rankedVideos: VideoProps[] = useMemo(() => {
    if (!feed.length) return [];

    return [...feed]
      .sort((a, b) => b.finalScore - a.finalScore)
      .slice(0, 30)
      .map((item) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnailUrl:
          item.snippet.thumbnails.high?.url ||
          item.snippet.thumbnails.medium?.url ||
          item.snippet.thumbnails.default?.url ||
          "",
        channelName: item.snippet.channelTitle,
        finalScore: item.finalScore,
        duration: item.duration,
        channelAvatarUrl: item.channelAvatarUrl,
        views: item.views,
        postedAt: new Date(item.snippet.publishTime).toLocaleDateString(),
      }));
  }, [feed]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-6 pt-2 pb-10">
        {Array.from({ length: 12 }).map((_, i) => (
          <VideoCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (feedStatus === "NSFW") {
    return (
      <ErrorDisplay
        title="NSFW Filter Triggered"
        message="Your prompt triggered our safety filters. Please try again with a different prompt."
        icon={<Ban className="w-8 h-8 text-red-500" />}
      />
    );
  }

  if (feedStatus === "NO_API_KEY") {
    return (
      <ErrorDisplay
        title="No Youtube api key found"
        message="Please enter the youtube api key from the settings icon on the navbar"
        icon={<KeyRound className="w-8 h-8 text-red-500" />}
      />
    );
  }

  if (feedStatus === "EXPIRED") {
    return (
      <ErrorDisplay
        title="Feed doesn't exist"
        message="This feed has expired or doesn't exist. Open the prompt modal and generate a new feed."
        icon={<Clock className="w-8 h-8 text-orange-500" />}
      />
    );
  }

  if (feedStatus === "ERROR") {
    return (
      <ErrorDisplay
        title="Generation Failed"
        message={message || "Something went wrong while generating your feed."}
        icon={<AlertCircle className="w-8 h-8 text-red-500" />}
      />
    );
  }

  if (feedStatus === "COMPLETED" && !isLoading && rankedVideos.length === 0) {
    return (
      <ErrorDisplay
        title="No Videos Found"
        message="Nothing to show. Open the prompt modal and generate a new feed."
        icon={<AlertCircle className="w-8 h-8 text-gray-400" />}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-6 pt-2 pb-10">
      {rankedVideos.map((video, index) => (
        <Link
          key={`${video.id}-${index}`}
          href={`/video/${video.id}`}
          className="block"
        >
          <VideoCard video={video} />
        </Link>
      ))}
    </div>
  );
}
