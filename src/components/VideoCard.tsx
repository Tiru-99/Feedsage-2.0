import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export interface VideoProps {
    id: string;
    thumbnailUrl: string;
    duration: string;
    title: string;
    channelName: string;
    channelAvatarUrl: string;
    views: string;
    postedAt: string;
}

export default function VideoCard({ video }: { video: VideoProps }) {
    return (
        <div className="flex flex-col gap-3 group cursor-pointer">
            {/* Thumbnail */}
            <div className="relative aspect-video rounded-xl overflow-hidden">
                <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-semibold px-1.5 py-0.5 rounded">
                    {video.duration}
                </div>
            </div>

            {/* Info */}
            <div className="flex gap-3 items-start">
                <Link href={`/channel`} className="shrink-0">
                    <img
                        src={video.channelAvatarUrl}
                        alt={video.channelName}
                        className="w-9 h-9 rounded-full object-cover mt-1"
                    />
                </Link>
                <div className="flex flex-col">
                    <h3 className="text-base font-bold line-clamp-2 leading-tight group-hover:text-white/90">
                        {video.title}
                    </h3>
                    <Link href={`/channel`} className="text-sm text-gray-400 mt-1 hover:text-white flex items-center gap-1">
                        {video.channelName}
                        <CheckCircle2 className="w-3 h-3 fill-gray-500 text-black" />
                    </Link>
                    <div className="text-sm text-gray-400 flex items-center">
                        <span>{video.views} views</span>
                        <span className="text-xs mx-1">•</span>
                        <span>{video.postedAt}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
