/**
 * Backfills master `tenant_branches` rows for every tenant's existing branch(es).
 *
 * createTenant() (src/modules/organization-module/tenant/tenant.service.ts) seeds a
 * tenant's default branch directly into that tenant's own database (`branches` table,
 * via TenantSeedQueueService/seedDefaultBranch) — it never inserts a corresponding row
 * into the master `tenant_branches` table. That master table is otherwise only populated
 * by the separate paid "add branch" flow (TenantBranchService.createTenantBranch()).
 * So every tenant is currently missing a master tenant_branches row for its default branch.
 *
 * For each non-deleted tenant, this reads its own `branches` rows and inserts the missing
 * master `tenant_branches` row, reusing the tenant DB's branch id as the master row's id
 * (matching the convention already used by the paid-branch sync flow, where the two ids
 * are always identical) and marking it ACTIVE since the branch is already live in the
 * tenant DB.
 *
 * Safe to run multiple times — ON CONFLICT DO NOTHING (id or tenantId+slug already existing is skipped).
 *
 * Usage: node scripts/seed-tenant-branches.js
 * Requires DATABASE_URL to be set (via .env or environment).
 */

require("dotenv").config();

const { Kysely, PostgresDialect } = require("kysely");
const { Pool } = require("pg");

async function getTenantBranches(rootUrl, databaseName) {
  const tenantUrl = new URL(rootUrl);
  tenantUrl.pathname = `/${databaseName}`;

  const pool = new Pool({ connectionString: tenantUrl.toString(), max: 1 });
  const db = new Kysely({ dialect: new PostgresDialect({ pool }) });

  try {
    return await db
      .selectFrom("branches")
      .select(["id", "name", "slug", "isDefault", "location", "city", "state", "zipCode", "primaryPhone", "primaryContractPerson", "primaryEmail"])
      .where("isDeleted", "=", false)
      .execute();
  } finally {
    await db.destroy();
  }
}

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("ERROR: DATABASE_URL is not set.");
    process.exit(1);
  }

  const rootPool = new Pool({ connectionString: databaseUrl, max: 1 });
  const masterDb = new Kysely({ dialect: new PostgresDialect({ pool: rootPool }) });

  try {
    console.log("Fetching tenants from master database...\n");
    const tenants = await masterDb.selectFrom("tenants").select(["id", "name", "databaseName", "createdBy"]).where("isDeleted", "=", false).execute();

    if (!tenants.length) {
      console.log("No tenants found.");
      return;
    }

    console.log(`Found ${tenants.length} tenant(s):\n`);

    let inserted = 0;
    let skipped = 0;
    let failed = 0;

    for (const tenant of tenants) {
      console.log(`[${tenant.name}] ${tenant.databaseName}`);
      try {
        const branches = await getTenantBranches(databaseUrl, tenant.databaseName);

        if (!branches.length) {
          console.log("  No branches found in tenant DB, skipping.");
          continue;
        }

        for (const branch of branches) {
          const result = await masterDb
            .insertInto("tenant_branches")
            .values({
              id: branch.id,
              tenantId: tenant.id,
              name: branch.name,
              slug: branch.slug,
              isDefault: branch.isDefault,
              status: "ACTIVE",
              location: branch.location,
              city: branch.city,
              state: branch.state,
              zipCode: branch.zipCode,
              primaryPhone: branch.primaryPhone,
              primaryContractPerson: branch.primaryContractPerson,
              primaryEmail: branch.primaryEmail,
              createdBy: tenant.createdBy
            })
            .onConflict((oc) => oc.doNothing())
            .executeTakeFirst();

          const numInserted = Number(result?.numInsertedOrUpdatedRows ?? 0);
          if (numInserted > 0) {
            console.log(`  ✓ inserted branch "${branch.name}" (${branch.slug})`);
            inserted++;
          } else {
            console.log(`  — branch "${branch.name}" (${branch.slug}) already exists, skipped`);
            skipped++;
          }
        }
      } catch (error) {
        console.error(`  ERROR: ${error.message}`);
        failed++;
      }
    }

    console.log(`\nDone — ${inserted} branch(es) inserted, ${skipped} already existed, ${failed} tenant(s) failed.`);
    if (failed > 0) process.exit(1);
  } finally {
    await masterDb.destroy();
  }
}

main().catch((err) => {
  console.error("Fatal:", err.message);
  process.exit(1);
});
