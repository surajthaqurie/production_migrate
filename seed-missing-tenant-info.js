/**
 * Backfills tenant_info rows for tenants that are missing one.
 * For each such tenant, connects to its own database and reads the default
 * company row to populate real values (logo, phone, email, location, etc.).
 * Safe to run multiple times — uses ON CONFLICT DO NOTHING.
 *
 * Usage: node scripts/seed-missing-tenant-info.js
 * Requires DATABASE_URL to be set (via .env or environment).
 */

require("dotenv").config();

const { Kysely, PostgresDialect } = require("kysely");
const { Pool } = require("pg");

async function getDefaultCompany(rootUrl, databaseName) {
  const tenantUrl = new URL(rootUrl);
  tenantUrl.pathname = `/${databaseName}`;

  const pool = new Pool({ connectionString: tenantUrl.toString(), max: 1 });
  const db = new Kysely({ dialect: new PostgresDialect({ pool }) });

  try {
    return await db
      .selectFrom("companies")
      .select(["logo", "primaryPhone", "primaryEmail", "primaryContractPerson", "location", "city", "state", "zipCode", "vatNo", "panNo"])
      .where("isDefault", "=", true)
      .where("isDeleted", "=", false)
      .orderBy("createdAt", "asc")
      .limit(1)
      .executeTakeFirst();
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

  const pool = new Pool({ connectionString: databaseUrl, max: 1 });
  const masterDb = new Kysely({ dialect: new PostgresDialect({ pool }) });

  try {
    // Tenants that exist in the master DB but have no tenant_info row yet
    const tenants = await masterDb
      .selectFrom("tenants as t")
      .leftJoin("tenant_info as ti", "ti.tenantId", "t.id")
      .select(["t.id", "t.name", "t.databaseName"])
      .where("ti.tenantId", "is", null)
      .where("t.isDeleted", "=", false)
      .execute();

    if (!tenants.length) {
      console.log("All tenants already have a tenant_info record. Nothing to do.");
      return;
    }

    console.log(`Found ${tenants.length} tenant(s) missing a tenant_info row:\n`);

    let succeeded = 0;
    let skipped = 0;
    let failed = 0;

    for (const tenant of tenants) {
      console.log(`[${tenant.name}]  db=${tenant.databaseName}`);
      try {
        const company = await getDefaultCompany(databaseUrl, tenant.databaseName);

        if (!company) {
          console.log("  ! No default company found in tenant DB — skipping.");
          skipped++;
          continue;
        }

        const result = await masterDb
          .insertInto("tenant_info")
          .values({
            tenantId: tenant.id,
            logo: company.logo,
            contactPhone: company.primaryPhone,
            contactEmail: company.primaryEmail ?? "",
            contactPerson: company.primaryContractPerson ?? tenant.name,
            location: company.location,
            city: company.city,
            state: company.state,
            ...(company.zipCode && { zipCode: company.zipCode }),
            ...(company.vatNo && { vatNo: company.vatNo }),
            ...(company.panNo && { panNo: company.panNo })
          })
          .onConflict((oc) => oc.column("tenantId").doNothing())
          .executeTakeFirst();

        const inserted = Number(result?.numInsertedOrUpdatedRows ?? 0);
        if (inserted > 0) {
          console.log("  ✓ tenant_info inserted from company data");
          succeeded++;
        } else {
          console.log("  — already exists (skipped)");
          skipped++;
        }
      } catch (error) {
        console.error(`  ERROR: ${error.message}`);
        failed++;
      }
    }

    console.log(`\nDone — ${succeeded} inserted, ${skipped} skipped, ${failed} failed.`);
    if (failed > 0) process.exit(1);
  } finally {
    await masterDb.destroy();
  }
}

main().catch((err) => {
  console.error("Fatal:", err.message);
  process.exit(1);
});
