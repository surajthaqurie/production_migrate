"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("purchase_bill_items")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("productId", "uuid", (col) => col.references("products.id").notNull().onDelete("restrict"))
        .addColumn("billId", "uuid", (col) => col.references("purchase_order_bills.id").notNull().onDelete("restrict"))
        .addColumn("batchId", "uuid", (col) => col.references("product_batch.id"))
        .addColumn("discountMode", "boolean", (col) => col.defaultTo(false))
        .addColumn("discountValue", "double precision")
        .addColumn("discountType", (0, kysely_1.sql) `discount_type`)
        .addColumn("vat", "double precision", (col) => col.defaultTo(0))
        .addColumn("ratePerItem", "double precision", (col) => col.notNull())
        .addColumn("quantity", "integer", (col) => col.notNull().defaultTo(0))
        .addColumn("debitedQuantity", "integer", (col) => col.notNull().defaultTo(0))
        .addColumn("totalPrice", "double precision", (col) => col.notNull().defaultTo(0))
        .addColumn("metadata", "json")
        .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
        .addColumn("createdAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addUniqueConstraint("unique_bill_product", ["productId", "billId"])
        .execute();
    await db.schema.createIndex("purchase_bill_items_orderId_idx").on("purchase_bill_items").column("billId").execute();
    await db.schema.createIndex("purchase_bill_items_product_idx").on("purchase_bill_items").column("productId").execute();
}
async function down(db) {
    await db.schema.dropIndex("purchase_bill_items_orderId_idx").execute();
    await db.schema.dropIndex("purchase_bill_items_product_idx").execute();
    await db.schema.dropTable("purchase_bill_items").ifExists().execute();
}
//# sourceMappingURL=1745467550226_create_purchase_bill_items_schema.js.map