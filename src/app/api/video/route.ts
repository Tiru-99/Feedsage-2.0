import { NextRequest, NextResponse } from "next/server";
import { getCompressedJson } from "@/lib/redis";
import { decrypt } from "@/utils/encrypt";
import { db } from "@/lib/db";
import { getUserId } from "@/lib/checkUser";
import { user } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

interface FeedItem {
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
  };
  finalScore: number;
  views: string;
  duration: string;
  channelAvatarUrl: string;
  likes: number;
  channelSubscribers: number;
}

const parseISODuration = (duration = "PT0S") => {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  const h = Number(match?.[1] ?? 0);
  const m = Number(match?.[2] ?? 0);
  const s = Number(match?.[3] ?? 0);

  return h > 0
    ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
    : `${m}:${String(s).padStart(2, "0")}`;
};

const isValidYouTubeVideoId = (id: string) => {
  return /^[a-zA-Z0-9_-]{11}$/.test(id);
};

//TODO : add youtube quota exceeded error handling
export async function GET(req: NextRequest) {
  console.log("Coming to the backend part");
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(req.url);
    const videoId = searchParams.get("videoId");

    if (!videoId) {
      return NextResponse.json(
        { success: false, message: "videoId required" },
        { status: 400 },
      );
    }

    if (!isValidYouTubeVideoId(videoId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid YouTube video ID format",
        },
        { status: 400 },
      );
    }

    //check in cache
    const cachedFeed = await getCompressedJson(userId);
    console.log("Before cache log ");
    if (cachedFeed) {
      console.log("coming into the cached part");
      const parsed: FeedItem[] = cachedFeed;
      const cachedVideo = parsed.find((v) => v.id.videoId === videoId);

      if (cachedVideo) {
        return NextResponse.json({
          success: true,
          source: "cache",
          video: cachedVideo,
        });
      }
    }

    const [userRow] = await db
      .select({ youtubeApiKey: user.youtubeApiKey })
      .from(user)
      .where(eq(user.id, userId));

    if (!userRow?.youtubeApiKey) {
      return NextResponse.json(
        {
          success: false,
          message: "User has no YouTube API key configured",
        },
        { status: 400 },
      );
    }

    const apiKey = await decrypt(userRow.youtubeApiKey);

    if (!apiKey) {
      console.error("Api key not found in the db");
      return NextResponse.json(
        {
          message: "Api key not found or either it is invalid",
          success: false,
        },
        { status: 400 },
      );
    }

    const videoRes = await fetch(
      "https://www.googleapis.com/youtube/v3/videos?" +
        new URLSearchParams({
          part: "snippet,statistics,contentDetails",
          id: videoId,
          key: apiKey as string,
        }),
    );

    const videoJson = await videoRes.json();
    const video = videoJson.items?.[0];

    if (!video) {
      return NextResponse.json(
        { success: false, message: "Video not found" },
        { status: 404 },
      );
    }

    const channelRes = await fetch(
      "https://www.googleapis.com/youtube/v3/channels?" +
        new URLSearchParams({
          part: "snippet,statistics",
          id: video.snippet.channelId,
          key: apiKey as string,
        }),
    );

    const channelJson = await channelRes.json();
    const channel = channelJson.items?.[0];

    const enriched: FeedItem = {
      id: { videoId },
      snippet: {
        title: video.snippet.title,
        channelTitle: video.snippet.channelTitle,
        thumbnails: video.snippet.thumbnails,
        publishTime: video.snippet.publishedAt,
      },
      finalScore: 0,
      views: video.statistics?.viewCount ?? "0",
      likes: Number(video.statistics?.likeCount ?? 0),
      duration: parseISODuration(video.contentDetails?.duration),
      channelAvatarUrl: channel?.snippet?.thumbnails?.default?.url ?? "",
      channelSubscribers: Number(channel?.statistics?.subscriberCount ?? 0),
    };

    return NextResponse.json({
      success: true,
      source: "youtube",
      video: enriched,
    });
  } catch (err: any) {
    console.error("GET /api/video error:", err);
    const status =
      err?.status || err?.statusCode || err?.response?.status || 500;

    if (status === 429) {
      console.log("YouTube API limit over");
      return NextResponse.json(
        {
          success: false,
          message: "YouTube API limit exceeded",
        },
        { status: 429 },
      );
    }

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
