"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("product_logs")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("productId", "uuid", (col) => col.references("products.id").notNull().onDelete("cascade"))
        .addColumn("previousLogs", "jsonb", (col) => col.notNull())
        .addColumn("currentLogs", "jsonb", (col) => col.notNull())
        .addColumn("event", "text", (col) => col.notNull())
        .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
        .addColumn("remark", "text", (col) => col.notNull())
        .addColumn("fiscalYear", "varchar(7)", (col) => col.notNull())
        .addColumn("branchId", "uuid", (col) => col.references("branches.id").onDelete("restrict"))
        .addColumn("description", "text")
        .addColumn("metadata", "json")
        .addColumn("createdAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .execute();
    await db.schema.createIndex("product_logs_product_idx").on("product_logs").column("productId").execute();
    await db.schema.createIndex("product_logs_branch_idx").on("product_logs").column("branchId").execute();
}
async function down(db) {
    await db.schema.dropIndex("product_logs_product_idx").execute();
    await db.schema.dropIndex("product_logs_branch_idx").execute();
    await db.schema.dropTable("product_logs").ifExists().execute();
}
//# sourceMappingURL=1744690721625_create_product_log_table.js.map