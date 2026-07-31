/**
 * Flushes every key in the configured Redis instance (FLUSHALL).
 *
 * Connects directly with ioredis using REDIS_HOST/REDIS_PORT/REDIS_PASSWORD — same
 * env vars RedisService (src/shared/redis/redis.service.ts) uses — bypassing Nest
 * entirely, matching the other standalone scripts in this folder.
 *
 * Destructive: clears the whole cache (sessions, permission cache, rate limits, etc.),
 * not just one app's/prefix's keys. There is no undo.
 *
 * Usage: node scripts/flush-redis-cache.js
 * Requires REDIS_HOST to be set (via .env or environment).
 */

require("dotenv").config();

const Redis = require("ioredis");

async function main() {
  const host = process.env.REDIS_HOST;
  if (!host) {
    console.error("ERROR: REDIS_HOST is not set.");
    process.exit(1);
  }

  const client = new Redis({
    host,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD
  });

  try {
    console.log(`Connecting to Redis at ${host}:${process.env.REDIS_PORT}...`);
    await client.flushall();
    console.log("Done — all Redis keys flushed.");
  } finally {
    client.disconnect();
  }
}

main().catch((err) => {
  console.error("Fatal:", err.message);
  process.exit(1);
});
