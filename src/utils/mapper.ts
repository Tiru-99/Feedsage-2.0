import { FeedItem , VideoProps } from "./types";
export function mapFeedItemToVideoProps(item: FeedItem): VideoProps {
  return {
    id: item.id.videoId,
    thumbnailUrl:
      item.snippet.thumbnails.high?.url ??
      item.snippet.thumbnails.medium?.url ??
      item.snippet.thumbnails.default?.url ??
      "",
    duration: item.duration,
    title: item.snippet.title,
    channelName: item.snippet.channelTitle,
    channelAvatarUrl: item.channelAvatarUrl,
    views: item.views,
    postedAt: item.snippet.publishTime,
  };
}