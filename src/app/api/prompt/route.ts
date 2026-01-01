import { NextRequest, NextResponse } from "next/server";
import { getUserId } from "@/lib/checkUser";
import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";
import { eq } from "drizzle-orm";


export default async function POST(req: NextRequest) {
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
        
    } catch (error) {
        console.error("Error while storing prompt" , error); 
        return NextResponse.json({
            message : "Something went wrong while storing prompt", 
            success : false , 
        } , { status : 500 })
    }

}