import { Kysely, sql } from "kysely";
import { DB } from "src/saas-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("plan_addons")

    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))

    .addColumn("tenantId", "uuid", (col) => col.notNull().references("tenants.id").onDelete("cascade"))
    .addColumn("addonId", "uuid", (col) => col.notNull().references("system_addons.id").onDelete("restrict"))

    .addColumn("limit", "double precision", (col) => col.notNull())

    // How much of the granted limit has been consumed so far
    .addColumn("usages", "double precision", (col) => col.notNull().defaultTo(0))
    .addColumn("totalPrice", "double precision", (col) => col.notNull())

    .addColumn("status", "varchar(20)", (col) => col.notNull().defaultTo("PENDING")) // PENDING | ACTIVE | EXPIRED | REJECTED

    .addColumn("createdBy", "uuid", (col) => col.notNull().references("admins.id").onDelete("restrict"))
    .addColumn("updatedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))

    .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
    .addColumn("deletedAt", "timestamptz")
    .addColumn("disableReason", "text")

    .addColumn("createdAt", "timestamptz", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn("updatedAt", "timestamptz", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))

    .execute();

  await db.schema.createIndex("idx_plan_addons_tenant").on("plan_addons").column("tenantId").execute();
  await db.schema.createIndex("idx_plan_addons_addon").on("plan_addons").column("addonId").execute();
  await db.schema.createIndex("idx_plan_addons_status").on("plan_addons").column("status").execute();
  await db.schema.createIndex("idx_plan_addons_tenant_status").on("plan_addons").columns(["tenantId", "status"]).execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("idx_plan_addons_tenant_status").ifExists().execute();
  await db.schema.dropIndex("idx_plan_addons_status").ifExists().execute();
  await db.schema.dropIndex("idx_plan_addons_addon").ifExists().execute();
  await db.schema.dropIndex("idx_plan_addons_tenant").ifExists().execute();

  //Drop table
  await db.schema.dropTable("plan_addons").ifExists().execute();
}
