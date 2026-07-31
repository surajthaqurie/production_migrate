"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("branch_products")
        .addColumn("productId", "uuid", (col) => col.references("products.id").notNull().onDelete("cascade"))
        .addColumn("branchId", "uuid", (col) => col.references("branches.id").notNull().onDelete("cascade"))
        .addColumn("status", (0, kysely_1.sql) `product_status`, (col) => col.notNull().defaultTo((0, kysely_1.sql) `'NO_STOCK'`))
        .addColumn("totalQuantity", "integer")
        .addColumn("reorderLevel", "integer")
        .addColumn("minStock", "integer")
        .addColumn("isSellable", "boolean", (col) => col.notNull().defaultTo(false))
        .addColumn("discountMode", "boolean", (col) => col.defaultTo(false))
        .addColumn("costPrice", "double precision")
        .addColumn("sellingPrice", "double precision")
        .addColumn("wholeSaleAmount", "double precision")
        .addColumn("retailAmount", "double precision")
        .addColumn("lifeDuration", "json")
        .addColumn("warrantyDuration", "json")
        .addUniqueConstraint("unique_branch_product", ["branchId", "productId"])
        .execute();
    await db.schema.createIndex("branch_products_product_idx").on("branch_products").column("productId").execute();
    await db.schema.createIndex("branch_products_branch_idx").on("branch_products").column("branchId").execute();
}
async function down(db) {
    await db.schema.dropIndex("branch_products_product_idx").execute();
    await db.schema.dropIndex("branch_products_branch_idx").execute();
    await db.schema.dropTable("branch_products").ifExists().execute();
}
//# sourceMappingURL=1743582805010_branch_products.js.map