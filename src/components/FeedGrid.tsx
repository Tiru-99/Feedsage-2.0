"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import VideoCard, { VideoProps } from "./VideoCard";
import { usePromptSubmit } from "@/context/PromptSubmitContext";

type FeedStatus = "PENDING" | "COMPLETED" | "ERROR";

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
}


interface FeedEvent {
    status: FeedStatus;
    message?: string;
    feed?: FeedItem[];
}

export default function FeedGrid({ videos }: { videos: VideoProps[] }) {
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [feed, setFeed] = useState<FeedItem[]>([]);
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
                        setIsLoading(true);
                        setMessage("Generating your personalized feed...");
                        break;

                    case "COMPLETED":
                        setIsLoading(false);
                        setFeed(data.feed ?? []);
                        setMessage("Feed ready");
                        es.close();
                        break;

                    case "ERROR":
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

    /**
     * Rank feed on frontend
     * - sort by finalScore desc
     * - take top 30
     * - map to VideoProps
     */
    const rankedVideos: VideoProps[] = useMemo(() => {
        if (!feed.length) return videos;

        return [...feed] // avoid mutating state
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

               
                duration: item.duration,
                channelAvatarUrl: item.channelAvatarUrl,
                views: item.views,
                postedAt: new Date(item.snippet.publishTime).toLocaleDateString(),
            }));
    }, [feed, videos]);



    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <div className="animate-spin h-10 w-10 rounded-full border-4 border-gray-300 border-t-black mb-4" />
                <p className="text-sm text-gray-500">{message}</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-6 pt-2 pb-10">
            {rankedVideos.map((video, index) => (
                <VideoCard key={`${video.id}-${index}`} video={video} />
            ))}
        </div>
    );
}
