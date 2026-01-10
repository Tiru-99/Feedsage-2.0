import { redisClient } from "@/lib/redis";
import { NextRequest } from "next/server";
import { getUserId } from "@/lib/checkUser";
import { getCompressedJson } from "@/lib/redis";
import { Subscriber } from "@/lib/subscriber";

export async function GET( req : NextRequest) {
  const userId = await getUserId();
  const channel = `feed:${userId}:events`;

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: any) => {
        controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);
      };

      const cleanup = async (subscriber?: Subscriber) => {
        try {
          subscriber?.unsubscribe();
        } catch {}
        controller.close();
      };

      try {
        // 1️⃣ check current status
        const status = await redisClient.get(`feed:${userId}:status`);

        // completed already → send immediately
        if (status === "COMPLETED") {
          const feed = await getCompressedJson(userId);
          send({
            status: "COMPLETED",
            feed,
          });
          return cleanup();
        }

        // errored
        if (status === "ERROR") {
          send({
            status: "ERROR",
            message: "Feed generation failed. Please retry.",
          });
          return cleanup();
        }

        // pending or unknown → listen
        send({ status: "PENDING" });

        const subClient = redisClient.duplicate();
        const subscriber = new Subscriber(channel, subClient);

        subscriber.subscribe(
          async (message: string) => {
            const event = JSON.parse(message);

            if (event === "COMPLETED") {
              const feed = await getCompressedJson(userId);
              send({
                status: "COMPLETED",
                feed,
              });
              await cleanup(subscriber);
            }

            if (event === "ERROR") {
              send({
                status: "ERROR",
                message: "Feed generation failed.",
              });
              await cleanup(subscriber);
            }
          },
          async (err: Error) => {
            console.error("Redis SSE error:", err);
            send({
              status: "ERROR",
              message: "Something went wrong.",
            });
            await cleanup(subscriber);
          }
        );

        // handle client disconnect
        req.signal.addEventListener("abort", async () => {
          await cleanup(subscriber);
          controller.close(); 
        });
      } catch (err) {
        console.error("SSE route failed:", err);
        send({
          status: "ERROR",
          message: "Unexpected server error",
        });
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
