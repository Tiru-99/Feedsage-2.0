import { NextResponse, NextRequest } from "next/server";
import { getUserId } from "@/lib/checkUser";
import axios from "axios";
import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { decrypt } from "@/utils/encrypt";
import { getIntent } from "@/utils/getIntent";
import { model } from "@/lib/ai";

import {
  YouTubeSearchResponse,
  YouTubeVideosResponse,
  YouTubeChannelsResponse,
} from "@/utils/types";

export async function GET(req: NextRequest) {
  const userId = await getUserId();
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search");

  if (!search) {
    return NextResponse.json(
      { success: false, message: "Search query missing" },
      { status: 400 },
    );
  }

  try {
    const [row] = await db.select().from(user).where(eq(user.id, userId));

    if (!row?.youtubeApiKey) {
      console.log("No youtube api key found mf....!");
      return NextResponse.json(
        { success: false, message: "YouTube API key not found" },
        { status: 500 },
      );
    }

    if (!row?.prompt) {
      console.log("No prompt found in the database bro !! ");
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a prompt to get started",
          code: "NO_PROMPT",
        },
        { status: 400 },
      );
    }

    const API_KEY = await decrypt(row.youtubeApiKey);

    if (!API_KEY || typeof API_KEY !== "string" || API_KEY === "{}") {
      return NextResponse.json(
        {
          success: false,
          message: "Youtube api key not found !!",
          code: "YT_NO_API_KEY",
        },
        { status: 400 },
      );
    }
    // intent check
    const intent = await getIntent(model, search, row.prompt);

    if (intent === "NO") {
      return NextResponse.json(
        {
          success: false,
          message: "Prompt and search context doesn't match",
          code: "INTENT_MISMATCH",
        },
        { status: 400 },
      );
    }

    // SEARCH API
    const searchRes = await axios.get<YouTubeSearchResponse>(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          key: API_KEY,
          q: search,
          part: "snippet",
          type: "video",
          maxResults: 40,
          safeSearch: "strict",
        },
      },
    );

    const searchItems = searchRes.data.items;

    if (!searchItems.length) {
      return NextResponse.json({ success: true, results: [] }, { status: 200 });
    }

    const videoIds = searchItems.map((i) => i.id.videoId).join(",");
    const channelIds = [
      ...new Set(searchItems.map((i) => i.snippet.channelId)),
    ].join(",");

    // VIDEOS API (duration + views)
    const videoRes = await axios.get<YouTubeVideosResponse>(
      "https://www.googleapis.com/youtube/v3/videos",
      {
        params: {
          key: API_KEY,
          part: "contentDetails,statistics",
          id: videoIds,
        },
      },
    );

    // CHANNELS API
    const channelRes = await axios.get<YouTubeChannelsResponse>(
      "https://www.googleapis.com/youtube/v3/channels",
      {
        params: {
          key: API_KEY,
          part: "snippet,statistics",
          id: channelIds,
        },
      },
    );

    // lookup maps
    const videoMap = new Map(
      videoRes.data.items.map((v) => [
        v.id,
        {
          duration: v.contentDetails.duration,
          views: v.statistics.viewCount,
        },
      ]),
    );

    const channelMap = new Map(
      channelRes.data.items.map((c) => [
        c.id,
        {
          avatar: c.snippet.thumbnails.default.url,
          subscribers: c.statistics.subscriberCount,
        },
      ]),
    );

    // FILTER SHORTS (< 90s) + MERGE
    const results = searchItems
      .filter((item) => {
        const video = videoMap.get(item.id.videoId);
        if (!video?.duration) return false;

        const durationInSeconds = isoDurationToSeconds(video.duration);

        // remove YouTube Shorts
        return durationInSeconds >= 90;
      })
      .map((item) => {
        const video = videoMap.get(item.id.videoId)!;
        const channel = channelMap.get(item.snippet.channelId);

        return {
          id: item.id.videoId,
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnailUrl: item.snippet.thumbnails.high.url,
          postedAt: item.snippet.publishedAt,
          channelName: item.snippet.channelTitle,
          channelAvatarUrl: channel?.avatar ?? null,
          channelSubscribers: channel?.subscribers ?? null,
          views: video.views ?? null,
          duration: formatYouTubeDuration(video.duration),
        };
      });

    return NextResponse.json({ success: true, results }, { status: 200 });
  } catch (error: any) {
    console.error("API error:", error);
    //catch youtube api error
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;

      if (status === 429) {
        return NextResponse.json(
          {
            success: false,
            code: "YOUTUBE_RATE_LIMIT",
            message: "YouTube API rate limit exceeded",
          },
          { status: 429 },
        );
      }

      return NextResponse.json(
        {
          success: false,
          code: "YOUTUBE_ERROR",
          message: "YouTube API failed",
        },
        { status: status ?? 500 },
      );
    }

    // catch gemini error
    if (
      error?.name === "GoogleGenerativeAIError" ||
      error?.message?.includes("generativelanguage.googleapis.com")
    ) {
      if (
        error.message.includes("429") ||
        error.message.toLowerCase().includes("quota")
      ) {
        return NextResponse.json(
          {
            success: false,
            code: "GEMINI_RATE_LIMIT",
            message: "AI quota exceeded. Try again shortly.",
          },
          { status: 429 },
        );
      }

      return NextResponse.json(
        {
          success: false,
          code: "GEMINI_ERROR",
          message: "AI service failed",
        },
        { status: 502 },
      );
    }

    //fallback
    return NextResponse.json(
      {
        success: false,
        error: "INTERNAL_ERROR",
        message: "Something went wrong",
      },
      { status: 500 },
    );
  }
}

/* ---------------- HELPERS ---------------- */

function isoDurationToSeconds(iso: string): number {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);

  if (!match) return 0;

  const hours = Number(match[1] || 0);
  const minutes = Number(match[2] || 0);
  const seconds = Number(match[3] || 0);

  return hours * 3600 + minutes * 60 + seconds;
}

export function formatYouTubeDuration(isoDuration: string): string {
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);

  if (!match) return "0:00";

  const hours = Number(match[1] || 0);
  const minutes = Number(match[2] || 0);
  const seconds = Number(match[3] || 0);

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(
      seconds,
    ).padStart(2, "0")}`;
  }

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}
