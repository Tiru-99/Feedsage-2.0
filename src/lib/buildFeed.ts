import axios from "axios";
import { redisClient } from "@/lib/redis";
import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { decrypt } from "@/utils/encrypt";
import { setCompressedJson } from "@/lib/redis";
import { functionWrapper } from "@/utils/wrapper";
import { acquireLock } from "@/utils/lock";
import { releaseLock } from "@/utils/unlock";

export async function buildFeed(userId: string) {
  const lockKey = `feed:${userId}:lock`;
  const channel = `feed:${userId}:events`;

  let lockAcquired = false;

  try {
    // try to acquire lock
    const result = await acquireLock(lockKey, "1", 5 * 60);
    if (!result) {
      // another build already running
      return;
    }

    lockAcquired = true;

    await redisClient.set(`feed:${userId}:status`, "PENDING", "EX", 60 * 10);

    const [row] = await db.select().from(user).where(eq(user.id, userId));

    if (!row || !row.youtubeApiKey || !row.prompt) {
      await redisClient.set(`feed:${userId}:status`, "ERROR", "EX", 60);
      return;
    }

    const decryptedKey = await decrypt(row.youtubeApiKey);
    console.log("the decryptedKey is ", decryptedKey);

    const { data } = await axios.get(
      `${process.env.WORKER_URL}/generate/feed`,
      {
        params: {
          apiKey: decryptedKey,
          prompt: row.prompt,
        },
      },
    );

    const { success, feed, errType } = data;

    console.log("The generated feed length is ", feed.length);

    if (!success && errType === "NSFW") {
      await redisClient.publish(channel, JSON.stringify("NSFW"));
      await redisClient.set(`feed:${userId}:status`, "NSFW", "EX", 2 * 60);
      return;
    }

    if (!success) {
      await redisClient.publish(channel, JSON.stringify("ERROR"));
      await redisClient.set(`feed:${userId}:status`, "ERROR", "EX", 60);
      return;
    }

    // save feed + mark completed
    await Promise.all([
      functionWrapper(async () => {
        await setCompressedJson(userId, feed);
      }),
      functionWrapper(async () => {
        await redisClient.set(
          `feed:${userId}:status`,
          "COMPLETED",
          "EX",
          60 * 60 * 8,
        );
      }),
    ]);

    // notify SSE listeners
    await redisClient.publish(channel, JSON.stringify("COMPLETED"));
  } catch (err: any) {
    console.error("buildFeed failed:", err);

    const statusCode =
      err?.response?.status ?? err?.statusCode ?? err?.status ?? 500;

    let redisStatus: "YOUTUBE_RATE_LIMIT" | "NSFW" | "ERROR" | "NO_API_KEY" =
      "ERROR";

    if (statusCode === 429) {
      redisStatus = "YOUTUBE_RATE_LIMIT";
    } else if (statusCode === 422) {
      redisStatus = "NSFW";
    } else if (statusCode === 400) {
      redisStatus = "NO_API_KEY";
    }

    console.log("Setting redis status:", redisStatus);

    await Promise.all([
      redisClient.publish(channel, JSON.stringify(redisStatus)),
      redisClient.set(`feed:${userId}:status`, redisStatus, "EX", 60),
    ]);
  } finally {
    if (lockAcquired) {
      await releaseLock(lockKey, "1");
    }
  }
}
