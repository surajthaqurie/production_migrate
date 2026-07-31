/**
 * Backfills USER_ACTIVITY (view-only) permission into the admin and super-admin roles
 * of the SaaS master database. Safe to run multiple times — uses ON CONFLICT DO NOTHING.
 *
 * Usage: node scripts/seed-saas-user-activity-permission.js
 * Requires DATABASE_URL to be set (via .env or environment).
 */

require("dotenv").config();

const { Kysely, PostgresDialect } = require("kysely");
const { Pool } = require("pg");

const RESOURCE = "USER_ACTIVITY";
const ACTIONS = ["VIEW"];
const TARGET_ROLE_NAMES = ["ADMIN", "SUPER_ADMIN"];

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("ERROR: DATABASE_URL is not set.");
    process.exit(1);
  }

  const pool = new Pool({ connectionString: databaseUrl, max: 1 });
  const db = new Kysely({ dialect: new PostgresDialect({ pool }) });

  try {
    const roles = await db.selectFrom("user_roles").select(["id", "name"]).where("name", "in", TARGET_ROLE_NAMES).execute();

    if (!roles.length) {
      console.log("No admin/super-admin roles found, nothing to do.");
      return;
    }

    // Use the earliest super-admin as createdBy, falling back to any earliest admin
    const superAdminRole = roles.find((role) => role.name === "SUPER_ADMIN");
    let admin = superAdminRole
      ? await db.selectFrom("admins").where("roleId", "=", superAdminRole.id).select("id").orderBy("createdAt", "asc").limit(1).executeTakeFirst()
      : undefined;

    if (!admin) admin = await db.selectFrom("admins").select("id").orderBy("createdAt", "asc").limit(1).executeTakeFirst();

    if (!admin) {
      console.log("No admin found, nothing to do.");
      return;
    }

    const roleNameById = new Map(roles.map((role) => [role.id, role.name]));

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
      `✓ ${insertedNames.length} inserted [${insertedNames.join(", ")}]` +
        `${updatedNames.length ? `, ${updatedNames.length} updated with missing actions [${updatedNames.join(", ")}]` : ""}` +
        `${unchangedNames.length ? `, ${unchangedNames.length} already had it [${unchangedNames.join(", ")}]` : ""}`
    );
  } finally {
    await db.destroy();
  }
}

main().catch((err) => {
  console.error("Fatal:", err.message);
  process.exit(1);
});
