import { getUserId } from "@/lib/checkUser";
import { NextRequest, NextResponse } from "next/server";
import { encrypt } from "@/utils/encrypt";
import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const userId = await getUserId();
  const { youtubeApiKey } = await req.json();

  if (!youtubeApiKey) {
    console.warn("No api key provided!");
    return NextResponse.json(
      {
        message: "No api key provided ",
      },
      { status: 400 },
    );
  }

  try {
    const isValid = await validateYouTubeApiKey(youtubeApiKey);

    if (!isValid) {
      console.log("Api key is not valid");
      return NextResponse.json(
        {
          success: false,
          message: "Invalid YouTube API key",
        },
        { status: 400 },
      );
    }

    //encrypt youtube api key
    const encryptedApiKey = await encrypt(youtubeApiKey);
    await db
      .update(user)
      .set({
        youtubeApiKey: encryptedApiKey,
      })
      .where(eq(user.id, userId));

    return NextResponse.json(
      {
        message: "Api key set successfully",
        success: true,
      },
      { status: 200 },
    );
  } catch (error) {
    console.log("Something went wrong while storing the key", error);
    return NextResponse.json(
      {
        message: "Something went wrong while storing key",
        success: false,
      },
      { status: 500 },
    );
  }
}

async function validateYouTubeApiKey(apiKey: string): Promise<boolean> {
  const url = new URL("https://www.googleapis.com/youtube/v3/channels");
  url.searchParams.set("part", "snippet");
  url.searchParams.set("id", "UC_x5XG1OV2P6uZZ5FSM9Ttw"); // Google Devs
  url.searchParams.set("key", apiKey);

  const res = await fetch(url.toString());

  return res.ok;
}
