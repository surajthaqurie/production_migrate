"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("supplier_logs")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("supplierId", "uuid", (col) => col.references("suppliers.id").notNull().onDelete("cascade"))
        .addColumn("previousLogs", "jsonb", (col) => col.notNull())
        .addColumn("currentLogs", "jsonb", (col) => col.notNull())
        .addColumn("event", "text", (col) => col.notNull())
        .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
        .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addColumn("remark", "text", (col) => col.notNull())
        .addColumn("fiscalYear", "varchar(7)", (col) => col.notNull())
        .addColumn("branchId", "uuid", (col) => col.references("branches.id").onDelete("restrict"))
        .addColumn("description", "text")
        .addColumn("metadata", "json")
        .addColumn("createdAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .execute();
    await db.schema.createIndex("supplier_log_supplier_idx").on("supplier_logs").column("supplierId").execute();
    await db.schema.createIndex("supplier_log_branch_idx").on("supplier_logs").column("branchId").execute();
}
async function down(db) {
    await db.schema.dropIndex("supplier_log_supplier_idx").execute();
    await db.schema.dropIndex("supplier_log_branch_idx").execute();
    await db.schema.dropTable("supplier_logs").ifExists().execute();
}
//# sourceMappingURL=1750324752440_create_supplier_logs_table.js.map