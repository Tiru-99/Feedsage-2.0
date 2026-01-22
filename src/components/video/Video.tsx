"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { ThumbsUp, ThumbsDown, Share2, MoreHorizontal } from "lucide-react";
import { useVideoMetadataStore } from "@/context/VideoContext";
import { FeedItem } from "@/utils/types";
import { formatDateDMY } from "@/utils/format";
import VideoError from "../VideoError";
import VideoPageSkeleton from "../skeletons/VideoPageSkeleton";

export default function VideoComponent({ id }: { id: string }) {
  const [video, setVideo] = useState<FeedItem>();
  const [error, setError] = useState<string | null>(null);
  const setVideoMetadata = useVideoMetadataStore((s) => s.setVideo);

  const fetchVideo = async () => {
    try {
      setError(null);
      const response = await axios.get("/api/video", {
        params: { videoId: id },
      });

      setVideo(response.data.video);
      setVideoMetadata({
        title: response.data?.video?.snippet.title,
        description: response.data?.video?.snippet.description,
      });
    } catch (err: any) {
      console.error("Failed to fetch video:", err);
     
       if (err?.response?.status === 429) {
         setError("YouTube API quota finished, consider changing API key");
         return;
       }
     
       setError(
         err?.response?.data?.message ||
         "This video is unavailable or restricted."
       );
    }
  };

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    fetchVideo().finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return <VideoPageSkeleton />;
  }

  if (error) {
    return (
      <VideoError
        title="Video unavailable"
        message={error}
        onRetry={fetchVideo}
      />
    );
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num?.toString() || "0";
  };

  return (
    <div className="min-h-screen w-full bg-[#0f0f0f] text-white font-sans">
      <div className="mx-auto max-w-[90vw] md:max-w-[80vw] lg:max-w-[60vw] px-4 sm:px-6 py-6">
        <div className="w-full rounded-xl overflow-hidden bg-black mb-8 md:mb-4">
          <div
            className="relative w-full mx-auto overflow-hidden sm:max-h-[70vh]"
            style={{
              aspectRatio: "16 / 9",
              maxWidth: "100%",
            }}
          >
            <iframe
              src={`https://www.youtube.com/embed/${id}`}
              title="YouTube video player"
              className="absolute inset-0 w-full h-full rounded-xl"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>

        {/* VIDEO INFO – title + channel row stay close to player */}
        <div className="space-y-4">
          {/* TITLE */}
          <h1 className="text-[1.35rem] font-semibold">
            {video?.snippet.title || "Loading..."}
          </h1>

          {/* CHANNEL + ACTIONS */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-[220px] flex-1">
              <img
                src={
                  video?.channelAvatarUrl || "https://via.placeholder.com/40"
                }
                alt={video?.snippet.channelTitle}
                className="w-10 h-10 rounded-full shrink-0 object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-[15px] leading-tight truncate">
                  {video?.snippet.channelTitle || "Channel Name"}
                </p>
                <p className="text-xs text-[#aaaaaa] mt-0.5">
                  {video?.channelSubscribers
                    ? formatNumber(video.channelSubscribers)
                    : "0"}{" "}
                  subscribers
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center rounded-full bg-[#272727] hover:bg-[#3f3f3f] overflow-hidden transition-colors">
                <button className="flex items-center gap-1.5 px-3.5 py-2 border-r border-[#3f3f3f]">
                  <ThumbsUp className="w-5 h-5" />
                  <span className="text-sm font-medium">
                    {video?.likes ? formatNumber(video.likes) : "0"}
                  </span>
                </button>
                <button className="px-3.5 py-2">
                  <ThumbsDown className="w-5 h-5" />
                </button>
              </div>

              <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#272727] hover:bg-[#3f3f3f] transition-colors">
                <Share2 className="w-5 h-5" />
                <span className="text-sm font-medium">Share</span>
              </button>

              <button className="p-2.5 rounded-full bg-[#272727] hover:bg-[#3f3f3f] transition-colors">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* DESCRIPTION BOX – pushed down much further like real YT (scroll to see) */}
        <div className="mt-12 md:mt-16 lg:mt-4 p-4 rounded-xl bg-[#272727] hover:bg-[#3f3f3f] transition-colors cursor-pointer">
          <div className="flex items-center gap-2 text-sm text-[#aaaaaa] mb-2">
            <span>
              {video?.views ? formatNumber(parseInt(video.views)) : "0"} views
            </span>
            <span>•</span>
            <span>
              {formatDateDMY(video?.snippet.publishTime!) || "Recently"}
            </span>
          </div>
          <p className="text-sm leading-6 text-[#f1f1f1] whitespace-pre-wrap line-clamp-4 md:line-clamp-6">
            {video?.snippet.description || "No description available."}
          </p>
        </div>
      </div>
    </div>
  );
}
