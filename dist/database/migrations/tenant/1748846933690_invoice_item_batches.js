"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("invoice_item_batches")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("invoiceItemId", "uuid", (col) => col.references("sales_bill_items.id").notNull().onDelete("cascade"))
        .addColumn("batchId", "uuid", (col) => col.references("product_batch.id").notNull().onDelete("restrict"))
        .addColumn("quantity", "integer", (col) => col.notNull().defaultTo(0))
        .addColumn("metadata", "json")
        .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
        .addUniqueConstraint("unique_invoice_item_batches", ["invoiceItemId", "batchId"])
        .addColumn("createdAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .execute();
    await db.schema.createIndex("invoice_item_batches_idx").on("invoice_item_batches").column("invoiceItemId").execute();
    await db.schema.createIndex("invoice_item_batches_batch_idx").on("invoice_item_batches").column("batchId").execute();
}
async function down(db) {
    await db.schema.dropIndex("invoice_item_batches_idx").execute();
    await db.schema.dropIndex("invoice_item_batches_batch_idx").execute();
    await db.schema.dropTable("invoice_item_batches").ifExists().execute();
}
//# sourceMappingURL=1748846933690_invoice_item_batches.js.map