import { getUserId } from "@/lib/checkUser";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { cosineSimilarity } from "@/utils/similarity";
import { getCompressedJson, redisClient } from "@/lib/redis";
import { Subscriber } from "@/lib/subscriber";


export async function GET(req: NextRequest) {
    const userId = await getUserId();

    const { searchParams } = new URL(req.url);
    const title = searchParams.get("title");
    const description = searchParams.get("description");
    
    try {
        //send this to the api to embedd 
        const { data } = await axios.post(`${process.env.WORKER_URL}/generate/embedding`, {
            title,
            description  : description ?? ""
        });

        const { embeddings } = data;
        
        let videos;
        const status = await redisClient.get(`feed:${userId}:status`);
        videos = await getCompressedJson(userId);

        if (!status && (!videos || videos.length === 0)) {
            //feed expired
            return NextResponse.json({
                message: "Feed expired",
                status: "EXPIRED",
                success: false
            }, { status: 410 })

        }


        if (status === "PENDING") {
            //use the pub sub here to check for the completed event 
            const subClient = redisClient.duplicate();
            const channel = `feed:${userId}:events`;
            const subscriber = new Subscriber(channel, subClient);

            subscriber.subscribe(async (message: string) => {
                const event = JSON.parse(message);
                if (event === "COMPLETED") {
                    videos = await getCompressedJson(userId);
                    subscriber.unsubscribe();
                }
            },
                async (error: Error) => {
                    console.error("Something went wrong in recommendation api pub sub", error);
                    subscriber.unsubscribe();
                    return NextResponse.json({
                        message: "Error while building feed",
                        success: false
                    }, { status: 500 })
                });
        }

        if (!videos || videos.length === 0) {
            return NextResponse.json({
                message: "Could not get feed",
                status: "ERROR",
                success: false
            });
        }

        // check similarity
        const recommendations = videos.map((video: any) => {
            const score = cosineSimilarity(embeddings, video.embedding);

            return {
                ...video,
                similarityScore: score
            }
        });

        //send top 10 recommended videos only 
        recommendations.sort(
            (a: any, b: any) => b.similarityScore - a.similarityScore
        );

        const top10 = recommendations.slice(0, 12);

        return NextResponse.json({
            success: true,
            videos: top10
        });
    } catch (error) {
        console.log("Error in getting recommendations" , error); 
        return NextResponse.json({
            message: "Something went wrong while recommendation",
            success: false,
            top10: []
        })
    }
}