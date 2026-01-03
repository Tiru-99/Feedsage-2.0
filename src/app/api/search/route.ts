import { NextResponse, NextRequest } from "next/server";
import { getUserId } from "@/lib/checkUser";
import axios from "axios";
import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { success } from "better-auth";

export default async function GET(req: NextRequest) {
    const userId = await getUserId();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");

    try {
        //get prompt from db 
        const [row] = await db
            .select()
            .from(user)
            .where(eq(user.id, userId));

        if (!row || !row.prompt) {
            return NextResponse.json({
                message: "No prompt found , server error",
                success: false
            }, { status: 500 });
        }

        //compute similarity score between these two  
        const { data } = await axios.get(`${process.env.WORKER_URL}/generate/scores`, {
            params: {
                search,
                prompt: row.prompt
            }
        });

        const { score , success } = data;

        if (!score || success === false) {
            return NextResponse.json({
                message: "Didn't get the score",
                success: false
            }, { status: 500 })
        }

        return NextResponse.json({
            message: "Successfully calculate the score",
            score: score
        }, { status: 200 });
        
    } catch (error) {
        console.error("Something went wrong while getting the score" , error); 
        return NextResponse.json({
            message : "Internal Server Error",
        } , { status : 500 })
    }

}