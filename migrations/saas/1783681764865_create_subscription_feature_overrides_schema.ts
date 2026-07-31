import { Kysely, sql } from "kysely";
import { DB } from "src/saas-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("subscription_feature_overrides")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))

    // Which custom subscription override (negotiated price/interval container) this feature override belongs to
    .addColumn("subscriptionOverrideId", "uuid", (col) => col.notNull().references("subscription_overrides.id").onDelete("restrict"))

    // Which catalog feature this override shadows (e.g. invoice-limit, quick-sales)
    .addColumn("planFeatureId", "uuid", (col) => col.notNull().references("system_plan_features.id").onDelete("restrict"))

    // COUNT features only: NONE | DAILY | WEEKLY | MONTHLY
    .addColumn("resetInterval", "varchar(20)", (col) => col.notNull().defaultTo("NONE"))

    // BOOLEAN features: true = enabled, false = disabled, null = not applicable
    .addColumn("isIncluded", "boolean")

    // TEXT features: descriptive label
    .addColumn("value", "text")

    // COUNT features: numeric cap; null if not a count feature
    .addColumn("limit", "double precision")

    // COUNT features: when true, limit is ignored — the feature has no cap for this subscription
    .addColumn("isUnlimited", "boolean", (col) => col.notNull().defaultTo(false))

    // Null = permanent override; a date = it should stop applying after this point (no background job — checked lazily wherever "active" is resolved)
    .addColumn("expiresAt", "timestamptz")

    // Admin-facing note on why this override was granted
    .addColumn("reason", "text")

    .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
    .addColumn("updatedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))

    .addColumn("isDeleted", "boolean", (col) => col.notNull().defaultTo(false))
    .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
    .addColumn("deletedAt", "timestamptz")

    .addColumn("createdAt", "timestamptz", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn("updatedAt", "timestamptz", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))

    .execute();

  await db.schema.createIndex("subscription_feature_overrides_override_idx").on("subscription_feature_overrides").column("subscriptionOverrideId").execute();
  await db.schema.createIndex("subscription_feature_overrides_feature_idx").on("subscription_feature_overrides").column("planFeatureId").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("subscription_feature_overrides_feature_idx").ifExists().execute();
  await db.schema.dropIndex("subscription_feature_overrides_override_idx").ifExists().execute();

  //Drop table
  await db.schema.dropTable("subscription_feature_overrides").ifExists().execute();
}
