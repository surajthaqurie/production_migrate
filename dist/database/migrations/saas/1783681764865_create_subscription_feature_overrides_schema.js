"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("subscription_feature_overrides")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("subscriptionOverrideId", "uuid", (col) => col.notNull().references("subscription_overrides.id").onDelete("restrict"))
        .addColumn("planFeatureId", "uuid", (col) => col.notNull().references("system_plan_features.id").onDelete("restrict"))
        .addColumn("resetInterval", "varchar(20)", (col) => col.notNull().defaultTo("NONE"))
        .addColumn("isIncluded", "boolean")
        .addColumn("value", "text")
        .addColumn("limit", "double precision")
        .addColumn("isUnlimited", "boolean", (col) => col.notNull().defaultTo(false))
        .addColumn("expiresAt", "timestamptz")
        .addColumn("reason", "text")
        .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
        .addColumn("updatedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("isDeleted", "boolean", (col) => col.notNull().defaultTo(false))
        .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("deletedAt", "timestamptz")
        .addColumn("createdAt", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .addColumn("updatedAt", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .execute();
    await db.schema.createIndex("subscription_feature_overrides_override_idx").on("subscription_feature_overrides").column("subscriptionOverrideId").execute();
    await db.schema.createIndex("subscription_feature_overrides_feature_idx").on("subscription_feature_overrides").column("planFeatureId").execute();
}
async function down(db) {
    await db.schema.dropIndex("subscription_feature_overrides_feature_idx").ifExists().execute();
    await db.schema.dropIndex("subscription_feature_overrides_override_idx").ifExists().execute();
    await db.schema.dropTable("subscription_feature_overrides").ifExists().execute();
}
//# sourceMappingURL=1783681764865_create_subscription_feature_overrides_schema.js.map