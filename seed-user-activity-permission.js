/**
 * Backfills USER_ACTIVITY (view-only) permission into the admin and super-admin roles
 * of all existing tenant databases. Safe to run multiple times — uses ON CONFLICT DO NOTHING.
 *
 * Usage: node scripts/seed-user-activity-permission.js
 * Requires DATABASE_URL to be set (via .env or environment).
 */

require("dotenv").config();

const { Kysely, PostgresDialect } = require("kysely");
const { Pool } = require("pg");

const RESOURCE = "USER_ACTIVITY";
const ACTIONS = ["VIEW"];
const TARGET_SLUGS = ["admin", "super-admin"];

async function seedUserActivityPermission(rootUrl, databaseName) {
  const tenantUrl = new URL(rootUrl);
  tenantUrl.pathname = `/${databaseName}`;

  const pool = new Pool({ connectionString: tenantUrl.toString(), max: 1 });
  const db = new Kysely({ dialect: new PostgresDialect({ pool }) });

  try {
    const roles = await db.selectFrom("user_roles").select(["id", "name", "slug"]).where("slug", "in", TARGET_SLUGS).execute();

    if (!roles.length) {
      console.log("  No admin/super-admin roles found, skipping.");
      return;
    }

    // Match the super-admin role by slug, not the fixed id — some legacy tenants
    // seeded their super-admin role under a different id, but the slug is stable.
    const superAdminRole = roles.find((role) => role.slug === "super-admin");

    // Use the earliest super-admin as createdBy, falling back to any earliest admin
    // so a tenant isn't skipped entirely just because its super-admin role/id is off.
    let admin = superAdminRole
      ? await db.selectFrom("admins").where("roleId", "=", superAdminRole.id).select("id").orderBy("createdAt", "asc").limit(1).executeTakeFirst()
      : undefined;

    if (!admin) admin = await db.selectFrom("admins").select("id").orderBy("createdAt", "asc").limit(1).executeTakeFirst();

    if (!admin) {
      console.log("  No admin found, skipping.");
      return;
    }

    const roleNameById = new Map(roles.map((role) => [role.id, role.name]));

    // Check which of the target roles already have a USER_ACTIVITY permission set
    const existing = await db
      .selectFrom("permission_sets")
      .select(["id", "roleId", "actions"])
      .where("resource", "=", RESOURCE)
      .where(
        "roleId",
        "in",
        roles.map((role) => role.id)
      )
      .execute();
    const existingByRoleId = new Map(existing.map((row) => [row.roleId, row]));

    const toInsert = roles
      .filter((role) => !existingByRoleId.has(role.id))
      .map((role) => ({
        resource: RESOURCE,
        roleId: role.id,
        actions: ACTIONS,
        isDefault: true,
        createdBy: admin.id
      }));

    // Already has the permission — only append missing actions, keep any extra ones already granted
    const toUpdate = existing
      .map((row) => ({ row, mergedActions: Array.from(new Set([...row.actions, ...ACTIONS])) }))
      .filter(({ row, mergedActions }) => mergedActions.length !== row.actions.length);

    if (toInsert.length) await db.insertInto("permission_sets").values(toInsert).execute();

    for (const { row, mergedActions } of toUpdate) {
      await db.updateTable("permission_sets").set({ actions: mergedActions, updatedAt: new Date() }).where("id", "=", row.id).execute();
    }

    const insertedNames = toInsert.map((p) => roleNameById.get(p.roleId));
    const updatedNames = toUpdate.map(({ row }) => roleNameById.get(row.roleId));
    const unchangedNames = existing.filter((row) => !toUpdate.some((u) => u.row.id === row.id)).map((row) => roleNameById.get(row.roleId));

    console.log(
      `  ✓ ${insertedNames.length} inserted [${insertedNames.join(", ")}]` +
        `${updatedNames.length ? `, ${updatedNames.length} updated with missing actions [${updatedNames.join(", ")}]` : ""}` +
        `${unchangedNames.length ? `, ${unchangedNames.length} already had it [${unchangedNames.join(", ")}]` : ""}`
    );
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
  const rootDb = new Kysely({ dialect: new PostgresDialect({ pool: rootPool }) });

  try {
    console.log("Fetching tenants from master database...\n");
    const tenants = await rootDb.selectFrom("tenants").select(["id", "name", "databaseName"]).where("isDeleted", "=", false).execute();

    if (!tenants.length) {
      console.log("No tenants found.");
      return;
    }

    console.log(`Found ${tenants.length} tenant(s):\n`);

    let succeeded = 0;
    let failed = 0;

    for (const tenant of tenants) {
      console.log(`[${tenant.name}] ${tenant.databaseName}`);
      try {
        await seedUserActivityPermission(databaseUrl, tenant.databaseName);
        succeeded++;
      } catch (error) {
        console.error(`  ERROR: ${error.message}`);
        failed++;
      }
    }

    console.log(`\nDone — ${succeeded} succeeded, ${failed} failed.`);
    if (failed > 0) process.exit(1);
  } finally {
    await rootDb.destroy();
  }
}

main().catch((err) => {
  console.error("Fatal:", err.message);
  process.exit(1);
});
