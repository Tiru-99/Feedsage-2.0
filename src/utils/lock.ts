import { redisClient } from "@/lib/redis";

const luaScript = `
-- KEYS[1] = lock key
-- ARGV[1] = lock value (unique token)
-- ARGV[2] = ttl in milliseconds

    if redis.call("EXISTS", KEYS[1]) == 0 then
        redis.call("SET", KEYS[1], ARGV[1], "PX", ARGV[2])
        return 1
    else
        return 0
    end
`;

export const acquireLock = async (
    key: string,
    lockValue: string,
    ttl: number
): Promise<boolean> => {
    const result = await redisClient.eval(
        luaScript,
        1,          
        key,        
        lockValue,  
        ttl         
    );

    return result === 1;
};

