import { NextRequest, NextResponse } from "next/server";
import { getUserId } from "@/lib/checkUser";
import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { redisClient } from "@/lib/redis";
import { functionWrapper } from "@/utils/wrapper";


export async function POST(req: NextRequest) {
    const userId = await getUserId();
    const { prompt } = await req.json();

    if (!prompt) {
        return NextResponse.json({
            error: "prompt not provided"
        }, { status: 400 })
    }

    try {
        await db.update(user)
            .set({ prompt })
            .where(eq(user.id, userId));

        //invalidate cache
        await Promise.all([
            functionWrapper(() => redisClient.del(`feed:${userId}`)),
            functionWrapper(() => redisClient.del(`feed:${userId}:status`)),
        ]);

        return NextResponse.json({
            message: "Successfully stored the prompt",
            success: true
        }, { status: 200 });

    } catch (error) {
        console.error("Error while storing prompt", error);
        return NextResponse.json({
            message: "Something went wrong while storing prompt",
            success: false,
        }, { status: 500 })
    }

}

export async function GET(req: NextRequest) {
    const userId = await getUserId();
    try {
        const [row] = await db
            .select()
            .from(user)
            .where(eq(user.id, userId));

        if (!row || !row.prompt) {
            console.error("No prompt found , missing")
            return NextResponse.json({
                message: "Something went wrong while getting the prompt",
                success: false
            }, { status: 500 });
        }

        return NextResponse.json({
            message: "Succesfully fetched the prompt",
            prompt,
            success: true
        }, { status: 200 });
    } catch (error) {
        console.error("Something went wrong while fetching prompt" , error); 
        return NextResponse.json({
            message : "Something went wrong while getting prompt", 
            success : false
        } , { status : 500 });
    }

}