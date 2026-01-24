import { redisClient } from "@/lib/redis";
import { NextRequest } from "next/server";
import { getUserId } from "@/lib/checkUser";
import { getCompressedJson } from "@/lib/redis";
import { Subscriber } from "@/lib/subscriber";

export async function GET(req: NextRequest) {
  const userId = await getUserId();
  const channel = `feed:${userId}:events`;

  let closed = false;

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: any) => {
        controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);
      };

      const cleanup = async (subscriber?: Subscriber) => {
        if (closed === true) return;
        closed = true;
        try {
          subscriber?.unsubscribe();
        } catch {}
        controller.close();
      };

      try {
        const status = await redisClient.get(`feed:${userId}:status`);
        console.log("The redis status is ", status);
        // completed already → send immediately
        if (status === "COMPLETED") {
          const feed = await getCompressedJson(userId);
          send({
            status: "COMPLETED",
            feed,
          });

          return await cleanup();
        }

        if (status === "NSFW") {
          send({
            status: "NSFW",
            message: "NSFW , please enter proper prompt",
          });
          return await cleanup();
        }

        if (status === "YOUTUBE_RATE_LIMIT") {
          send({
            status: "YOUTUBE_RATE_LIMIT",
            message: "Youtube api limit exceeded consider changing api key",
          });
          return await cleanup();
        }

        // errored
        if (status === "ERROR") {
          send({
            status: "ERROR",
            message: "Feed generation failed. Please retry.",
          });
          return await cleanup();
        }

        if (status === "NO_API_KEY") {
          send({
            status: "NO_API_KEY",
            message: "No youtube api key found",
          });
        }
        //feed expired
        if (!status) {
          send({
            message: "Feed expired",
            status: "EXPIRED",
          });
          return await cleanup();
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
              return await cleanup(subscriber);
            }

            if (event === "NSFW") {
              send({
                status: "NSFW",
                message: "NSFW Message detected",
              });
            }

            if (event === "ERROR") {
              send({
                status: "ERROR",
                message: "Feed generation failed.",
              });
              return await cleanup(subscriber);
            }
          },
          async (err: Error) => {
            console.error("Redis SSE error:", err);
            send({
              status: "ERROR",
              message: "Something went wrong.",
            });
            return await cleanup(subscriber);
          },
        );

        // handle client disconnect
        req.signal.addEventListener("abort", async () => {
          await cleanup(subscriber);
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
      Connection: "keep-alive",
    },
  });
}
