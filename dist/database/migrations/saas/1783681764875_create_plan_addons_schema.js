"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("plan_addons")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("tenantId", "uuid", (col) => col.notNull().references("tenants.id").onDelete("cascade"))
        .addColumn("addonId", "uuid", (col) => col.notNull().references("system_addons.id").onDelete("restrict"))
        .addColumn("limit", "double precision", (col) => col.notNull())
        .addColumn("usages", "double precision", (col) => col.notNull().defaultTo(0))
        .addColumn("totalPrice", "double precision", (col) => col.notNull())
        .addColumn("status", "varchar(20)", (col) => col.notNull().defaultTo("PENDING"))
        .addColumn("createdBy", "uuid", (col) => col.notNull().references("admins.id").onDelete("restrict"))
        .addColumn("updatedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("deletedAt", "timestamptz")
        .addColumn("disableReason", "text")
        .addColumn("createdAt", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .addColumn("updatedAt", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .execute();
    await db.schema.createIndex("idx_plan_addons_tenant").on("plan_addons").column("tenantId").execute();
    await db.schema.createIndex("idx_plan_addons_addon").on("plan_addons").column("addonId").execute();
    await db.schema.createIndex("idx_plan_addons_status").on("plan_addons").column("status").execute();
    await db.schema.createIndex("idx_plan_addons_tenant_status").on("plan_addons").columns(["tenantId", "status"]).execute();
}
async function down(db) {
    await db.schema.dropIndex("idx_plan_addons_tenant_status").ifExists().execute();
    await db.schema.dropIndex("idx_plan_addons_status").ifExists().execute();
    await db.schema.dropIndex("idx_plan_addons_addon").ifExists().execute();
    await db.schema.dropIndex("idx_plan_addons_tenant").ifExists().execute();
    await db.schema.dropTable("plan_addons").ifExists().execute();
}
//# sourceMappingURL=1783681764875_create_plan_addons_schema.js.map