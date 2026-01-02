import { redisClient } from "@/lib/redis";

const releaseLockLua = `
    if redis.call("GET", KEYS[1]) == ARGV[1] then
        return redis.call("DEL", KEYS[1])
    else
        return 0
    end
`;

export const releaseLock = async (
  key: string,
  lockValue: string
) => {
  await redisClient.eval(releaseLockLua, 1, key, lockValue);
};