import { Kysely, sql } from "kysely";
import { DB } from "src/tenant-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("api_usage_metrics")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn("integrationId", "uuid", (col) => col.notNull())
    .addColumn("yearMonth", "varchar(7)", (col) => col.notNull())
    .addColumn("callCount", "integer", (col) => col.defaultTo(0).notNull())
    .addColumn("createdAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .execute();

  await db.schema.createIndex("api_usage_metrics_int_ym_idx").on("api_usage_metrics").columns(["integrationId", "yearMonth"]).unique().execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("api_usage_metrics_int_ym_idx").ifExists().execute();
  await db.schema.dropTable("api_usage_metrics").ifExists().execute();
}
