import Redis from "ioredis";
import zlib from "zlib"; 
import { promisify } from "util";

if(!process.env.REDIS_URL){
    throw new Error("No redis url in env !");
}

export const redisClient = new Redis(process.env.REDIS_URL);

const gzip = promisify(zlib.gzip);
const gunzip = promisify(zlib.gunzip);


export async function setCompressedJson(key: string, data: any) {
  const jsonString = JSON.stringify(data);
  const compressed = await gzip(jsonString); 

  const base64 = compressed.toString("base64");
  await redisClient.set(`feed:${key}`, base64 , 'EX' , 60 * 60 * 8);
}

export async function getCompressedJson(key: string) {
  const base64 = await redisClient.get(`feed:${key}`); 
  if (!base64) return null;

  const buffer = Buffer.from(base64, "base64");
  const decompressed = await gunzip(buffer);

  return JSON.parse(decompressed.toString("utf-8"));
}
