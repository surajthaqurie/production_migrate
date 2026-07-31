"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("tenant_feature_usages")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("tenantId", "uuid", (col) => col.notNull().references("tenants.id").onDelete("cascade"))
        .addColumn("featureId", "uuid", (col) => col.notNull().references("system_plan_features.id").onDelete("cascade"))
        .addColumn("periodStart", "timestamptz")
        .addColumn("count", "integer", (col) => col.notNull().defaultTo(0))
        .addColumn("createdAt", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .addColumn("updatedAt", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .execute();
    await db.schema.createIndex("idx_tenant_feature").on("tenant_feature_usages").columns(["tenantId", "featureId"]).execute();
    await db.schema.createIndex("idx_tenant_feature_usages_tenant").on("tenant_feature_usages").column("tenantId").execute();
    await db.schema.createIndex("idx_tenant_feature_usages_feature").on("tenant_feature_usages").column("featureId").execute();
}
async function down(db) {
    await db.schema.dropIndex("idx_tenant_feature_usages_feature").ifExists().execute();
    await db.schema.dropIndex("idx_tenant_feature_usages_tenant").ifExists().execute();
    await db.schema.dropIndex("idx_tenant_feature").ifExists().execute();
    await db.schema.dropTable("tenant_feature_usages").ifExists().execute();
}
//# sourceMappingURL=1783067280858_create_tenant_feature_usages_schema.ts.js.map