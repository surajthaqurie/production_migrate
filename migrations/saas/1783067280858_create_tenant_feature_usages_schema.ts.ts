import { Kysely, sql } from "kysely";
import { DB } from "src/saas-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("tenant_feature_usages")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))

    .addColumn("tenantId", "uuid", (col) => col.notNull().references("tenants.id").onDelete("cascade"))
    .addColumn("featureId", "uuid", (col) => col.notNull().references("system_plan_features.id").onDelete("cascade"))

    // null = live/non-resetting counter (e.g. product catalog size); non-null = start of the fixed calendar interval (day/week/month) this row counts (e.g. OCR scans this month)
    .addColumn("periodStart", "timestamptz")
    .addColumn("count", "integer", (col) => col.notNull().defaultTo(0))

    .addColumn("createdAt", "timestamptz", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn("updatedAt", "timestamptz", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))

    .execute();

  await db.schema.createIndex("idx_tenant_feature").on("tenant_feature_usages").columns(["tenantId", "featureId"]).execute();
  await db.schema.createIndex("idx_tenant_feature_usages_tenant").on("tenant_feature_usages").column("tenantId").execute();
  await db.schema.createIndex("idx_tenant_feature_usages_feature").on("tenant_feature_usages").column("featureId").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("idx_tenant_feature_usages_feature").ifExists().execute();
  await db.schema.dropIndex("idx_tenant_feature_usages_tenant").ifExists().execute();
  await db.schema.dropIndex("idx_tenant_feature").ifExists().execute();

  //Drop table
  await db.schema.dropTable("tenant_feature_usages").ifExists().execute();
}
