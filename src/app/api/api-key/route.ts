import { getUserId } from "@/lib/checkUser";
import { NextRequest, NextResponse } from "next/server";
import { encrypt } from "@/utils/encrypt";
import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export default async function POST(req: NextRequest) {
    const userId = await getUserId();
    const { youtubeApiKey } = await req.json();

    if (!youtubeApiKey) {
        console.warn("No api key provided!");
        return NextResponse.json({
            message: "No api key provided "
        }, { status: 400 });
    }

    try {
        //encrypt youtube api key 
        const encryptedApiKey = await encrypt(youtubeApiKey);
        await db.update(user)
            .set({
                youtubeApiKey: encryptedApiKey
            })
            .where(eq(user.id, userId))
    } catch (error) {
        console.log("Something went wrong while storing the key", error);
        return NextResponse.json({
            message: "Something went wrong while storing key",
            success: false
        }, { status: 500 })
    }
}