/**
 * Backfills CMS permission into existing admin roles in the SaaS database.
 * CMS is a SaaS-admin-only resource (no tenant-side equivalent), so unlike
 * the tenant-permission backfill scripts this only ever touches the single SaaS DB.
 * Safe to run multiple times; synchronizes existing permissions to the configured actions.
 *
 * Usage: node scripts/seed-cms-permission.js
 * Requires DATABASE_URL to be set (via .env or environment).
 */

require("dotenv").config();

const { Kysely, PostgresDialect } = require("kysely");
const { Pool } = require("pg");

const RESOURCE = "CMS";

// Mirrors src/background/queues/db-seed-queue/seed/permission-seed/*.constant.ts
const ROLE_ACTIONS = {
  SUPER_ADMIN: ["VIEW", "CREATE", "UPDATE", "DELETE"],
  ADMIN: ["VIEW", "CREATE", "UPDATE", "DELETE"],
  READ_ONLY: ["VIEW"],
  SEO: ["VIEW", "CREATE", "UPDATE", "DELETE"]
};

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("ERROR: DATABASE_URL is not set.");
    process.exit(1);
  }

  const pool = new Pool({ connectionString: databaseUrl, max: 1 });
  const db = new Kysely({ dialect: new PostgresDialect({ pool }) });

  try {
    const targetNames = Object.keys(ROLE_ACTIONS);
    const roles = await db.selectFrom("user_roles").select(["id", "name"]).where("name", "in", targetNames).execute();

    if (!roles.length) {
      console.log("No matching roles found, skipping.");
      return;
    }

    // Use the earliest super-admin as createdBy, falling back to any earliest admin.
    const superAdminRole = roles.find((role) => role.name === "SUPER_ADMIN");
    let admin = superAdminRole
      ? await db.selectFrom("admins").where("roleId", "=", superAdminRole.id).select("id").orderBy("createdAt", "asc").limit(1).executeTakeFirst()
      : undefined;

    if (!admin) admin = await db.selectFrom("admins").select("id").orderBy("createdAt", "asc").limit(1).executeTakeFirst();

    if (!admin) {
      console.log("No admin found, skipping.");
      return;
    }

    const roleNameById = new Map(roles.map((role) => [role.id, role.name]));

    // Check which of the target roles already have a CMS permission set
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
        actions: ROLE_ACTIONS[role.name],
        isDefault: true,
        createdBy: admin.id
      }));

    // Synchronize exact actions so disabled-route permissions are removed.
    const toUpdate = existing
      .filter((row) => ROLE_ACTIONS[roleNameById.get(row.roleId)])
      .map((row) => ({ row, actions: ROLE_ACTIONS[roleNameById.get(row.roleId)] }))
      .filter(({ row, actions }) => row.actions.length !== actions.length || row.actions.some((action) => !actions.includes(action)));

    if (toInsert.length) await db.insertInto("permission_sets").values(toInsert).execute();

    for (const { row, actions } of toUpdate) {
      await db.updateTable("permission_sets").set({ actions, updatedAt: new Date() }).where("id", "=", row.id).execute();
    }

    const insertedNames = toInsert.map((p) => roleNameById.get(p.roleId));
    const updatedNames = toUpdate.map(({ row }) => roleNameById.get(row.roleId));
    const unchangedNames = existing
      .filter((row) => ROLE_ACTIONS[roleNameById.get(row.roleId)] && !toUpdate.some((update) => update.row.id === row.id))
      .map((row) => roleNameById.get(row.roleId));

    console.log(
      `✓ ${insertedNames.length} inserted [${insertedNames.join(", ")}]` +
        `${updatedNames.length ? `, ${updatedNames.length} synchronized [${updatedNames.join(", ")}]` : ""}` +
        `${unchangedNames.length ? `, ${unchangedNames.length} already synchronized [${unchangedNames.join(", ")}]` : ""}`
    );
  } finally {
    await db.destroy();
  }
}

main().catch((err) => {
  console.error("Fatal:", err.message);
  process.exit(1);
});
