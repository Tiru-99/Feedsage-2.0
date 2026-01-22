import { VideoProps } from "@/utils/types";
import { MoreVertical } from "lucide-react";
import { formatViews } from "@/utils/format"; 
import { formatDateDMY } from "@/utils/format";

export interface SearchVideoType extends VideoProps {
  description: string;
}

export default function VideoCard({ video }: { video: SearchVideoType }) {
  return (
    <div
      className="
        flex flex-col sm:flex-row
        w-full gap-3 sm:gap-4
        py-4 px-2
        hover:bg-[#1f1f1f]
        rounded-xl transition
      "
    >
      <div
        className="
          relative w-full
          sm:w-[320px] sm:h-[180px]
          aspect-video
          flex-shrink-0
          rounded-xl overflow-hidden
          bg-neutral-800
        "
      >
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-full h-full object-cover"
        />
        {video.duration && (
          <span className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-xs px-1.5 py-[1px] rounded">
            {video.duration}
          </span>
        )}
      </div>

      <div className="flex flex-1 justify-between gap-2 min-w-0">
        {/* Text - min-w-0 allows text truncation to work properly */}
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          {/* Title */}
          <h3 className="text-sm sm:text-[16px] font-normal text-white leading-snug line-clamp-2">
            {video.title}
          </h3>

          {/* Meta */}
          <p className="text-xs sm:text-xs text-neutral-400">
            {formatViews(video.views)} views • {formatDateDMY(video.postedAt)}
          </p>

          {/* Channel */}
          <div className="flex items-center gap-2 mt-1 sm:mt-2">
            <img
              src={video.channelAvatarUrl}
              alt={video.channelName}
              className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex-shrink-0"
            />
            <span className="text-xs sm:text-xs text-neutral-400 hover:text-white truncate">
              {video.channelName}
            </span>
          </div>

          {/* Description (hide on mobile) */}
          <p className="hidden sm:block text-xs text-neutral-400 line-clamp-2 mt-2">
            {video.description}
          </p>
        </div>

        {/* More menu */}
        <div className="pt-1 flex-shrink-0">
          <MoreVertical className="text-neutral-400 w-5 h-5 cursor-pointer hover:text-white transition" />
        </div>
      </div>
    </div>
  );
}