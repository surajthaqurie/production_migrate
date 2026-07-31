"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("sales_order_item_batches")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("orderItemId", "uuid", (col) => col.references("sales_order_items.id").notNull().onDelete("cascade"))
        .addColumn("batchId", "uuid", (col) => col.references("product_batch.id").notNull().onDelete("restrict"))
        .addColumn("quantity", "integer", (col) => col.notNull().defaultTo(0))
        .addColumn("metadata", "json")
        .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
        .addUniqueConstraint("unique_sales_order_item_batches", ["orderItemId", "batchId"])
        .addColumn("createdAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .execute();
    await db.schema.createIndex("sales_order_item_batches_idx").on("sales_order_item_batches").column("orderItemId").execute();
    await db.schema.createIndex("sales_order_item_batches_batch_idx").on("sales_order_item_batches").column("batchId").execute();
}
async function down(db) {
    await db.schema.dropIndex("sales_order_item_batches_idx").execute();
    await db.schema.dropIndex("sales_order_item_batches_batch_idx").execute();
    await db.schema.dropTable("sales_order_item_batches").ifExists().execute();
}
//# sourceMappingURL=1748503329358_sales_order_item_batches.js.map