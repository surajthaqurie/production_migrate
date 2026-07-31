"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("product_batch")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("code", "varchar(18)", (col) => col.unique().notNull())
        .addColumn("totalQuantity", "numeric", (col) => col.notNull().defaultTo(0))
        .addColumn("remQuantity", "numeric", (col) => col.notNull().defaultTo(0))
        .addColumn("costPrice", "double precision", (col) => col.notNull().defaultTo(0))
        .addColumn("sellingPrice", "double precision", (col) => col.notNull().defaultTo(0))
        .addColumn("productId", "uuid", (col) => col.references("products.id").notNull().onDelete("cascade"))
        .addColumn("warehouseId", "uuid", (col) => col.references("warehouses.id").notNull().onDelete("restrict"))
        .addColumn("fiscalYear", "varchar(7)", (col) => col.notNull())
        .addColumn("metadata", "json")
        .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
        .addColumn("createdAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .execute();
    await db.schema.createIndex("product_batch_product_idx").on("product_batch").column("productId").execute();
    await db.schema.createIndex("product_batch_warehouse_idx").on("product_batch").column("warehouseId").execute();
    await db.schema.createIndex("product_batch_fiscalYear_idx").on("product_batch").column("fiscalYear").execute();
}
async function down(db) {
    await db.schema.dropIndex("product_batch_product_idx").execute();
    await db.schema.dropIndex("product_batch_warehouse_idx").execute();
    await db.schema.dropIndex("product_batch_fiscalYear_idx").execute();
    await db.schema.dropTable("product_batch").ifExists().execute();
}
//# sourceMappingURL=1744192153599_create_product_batch_schema.js.map