"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("purchase_order_items")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("productId", "uuid", (col) => col.references("products.id").notNull().onDelete("restrict"))
        .addColumn("orderId", "uuid", (col) => col.references("purchase_orders.id").notNull().onDelete("restrict"))
        .addColumn("discountValue", "double precision")
        .addColumn("discountType", (0, kysely_1.sql) `discount_type`)
        .addColumn("vat", "double precision", (col) => col.defaultTo(0))
        .addColumn("ratePerItem", "double precision", (col) => col.notNull())
        .addColumn("quantity", "integer", (col) => col.notNull().defaultTo(0))
        .addColumn("totalPrice", "double precision", (col) => col.notNull().defaultTo(0))
        .addColumn("metadata", "json")
        .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
        .addColumn("createdAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addUniqueConstraint("unique_order_product", ["productId", "orderId"])
        .execute();
    await db.schema.createIndex("order_items_orderId_idx").on("purchase_order_items").column("orderId").execute();
    await db.schema.createIndex("order_items_product_idx").on("purchase_order_items").column("productId").execute();
}
async function down(db) {
    await db.schema.dropIndex("order_items_orderId_idx").execute();
    await db.schema.dropIndex("order_items_product_idx").execute();
    await db.schema.dropTable("purchase_order_items").ifExists().execute();
}
//# sourceMappingURL=1745295719865_create_purchase_order_items_table.js.map