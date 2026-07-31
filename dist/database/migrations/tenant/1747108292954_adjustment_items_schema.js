"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("adjustment_items")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("productId", "uuid", (col) => col.references("products.id").notNull().onDelete("restrict"))
        .addColumn("adjustmentId", "uuid", (col) => col.references("product_adjustments.id").notNull().onDelete("restrict"))
        .addColumn("batchId", "uuid", (col) => col.references("product_batch.id").onDelete("restrict"))
        .addColumn("type", (0, kysely_1.sql) `adjustment_item_types`)
        .addColumn("ratePerItem", "double precision", (col) => col.notNull().defaultTo(0))
        .addColumn("quantity", "integer", (col) => col.notNull().defaultTo(0))
        .addColumn("totalPrice", "double precision", (col) => col.notNull().defaultTo(0))
        .addColumn("metadata", "json")
        .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
        .addColumn("createdAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addUniqueConstraint("unique_adjustment_product_batch", ["productId", "adjustmentId", "batchId"])
        .execute();
    await db.schema.createIndex("adjustment_items_product_idx").on("adjustment_items").column("productId").execute();
    await db.schema.createIndex("adjustment_items_adjustment_idx").on("adjustment_items").column("adjustmentId").execute();
}
async function down(db) {
    await db.schema.dropIndex("adjustment_items_product_idx").execute();
    await db.schema.dropIndex("adjustment_items_adjustment_idx").execute();
    await db.schema.dropTable("adjustment_items").ifExists().execute();
}
//# sourceMappingURL=1747108292954_adjustment_items_schema.js.map