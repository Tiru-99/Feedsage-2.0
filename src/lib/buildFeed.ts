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

    await redisClient.set(
      `feed:${userId}:status`,
      "PENDING",
      "EX",
      60 * 10
    );

    const [row] = await db
      .select()
      .from(user)
      .where(eq(user.id, userId));

    if (!row || !row.youtubeApiKey || !row.prompt) {
      await redisClient.set(
        `feed:${userId}:status`,
        "ERROR",
        "EX",
        60
      );
      return;
    }

    const decryptedKey = await decrypt(row.youtubeApiKey);

    const { data } = await axios.get(
      `${process.env.WORKER_URL}/generate/feed`,
      {
        params: {
          apiKey: decryptedKey,
          prompt: row.prompt,
        },
      }
    );

    const { success, feed } = data;

    if (!success) {
      await redisClient.set(
        `feed:${userId}:status`,
        "ERROR",
        "EX",
        60
      );
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
          60 * 60 * 8
        );
      }),
    ]);

    // notify SSE listeners
    await redisClient.publish(
      channel,
      JSON.stringify("COMPLETED")
    );
  } catch (err) {
    console.error("buildFeed failed:", err);
    await redisClient.set(
      `feed:${userId}:status`,
      "ERROR",
      "EX",
      60
    );
  } finally {
    if (lockAcquired) {
      await releaseLock(lockKey, "1");
    }
  }
}
