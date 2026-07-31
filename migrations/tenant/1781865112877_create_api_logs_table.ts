import { Kysely, sql } from "kysely";
import { DB } from "src/tenant-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("api_logs")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    // integrationId is a plain uuid reference — no FK constraint since api_integrations lives in master DB
    .addColumn("integrationId", "uuid")
    .addColumn("tenantId", "uuid", (col) => col.references("companies.id").onDelete("cascade"))
    .addColumn("endpoint", "varchar(255)", (col) => col.notNull())
    .addColumn("method", "varchar(10)", (col) => col.notNull())
    .addColumn("requestPayload", "jsonb")
    .addColumn("responseStatus", "integer", (col) => col.notNull())
    .addColumn("responsePayload", "jsonb")
    .addColumn("executedAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn("createdAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .execute();

  await db.schema.createIndex("api_logs_integrationId_idx").on("api_logs").column("integrationId").execute();
  await db.schema.createIndex("api_logs_tenantId_idx").on("api_logs").column("tenantId").execute();
  await db.schema.createIndex("api_logs_createdAt_idx").on("api_logs").column("createdAt").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("api_logs_createdAt_idx").ifExists().execute();
  await db.schema.dropIndex("api_logs_tenantId_idx").ifExists().execute();
  await db.schema.dropIndex("api_logs_integrationId_idx").ifExists().execute();
  await db.schema.dropTable("api_logs").ifExists().execute();
}
