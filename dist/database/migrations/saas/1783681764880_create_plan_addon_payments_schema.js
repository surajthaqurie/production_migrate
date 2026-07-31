"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("plan_addon_payments")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("code", "varchar(20)", (col) => col.notNull().unique())
        .addColumn("tenantId", "uuid", (col) => col.notNull().references("tenants.id").onDelete("cascade"))
        .addColumn("planAddonId", "uuid", (col) => col.notNull().references("plan_addons.id").onDelete("restrict"))
        .addColumn("paymentMethodId", "uuid", (col) => col.notNull().references("payment_methods.id").onDelete("restrict"))
        .addColumn("amount", "double precision", (col) => col.notNull())
        .addColumn("currency", "varchar(3)", (col) => col.notNull().defaultTo("NPR"))
        .addColumn("status", "varchar(20)", (col) => col.notNull().defaultTo("PENDING"))
        .addColumn("paidAt", "timestamptz")
        .addColumn("providerTransactionId", "varchar(255)")
        .addColumn("verifiedBy", "uuid", (col) => col.references("admins.id").onDelete("restrict"))
        .addColumn("verifiedAt", "timestamptz")
        .addColumn("refundAmount", "double precision", (col) => col.notNull().defaultTo(0))
        .addColumn("refundedBy", "uuid", (col) => col.references("admins.id").onDelete("restrict"))
        .addColumn("refundedAt", "timestamptz")
        .addColumn("failureReason", "text")
        .addColumn("remark", "text")
        .addColumn("metadata", "json")
        .addColumn("createdBy", "uuid", (col) => col.notNull().references("admins.id").onDelete("restrict"))
        .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("deletedAt", "timestamptz")
        .addColumn("createdAt", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .addColumn("updatedAt", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .execute();
    await db.schema.createIndex("idx_plan_addon_payments_status").on("plan_addon_payments").column("status").execute();
    await db.schema.createIndex("idx_plan_addon_payments_tenant").on("plan_addon_payments").column("tenantId").execute();
    await db.schema.createIndex("idx_plan_addon_payments_plan_addon").on("plan_addon_payments").column("planAddonId").execute();
    await db.schema.createIndex("idx_plan_addon_payments_tenant_status").on("plan_addon_payments").columns(["tenantId", "status"]).execute();
}
async function down(db) {
    await db.schema.dropIndex("idx_plan_addon_payments_tenant_status").ifExists().execute();
    await db.schema.dropIndex("idx_plan_addon_payments_plan_addon").ifExists().execute();
    await db.schema.dropIndex("idx_plan_addon_payments_tenant").ifExists().execute();
    await db.schema.dropIndex("idx_plan_addon_payments_status").ifExists().execute();
    await db.schema.dropTable("plan_addon_payments").ifExists().execute();
}
//# sourceMappingURL=1783681764880_create_plan_addon_payments_schema.js.map