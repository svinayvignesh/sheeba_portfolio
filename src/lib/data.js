import { Redis } from "@upstash/redis";
import fs from "fs";
import path from "path";

const redis = Redis.fromEnv();
const REDIS_KEY = "portfolio";

export async function getPortfolioData() {
  const data = await redis.get(REDIS_KEY);
  if (!data) {
    // First-run fallback: seed from committed JSON
    const raw = fs.readFileSync(
      path.join(process.cwd(), "data", "portfolio.json"),
      "utf-8"
    );
    const parsed = JSON.parse(raw);
    await redis.set(REDIS_KEY, parsed);
    return parsed;
  }
  return data;
}

export async function savePortfolioData(data) {
  await redis.set(REDIS_KEY, data);
}
