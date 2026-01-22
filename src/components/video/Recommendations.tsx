"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { mapFeedItemToVideoProps } from "@/utils/mapper";
import VideoCard from "../home/VideoCard";
import VideoCardSkeleton from "../skeletons/VideoCardSkeleton";
import { useVideoMetadataStore } from "@/context/VideoContext";
import { FeedItem } from "@/utils/types";

export default function Recommendations() {
  const videoMetaData = useVideoMetadataStore((s) => s.video);

  const [videos, setVideos] = useState<FeedItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!videoMetaData) return;

    const fetchRecommendations = async () => {
      setIsLoading(true);
      setError(null); 

      try {
        const response = await axios.get("/api/recommendations", {
          params: {
            title: videoMetaData.title,
            description: videoMetaData.description,
          },
        });

        setVideos(response.data.videos ?? []);
      } catch (err: any) {
        console.error(
          "Something went wrong while fetching recommendations",
          err
        );

        setVideos([]); 

        if (err?.response?.status === 410) {
          setError("Your feed has expired. Please regenerate your feed.");
          return;
        }

        setError(
          err?.response?.data?.message ||
            "Failed to fetch recommendations. Please try again later."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [videoMetaData]);


  if (isLoading) {
    return (
      <div className="w-full max-w-[1280px] mx-auto p-4 md:p-6 pt-0">
        <h3 className="text-xl font-bold mb-4">Recommended for you</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <VideoCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1280px] mx-auto p-4 md:p-6 pt-0">
      <h3 className="text-xl font-bold mb-4">Recommended for you</h3>


      {error && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-sm font-medium text-red-400">
            {error}
          </p>
          <p className="mt-1 text-xs text-white/50 max-w-sm">
            If the issue persists, try refreshing or regenerating your feed.
          </p>
        </div>
      )}


      {!error && videos.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-sm text-white/80 font-medium">
            No recommendations available
          </p>
          <p className="mt-1 text-xs text-white/50 max-w-sm">
            We couldn’t find recommendations right now.
          </p>
        </div>
      )}

      {!error && videos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
          {videos.map((video) => (
            <VideoCard
              key={video.id.videoId}
              video={mapFeedItemToVideoProps(video)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
