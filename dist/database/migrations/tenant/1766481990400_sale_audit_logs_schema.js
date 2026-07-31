"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("sales_audit_logs")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("resourceType", "varchar", (col) => col.notNull())
        .addColumn("resourceId", "uuid", (col) => col.notNull())
        .addColumn("previousLogs", "jsonb", (col) => col.notNull())
        .addColumn("currentLogs", "jsonb", (col) => col.notNull())
        .addColumn("event", "text", (col) => col.notNull())
        .addColumn("remark", "text", (col) => col.notNull())
        .addColumn("fiscalYear", "varchar(7)", (col) => col.notNull())
        .addColumn("branchId", "uuid", (col) => col.references("branches.id").onDelete("restrict"))
        .addColumn("description", "text")
        .addColumn("metadata", "json")
        .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
        .addColumn("createdAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .execute();
    await db.schema.createIndex("sales_audit_logs_resource_idx").on("sales_audit_logs").columns(["resourceType", "resourceId"]).execute();
    await db.schema.createIndex("sales_audit_logs_branch_idx").on("sales_audit_logs").column("branchId").execute();
    await db.schema.createIndex("sales_audit_logs_event_idx").on("sales_audit_logs").column("event").execute();
    await db.schema.createIndex("sales_audit_logs_createdAt_idx").on("sales_audit_logs").column("createdAt").execute();
}
async function down(db) {
    await db.schema.dropIndex("sales_audit_logs_resource_idx").execute();
    await db.schema.dropIndex("sales_audit_logs_branch_idx").execute();
    await db.schema.dropIndex("sales_audit_logs_event_idx").execute();
    await db.schema.dropIndex("sales_audit_logs_createdAt_idx").execute();
    await db.schema.dropTable("sales_audit_logs").ifExists().execute();
}
//# sourceMappingURL=1766481990400_sale_audit_logs_schema.js.map