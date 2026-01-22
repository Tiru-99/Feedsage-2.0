export interface FeedItem {
  id: { videoId: string };
  snippet: {
    title: string;
    channelTitle: string;
    thumbnails: {
      high?: { url: string };
      medium?: { url: string };
      default?: { url: string };
    };
    publishTime: string;
    description: string;
  };
  finalScore: number;
  views: string;
  duration: string;
  channelAvatarUrl: string;
  likes: number;
  channelSubscribers: number;
}

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

// ---- Search API ----
export interface YouTubeSearchResponse {
  items: YouTubeSearchItem[];
}

export interface YouTubeSearchItem {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    description: string;
    publishedAt: string;
    channelId: string;
    channelTitle: string;
    thumbnails: {
      default: { url: string };
      medium: { url: string };
      high: { url: string };
    };
  };
}

// ---- Videos API ----
export interface YouTubeVideosResponse {
  items: YouTubeVideoItem[];
}

export interface YouTubeVideoItem {
  id: string;
  contentDetails: {
    duration: string;
  };
  statistics: {
    viewCount: string;
  };
}

// ---- Channels API ----
export interface YouTubeChannelsResponse {
  items: YouTubeChannelItem[];
}

export interface YouTubeChannelItem {
  id: string;
  snippet: {
    thumbnails: {
      default: { url: string };
    };
  };
  statistics: {
    subscriberCount: string;
  };
}

