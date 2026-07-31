"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("ecommerce_enquiry_products")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("enquiryId", "uuid", (col) => col.notNull().references("ecommerce_enquiries.id").onDelete("cascade"))
        .addColumn("productId", "uuid", (col) => col.notNull().references("products.id").onDelete("restrict"))
        .addColumn("quantity", "integer", (col) => col.notNull())
        .addColumn("amount", "double precision", (col) => col.notNull().defaultTo(0))
        .addColumn("createdAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addUniqueConstraint("unique_ecommerce_enquiry_products", ["enquiryId", "productId"])
        .execute();
    await db.schema.createIndex("enquiry_products_enquiry_idx").on("ecommerce_enquiry_products").column("enquiryId").execute();
    await db.schema.createIndex("enquiry_products_product_idx").on("ecommerce_enquiry_products").column("productId").execute();
}
async function down(db) {
    await db.schema.dropIndex("enquiry_products_enquiry_idx").execute();
    await db.schema.dropIndex("enquiry_products_product_idx").execute();
    await db.schema.dropTable("ecommerce_enquiry_products").ifExists().execute();
}
//# sourceMappingURL=1777890597848_ecommerce_enquiries_products_schema.js.map