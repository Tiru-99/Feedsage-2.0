"use client";
import { useState, useEffect } from "react";
import VideoCard from "./VideoCard";
import SearchVideoCardSkeleton from "../skeletons/SearchVideoCardSkeleton";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";
import { VideoProps } from "@/utils/types";
import { useToast } from "@/components/ui/Toast";

export interface SearchVideoType extends VideoProps {
  description: string;
}

export default function Results() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  const [videos, setVideos] = useState<SearchVideoType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFocusWarning, setShowFocusWarning] = useState(false);

  useEffect(() => {
    const q = searchParams.get("q");
    if (!q) {
      toast.error("Query not found");
      return;
    }

    setIsLoading(true);

    axios
      .get("/api/search", {
        params: { search: q },
      })
      .then((res) => {
        setVideos(res.data.results);
      })
      .catch((err) => {
        const code = err.response?.data?.code;

        if (code === "INTENT_MISMATCH") {
          setShowFocusWarning(true);
          return;
        }
        
        if(code === "YOUTUBE_RATE_LIMIT"){
          toast.error("Youtube rate limit over !!");
          return ; 
        }
        
        if( code === "GEMINI_RATE_LIMIT"){
          console.log("Gemini rate limit over !!!");
          toast.error("Failed to fetch results , this is our fault , please contact the developer")
          return; 
        }

        console.error("Something went wrong while fetching data", err);
        toast.error("Failed to fetch results");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [searchParams]);

  return (
    <>

      {showFocusWarning && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-[#181818] rounded-xl p-6 text-center space-y-4">
            <h2 className="text-xl font-semibold text-white">
              What are you doing, bro?
            </h2>

            <p className="text-sm text-[#aaaaaa] leading-relaxed">
              You promised yourself you’d stay focused.
              <br />
              This search doesn’t match that goal.
            </p>

            <div className="flex gap-3 justify-center pt-2">
              <button
                onClick={() => {
                  setShowFocusWarning(false);
                  router.back();
                }}
                className="px-4 py-2 rounded-full bg-white text-black text-sm font-medium hover:bg-[#f1f1f1]"
              >
                Stay Focused
              </button>

              <button
                onClick={() => {
                  setShowFocusWarning(false);
                }}
                className="px-4 py-2 rounded-full bg-[#272727] text-white text-sm hover:bg-[#3f3f3f]"
              >
                Change Search
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔹 RESULTS */}
      <div className="bg-[#0f0f0f] min-h-screen flex justify-center">
        <div className="w-full max-w-full md:max-w-[70vw] px-6">
          {isLoading && (
            <div className="flex flex-col gap-4 mt-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <SearchVideoCardSkeleton key={i} />
              ))}
            </div>
          )}

          {!isLoading &&
            videos.map((video) => (
              <div
                key={video.id}
                onClick={() => router.push(`/video/${video.id}`)}
              >
                <VideoCard video={video} />
              </div>
            ))}
        </div>
      </div>
    </>
  );
}
