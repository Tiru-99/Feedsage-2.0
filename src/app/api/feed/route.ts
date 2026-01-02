import axios from "axios";
import { redisClient } from "@/lib/redis";
import { getUserId } from "@/lib/checkUser";
import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { decrypt } from "@/utils/encrypt";
import { setCompressedJson, getCompressedJson } from "@/lib/redis";
import { functionWrapper } from "@/utils/wrapper";
import { acquireLock } from "@/utils/lock";
import { releaseLock } from "@/utils/unlock";

//server sent event 
export async function GET() {
    const userId = await getUserId();

    const stream = new ReadableStream({
        async start(controller) {
            async function send(data: any) {
                controller.enqueue(JSON.stringify(data));
            }

            try {
                const status = await redisClient.get(`feed:${userId}:status`);
                const channel = `feed:${userId}:events` ; 
                //add redis locking bro 

                if (status === "COMPLETED") {
                    const feed = await getCompressedJson(userId);
                    await send({
                        feed,
                        message: "Feed generated successfully",
                        status: "COMPLETED"
                    })
                    controller.close();
                }
                const lockKey = `feed:${userId}:lock`;
                const result = await acquireLock(lockKey , '1' , 60 * 60)

                if(!result){
                    //lock not aquired
                    await send({
                        message : "Generating your feed",
                        status : "PENDING"
                    });

                    const subClient = redisClient.duplicate();
                    
                    return ; 
                }

                await redisClient.set(`feed:${userId}:status`, "PENDING", 'EX', 60 * 60 * 8)
                await send({ status: "PENDING" });
                const [row] = await db
                    .select()
                    .from(user)
                    .where(eq(user.id, userId));

                if (!row || !row.youtubeApiKey || !row.prompt) {
                    await send({
                        message: "Invalid data format",
                        status: "ERROR"
                    })
                    controller.close();
                    return;
                }

                const decryptedKey = await decrypt(row.youtubeApiKey);
                const feed = await axios.get(`${process.env.WORKER_URL}/generate/feed`, {
                    params: {
                        apiKey: decryptedKey,
                        prompt: row.prompt
                    }
                });

                //compress and save in redis
                await Promise.all([
                    //publish the event
                    functionWrapper(async () => { await setCompressedJson(userId, feed); }),
                    functionWrapper(async () => { await redisClient.set(`feed:${userId}:status`, "COMPLETED", 'EX', 60 * 60 * 8); })
                ])

                await send({
                    feed,
                    message: "Feed Generated Succesfully",
                    status: "COMPLETED"
                });
                controller.close();
            } catch (error) {
                console.error("something went wrong while sse", error);
                send({ status: "ERROR", message: "Feed generation failed" });
                controller.close();
            }
        }
    })

    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        },
    });

}