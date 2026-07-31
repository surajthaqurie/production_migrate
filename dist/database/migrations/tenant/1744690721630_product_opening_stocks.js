"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("product_fiscal_stocks")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("warehouseId", "uuid", (col) => col.references("warehouses.id").notNull().onDelete("restrict"))
        .addColumn("productId", "uuid", (col) => col.references("products.id").notNull().onDelete("restrict"))
        .addColumn("fiscalYear", "varchar(7)", (col) => col.notNull())
        .addColumn("previousFiscalYear", "varchar(7)")
        .addColumn("openingStock", "integer", (col) => col.notNull().defaultTo(0))
        .addColumn("closingStock", "integer", (col) => col.notNull().defaultTo(0))
        .addColumn("ratePerItem", "double precision", (col) => col.notNull().defaultTo(0))
        .addColumn("totalAmount", "double precision", (col) => col.notNull().defaultTo(0))
        .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
        .addColumn("createdAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addUniqueConstraint("unique_warehouse_product_fiscal_year", ["warehouseId", "productId", "fiscalYear"])
        .execute();
    await db.schema.createIndex("product_fiscal_stocks_product_idx").on("product_fiscal_stocks").column("productId").execute();
    await db.schema.createIndex("product_fiscal_stocks_warehouse_idx").on("product_fiscal_stocks").column("warehouseId").execute();
}
async function down(db) {
    await db.schema.dropIndex("product_fiscal_stocks_product_idx").execute();
    await db.schema.dropIndex("product_fiscal_stocks_warehouse_idx").execute();
    await db.schema.dropTable("product_fiscal_stocks").ifExists().execute();
}
//# sourceMappingURL=1744690721630_product_opening_stocks.js.map