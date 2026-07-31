"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("subscription_plan_features")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("planId", "uuid", (col) => col.notNull().references("system_plans.id").onDelete("restrict"))
        .addColumn("planFeatureId", "uuid", (col) => col.notNull().references("system_plan_features.id").onDelete("restrict"))
        .addColumn("resetInterval", "varchar(20)", (col) => col.notNull().defaultTo("NONE"))
        .addColumn("isIncluded", "boolean")
        .addColumn("value", "text")
        .addColumn("limit", "double precision")
        .addColumn("isUnlimited", "boolean", (col) => col.notNull().defaultTo(false))
        .addColumn("createdBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("createdAt", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .addColumn("updatedAt", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .addUniqueConstraint("subscription_plan_features_plan_feature_unique", ["planId", "planFeatureId"])
        .execute();
    await db.schema.createIndex("subscription_plan_features_plan_idx").on("subscription_plan_features").column("planId").execute();
    await db.schema.createIndex("subscription_plan_features_feature_idx").on("subscription_plan_features").column("planFeatureId").execute();
}
async function down(db) {
    await db.schema.dropIndex("subscription_plan_features_feature_idx").ifExists().execute();
    await db.schema.dropIndex("subscription_plan_features_plan_idx").ifExists().execute();
    await db.schema.dropTable("subscription_plan_features").ifExists().execute();
}
//# sourceMappingURL=1780909222680_create_subscription_plan_features_schema.js.map