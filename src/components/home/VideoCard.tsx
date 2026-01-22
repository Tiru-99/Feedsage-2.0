"use client";

import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { formatViews } from "@/utils/format";
import { VideoProps } from "@/utils/types";
import { formatDateDMY } from "@/utils/format";


export default function VideoCard({ video }: { video: VideoProps }) {
  const router = useRouter();

  return (
    <div
      className="flex flex-col gap-3 group cursor-pointer
                 hover:bg-white/10 rounded-md p-2
                 transition-colors duration-200 ease-out"
      onClick={() => router.push(`/video/${video.id}`)}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video rounded-lg overflow-hidden">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-full h-full object-cover group-hover:bg-white/20 transition-transform duration-200"
        />
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-semibold px-1.5 py-0.5 rounded">
          {video.duration}
        </div>
      </div>

      {/* Info */}
      <div className="flex gap-3 items-start">
        {/* Channel Avatar */}
        <img
          src={video.channelAvatarUrl}
          alt={video.channelName}
          className="w-9 h-9 rounded-full object-cover mt-1 shrink-0"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/channel`);
          }}
        />

        <div className="flex flex-col">
          <h3
            className="text-sm font-medium text-white/[0.976]
                       line-clamp-2 
                       group-hover:text-white/90"
          >
            {video.title}
          </h3>

          <div
            className="text-xs text-gray-400 mt-1 hover:text-white flex items-center gap-1 w-fit"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/channel`);
            }}
          >
            {video.channelName}
            <CheckCircle2 className="w-3 h-3 fill-gray-500 text-black" />
          </div>

          <div className="text-xs text-gray-400 flex items-center">
            <span>{formatViews(video.views)} views</span>
            <span className="text-xs mx-1">•</span>
            <span>{formatDateDMY(video.postedAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
