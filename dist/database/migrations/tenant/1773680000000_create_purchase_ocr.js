"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("purchase_ocr_invoices")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("fileId", "uuid", (col) => col.notNull().references("system_files.id").onDelete("cascade"))
        .addColumn("status", "varchar", (col) => col.defaultTo((0, kysely_1.sql) `'READY'`))
        .addColumn("billId", "uuid", (col) => col.references("purchase_order_bills.id").onDelete("set null"))
        .addColumn("snapshot", "jsonb", (col) => col.notNull())
        .addColumn("createdBy", "uuid", (col) => col.notNull().references("admins.id").onDelete("restrict"))
        .addColumn("warehouseId", "uuid", (col) => col.notNull().references("warehouses.id").onDelete("restrict"))
        .addColumn("branchId", "uuid", (col) => col.notNull().references("branches.id").onDelete("restrict"))
        .addColumn("isProcessCompleted", "boolean", (col) => col.defaultTo(false))
        .addColumn("createdAt", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .addColumn("updatedAt", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .execute();
    await db.schema.createIndex("purchase_ocr_invoices_file_id_idx").on("purchase_ocr_invoices").column("fileId").execute();
    await db.schema.createIndex("purchase_ocr_invoices_bill_id_idx").on("purchase_ocr_invoices").column("billId").execute();
    await db.schema.createIndex("purchase_ocr_invoices_created_by_idx").on("purchase_ocr_invoices").column("createdBy").execute();
    await db.schema.createIndex("purchase_ocr_invoices_warehouse_id_idx").on("purchase_ocr_invoices").column("warehouseId").execute();
    await db.schema.createIndex("purchase_ocr_invoices_branch_id_idx").on("purchase_ocr_invoices").column("branchId").execute();
}
async function down(db) {
    await db.schema.dropIndex("purchase_ocr_invoices_file_id_idx").ifExists().execute();
    await db.schema.dropIndex("purchase_ocr_invoices_bill_id_idx").ifExists().execute();
    await db.schema.dropIndex("purchase_ocr_invoices_created_by_idx").ifExists().execute();
    await db.schema.dropIndex("purchase_ocr_invoices_warehouse_id_idx").ifExists().execute();
    await db.schema.dropIndex("purchase_ocr_invoices_branch_id_idx").ifExists().execute();
    await db.schema.dropTable("purchase_ocr_invoices").ifExists().execute();
}
//# sourceMappingURL=1773680000000_create_purchase_ocr.js.map