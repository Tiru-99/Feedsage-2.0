import VideoCard, { VideoProps } from "./VideoCard";

export default function FeedGrid({ videos }: { videos: VideoProps[] }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-6 pt-2 pb-10">
            {videos.map((video) => (
                <VideoCard key={video.id} video={video} />
            ))}
        </div>
    );
}
