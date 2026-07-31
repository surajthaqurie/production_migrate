"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("sale_item_batch_audit_logs")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("resourceType", "varchar(100)", (col) => col.notNull())
        .addColumn("resourceId", "uuid", (col) => col.notNull())
        .addColumn("parentResourceType", "varchar(100)", (col) => col.notNull())
        .addColumn("parentResourceId", "uuid", (col) => col.notNull())
        .addColumn("previousLogs", "jsonb")
        .addColumn("currentLogs", "jsonb", (col) => col.notNull())
        .addColumn("event", "text", (col) => col.notNull())
        .addColumn("remark", "text")
        .addColumn("fiscalYear", "varchar(7)", (col) => col.notNull())
        .addColumn("branchId", "uuid", (col) => col.references("branches.id").onDelete("restrict").notNull())
        .addColumn("description", "text")
        .addColumn("metadata", "json")
        .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
        .addColumn("createdAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .execute();
    await db.schema.createIndex("sale_item_batch_audit_logs_resource_idx").on("sale_item_batch_audit_logs").columns(["resourceType", "resourceId"]).execute();
    await db.schema.createIndex("sale_item_batch_audit_logs_parent_idx").on("sale_item_batch_audit_logs").columns(["parentResourceType", "parentResourceId"]).execute();
    await db.schema.createIndex("sale_item_batch_audit_logs_branch_idx").on("sale_item_batch_audit_logs").column("branchId").execute();
    await db.schema.createIndex("sale_item_batch_audit_logs_event_idx").on("sale_item_batch_audit_logs").column("event").execute();
    await db.schema.createIndex("sale_item_batch_audit_logs_createdAt_idx").on("sale_item_batch_audit_logs").column("createdAt desc").execute();
    await db.schema.createIndex("sale_item_batch_audit_logs_branch_fiscal_idx").on("sale_item_batch_audit_logs").columns(["branchId", "fiscalYear", "createdAt desc"]).execute();
}
async function down(db) {
    await db.schema.dropIndex("sale_item_batch_audit_logs_resource_idx").ifExists().execute();
    await db.schema.dropIndex("sale_item_batch_audit_logs_parent_idx").ifExists().execute();
    await db.schema.dropIndex("sale_item_batch_audit_logs_branch_idx").ifExists().execute();
    await db.schema.dropIndex("sale_item_batch_audit_logs_event_idx").ifExists().execute();
    await db.schema.dropIndex("sale_item_batch_audit_logs_createdAt_idx").ifExists().execute();
    await db.schema.dropIndex("sale_item_batch_audit_logs_branch_fiscal_idx").ifExists().execute();
    await db.schema.dropTable("sale_item_batch_audit_logs").ifExists().cascade().execute();
}
//# sourceMappingURL=1766482296115_sale_item_batch_audit_logs_schema.js.map