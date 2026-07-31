import { Kysely, sql } from "kysely";
import { DB } from "src/saas-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("tenant_follow_ups")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))

    .addColumn("tenantId", "uuid", (col) => col.notNull().references("tenants.id").onDelete("cascade"))

    .addColumn("status", "varchar(20)", (col) => col.notNull().defaultTo("PENDING")) // PENDING | IN_PROGRESS | COMPLETED | CANCELLED
    .addColumn("content", "text", (col) => col.notNull())
    .addColumn("metadata", "json")

    .addColumn("createdBy", "uuid", (col) => col.notNull().references("admins.id").onDelete("restrict"))
    .addColumn("isDeleted", "boolean", (col) => col.notNull().defaultTo(false))
    .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
    .addColumn("deletedAt", "timestamptz")

    .addColumn("createdAt", "timestamptz", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn("updatedAt", "timestamptz", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))

    .execute();

  await db.schema.createIndex("idx_tenant_follow_ups_tenant").on("tenant_follow_ups").column("tenantId").execute();
  await db.schema.createIndex("idx_tenant_follow_ups_status").on("tenant_follow_ups").column("status").execute();
  await db.schema.createIndex("idx_tenant_follow_ups_tenant_status").on("tenant_follow_ups").columns(["tenantId", "status"]).execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("idx_tenant_follow_ups_tenant_status").ifExists().execute();
  await db.schema.dropIndex("idx_tenant_follow_ups_status").ifExists().execute();
  await db.schema.dropIndex("idx_tenant_follow_ups_tenant").ifExists().execute();

  //Drop table
  await db.schema.dropTable("tenant_follow_ups").ifExists().execute();
}
