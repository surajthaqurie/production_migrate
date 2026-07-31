import { Kysely, sql } from "kysely";
import { DB } from "src/saas-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("subscription_plan_features")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))

    // Which plan this value belongs to (e.g. Standard Monthly, Premium Annual)
    .addColumn("planId", "uuid", (col) => col.notNull().references("system_plans.id").onDelete("restrict"))

    // Which catalog feature this value configures (e.g. invoice-limit, quick-sales)
    .addColumn("planFeatureId", "uuid", (col) => col.notNull().references("system_plan_features.id").onDelete("restrict"))

    // COUNT features only: NONE | DAILY | WEEKLY | MONTHLY
    .addColumn("resetInterval", "varchar(20)", (col) => col.notNull().defaultTo("NONE"))

    // BOOLEAN features: true = enabled, false = disabled, null = not applicable to this plan
    .addColumn("isIncluded", "boolean")

    // TEXT features: descriptive label (e.g. "Cash/QR", "All", "Single", "Customized")
    .addColumn("value", "text")

    // COUNT features: numeric cap (e.g. 15000 invoices/month, 25 OCR scans); null if not a count feature
    .addColumn("limit", "double precision")

    // COUNT features: when true, limit is ignored — the feature has no cap for this plan
    .addColumn("isUnlimited", "boolean", (col) => col.notNull().defaultTo(false))

    .addColumn("createdBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))

    .addColumn("createdAt", "timestamptz", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn("updatedAt", "timestamptz", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))

    .addUniqueConstraint("subscription_plan_features_plan_feature_unique", ["planId", "planFeatureId"])

    .execute();

  await db.schema.createIndex("subscription_plan_features_plan_idx").on("subscription_plan_features").column("planId").execute();
  await db.schema.createIndex("subscription_plan_features_feature_idx").on("subscription_plan_features").column("planFeatureId").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("subscription_plan_features_feature_idx").ifExists().execute();
  await db.schema.dropIndex("subscription_plan_features_plan_idx").ifExists().execute();

  //Drop Table
  await db.schema.dropTable("subscription_plan_features").ifExists().execute();
}
