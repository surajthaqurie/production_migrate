import { Kysely, sql } from "kysely";
import { DB } from "src/saas-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("tenant_logs")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))

    .addColumn("tenantId", "uuid", (col) => col.references("tenants.id").notNull().onDelete("cascade"))

    .addColumn("previousLogs", "jsonb", (col) => col.notNull())
    .addColumn("currentLogs", "jsonb", (col) => col.notNull())

    .addColumn("event", "text", (col) => col.notNull())
    .addColumn("remark", "text", (col) => col.notNull())

    .addColumn("description", "text")
    .addColumn("metadata", "json")

    .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))

    .addColumn("createdAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())

    .execute();

  await db.schema.createIndex("tenant_logs_tenantId_idx").on("tenant_logs").column("tenantId").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("tenant_logs_tenantId_idx").ifExists().execute();

  //Drop Table
  await db.schema.dropTable("tenant_logs").ifExists().execute();
}
