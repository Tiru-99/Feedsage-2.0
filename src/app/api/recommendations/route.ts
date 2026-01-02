import { getUserId } from "@/lib/checkUser";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { cosineSimilarity } from "@/utils/similarity";
import { getCompressedJson, redisClient } from "@/lib/redis";

export default async function GET(req: NextRequest) {
    const userId = await getUserId();

    const { title, description } = await req.json();

    //send this to the api to embedd 
    const { data } = await axios.post(`${process.env.WORKER_URL}/generate/embedding`, {
        title,
        description
    });

    const { embeddings } = data;
    //one more condition can come is that the feed has expired 

    const status = await redisClient.get(`feed:${userId}:status`); 

    if(status === "PENDING"){
        //call the sse feed api
        const feed = axios.get('/api/feed' , )
    }

    const videos = await getCompressedJson(`feed:${userId}`);

    if(!videos || videos.length === 0 ){
        return NextResponse.json({
            message : "Feed expired",
            status : "EXPIRED",
            success : false
        } , { status : 500 })
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

    const top10 = recommendations.slice(0, 10);

    return NextResponse.json({
        success: true,
        data: top10
    });
}