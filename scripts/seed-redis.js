#!/usr/bin/env node
/**
 * Seeds Upstash Redis with portfolio data.
 *
 * Usage:
 *   UPSTASH_REDIS_REST_URL=... UPSTASH_REDIS_REST_TOKEN=... node scripts/seed-redis.js [path/to/data.json]
 *
 * If no JSON file path is given, falls back to data/portfolio.json (the committed file).
 *
 * To seed with live Vercel data (RECOMMENDED — preserves any edits already made):
 *   1. Open your live site's /sheeba/secret/login, log in
 *   2. In DevTools → Network, find GET /api/admin/data and copy the full response JSON
 *   3. Save it to scripts/live-data.json
 *   4. Run the seed script pointing at it:
 *      UPSTASH_REDIS_REST_URL=... UPSTASH_REDIS_REST_TOKEN=... node scripts/seed-redis.js scripts/live-data.json
 */

const fs = require("fs");
const path = require("path");

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const REDIS_KEY = "portfolio";

if (!REDIS_URL || !REDIS_TOKEN) {
  console.error(
    "Error: UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be set."
  );
  process.exit(1);
}

const dataFilePath =
  process.argv[2] ?? path.join(__dirname, "..", "data", "portfolio.json");

const raw = fs.readFileSync(dataFilePath, "utf-8");
const data = JSON.parse(raw);

(async () => {
  const response = await fetch(`${REDIS_URL}/set/${REDIS_KEY}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${REDIS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("Failed to seed Redis:", response.status, text);
    process.exit(1);
  }

  const result = await response.json();
  console.log("✓ Seeded successfully:", result);
  console.log("  Source:", dataFilePath);
})();
