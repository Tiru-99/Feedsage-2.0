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
import { Subscriber } from "@/lib/subscriber";


//server sent event 
export async function GET() {
    const userId = await getUserId();

    const stream = new ReadableStream({
        async start(controller) {
            async function send(data: any) {
                //browser compatible format
                controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);
            }

            try {
                const status = await redisClient.get(`feed:${userId}:status`);
                const channel = `feed:${userId}:events`;
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
                const result = await acquireLock(lockKey, '1', 60 * 60)

                //for the second request which comes for pending 
                if (!result) {
                    //lock not aquired
                    await send({
                        message: "Generating your feed",
                        status: "PENDING"
                    });

                    const subClient = redisClient.duplicate();
                    const subscriber = new Subscriber(channel, subClient);

                    //TODO : add a timeout
                    subscriber.subscribe(
                        async (message: string) => {
                            const event = JSON.parse(message);

                            if (event === "COMPLETED") {
                                const feed = await getCompressedJson(userId);

                                await send({
                                    status: "COMPLETED",
                                    feed
                                });
                                //cleanup 
                                subscriber.unsubscribe();
                                controller.close();
                            }
                        },
                        async (err: Error) => {
                            console.error("Something went wrong while listening redis", err);
                            await send({
                                status: "ERROR",
                                message: "Something went wrong"
                            });
                            //cleanup 
                            subscriber.unsubscribe();
                            controller.close();
                        }
                    )

                    return;
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
                const { data } = await axios.get(`${process.env.WORKER_URL}/generate/feed`, {
                    params: {
                        apiKey: decryptedKey,
                        prompt: row.prompt
                    }
                });

                const { success , feed , topFeed } = data ; 

                if(success === false){
                    send({
                        status : "ERROR", 
                        message : "internal server error"
                    }); 
                    controller.close(); 
                }

                //compress and save in redis
                await Promise.all([
                    functionWrapper(async () => { await setCompressedJson(userId, feed); }),
                    functionWrapper(async () => { await redisClient.set(`feed:${userId}:status`, "COMPLETED", 'EX', 60 * 60 * 8); }),
                ])

                //publish to the listener 
                await redisClient.publish(
                    channel,
                    JSON.stringify("COMPLETED")
                );

                await send({
                    feed,
                    topFeed , 
                    message: "Feed Generated Succesfully",
                    status: "COMPLETED"
                });
                await releaseLock(`feed:${userId}`, '1');
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