/**
 * Runs Kysely migrations to latest (or one step down) for every active tenant database.
 * Usage: node scripts/migrate-tenant-databases.js [--down]
 * Requires DATABASE_URL to be set (via .env or environment).
 */

require("dotenv").config();

const { Kysely, PostgresDialect, FileMigrationProvider, Migrator } = require("kysely");
const { Pool } = require("pg");
const path = require("path");
const { promises: fs } = require("fs");

const MIGRATION_FOLDER = path.join(process.cwd(), "dist", "database", "migrations", "tenant");

async function getActiveTenants(rootDb) {
  return await rootDb.selectFrom("tenants").select(["id", "name", "databaseName"]).where("status", "=", "COMPLETED").where("isDeleted", "=", false).execute();
}

async function migrateTenantDatabase(rootUrl, databaseName, direction) {
  const tenantUrl = new URL(rootUrl);
  tenantUrl.pathname = `/${databaseName}`;

  const pool = new Pool({ connectionString: tenantUrl.toString(), max: 1 });
  pool.on("error", (err) => console.error(`  Pool error for ${databaseName}: ${err.message}`));
  // pg only relays errors from idle clients to the pool's "error" event; a client checked out
  // for an active query (which Kysely holds for the whole migration run) emits "error" on
  // itself directly, so it needs its own listener or a dropped connection crashes the process.
  pool.on("connect", (client) => client.on("error", (err) => console.error(`  Client error for ${databaseName}: ${err.message}`)));
  const db = new Kysely({ dialect: new PostgresDialect({ pool }) });

  try {
    const migrator = new Migrator({
      db,
      provider: new FileMigrationProvider({ fs, path, migrationFolder: MIGRATION_FOLDER })
    });

    const { error, results } = direction === "down" ? await migrator.migrateDown() : await migrator.migrateToLatest();

    if (!results?.length) {
      console.log(direction === "down" ? "  Nothing to roll back." : "  Already up to date.");
    } else {
      results.forEach((it) => {
        if (it.status === "Success") console.log(`  ✓ ${it.migrationName}`);
        else if (it.status === "Error") console.error(`  ✗ ${it.migrationName}`);
      });
    }

    if (error) throw error;
  } finally {
    await db.destroy();
  }
}

async function main() {
  const direction = process.argv.includes("--down") ? "down" : "up";

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("ERROR: DATABASE_URL is not set.");
    process.exit(1);
  }

  const migrationFolderExists = await fs
    .access(MIGRATION_FOLDER)
    .then(() => true)
    .catch(() => false);
  if (!migrationFolderExists) {
    console.error(`ERROR: Migration folder not found: ${MIGRATION_FOLDER}`);
    console.error("Run 'npm run build' before executing this script.");
    process.exit(1);
  }

  const rootPool = new Pool({ connectionString: databaseUrl, max: 1 });
  rootPool.on("error", (err) => console.error(`Root pool error: ${err.message}`));
  rootPool.on("connect", (client) => client.on("error", (err) => console.error(`Root client error: ${err.message}`)));
  const rootDb = new Kysely({ dialect: new PostgresDialect({ pool: rootPool }) });

  try {
    // Phase 1: fetch all tenants and collect their database names
    console.log("Fetching active tenants from master database...\n");
    const tenants = await getActiveTenants(rootDb);

    if (!tenants.length) {
      console.log("No active tenants found.");
      return;
    }

    console.log(`Found ${tenants.length} tenant(s):`);
    tenants.forEach((t, i) => console.log(`  ${i + 1}. ${t.name}  →  ${t.databaseName}`));
    console.log();

    // Phase 2: migrate each tenant database one by one
    console.log(direction === "down" ? "Rolling back migrations...\n" : "Running migrations...\n");
    let succeeded = 0;
    let failed = 0;

    for (const tenant of tenants) {
      console.log(`[${tenant.name}] ${tenant.databaseName}`);
      try {
        await migrateTenantDatabase(databaseUrl, tenant.databaseName, direction);
        succeeded++;
      } catch (error) {
        console.error(`  ERROR: ${error.message}`);
        failed++;
      }
      console.log();
    }

    console.log(`Done — ${succeeded} succeeded, ${failed} failed.`);
    if (failed > 0) process.exit(1);
  } finally {
    await rootDb.destroy();
  }
}

main().catch((err) => {
  console.error("Fatal:", err.message);
  process.exit(1);
});
