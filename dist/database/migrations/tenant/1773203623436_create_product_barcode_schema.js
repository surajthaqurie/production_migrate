"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("product_barcodes")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("type", "varchar(255)", (col) => col.notNull())
        .addColumn("productId", "uuid", (col) => col.references("products.id").notNull().onDelete("restrict"))
        .addColumn("barcode", "varchar(255)", (col) => col.notNull().unique())
        .addColumn("isDefault", "boolean", (col) => col.defaultTo(false))
        .addColumn("createdAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
        .addColumn("isDeleted", "boolean", (col) => col.defaultTo(false))
        .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("deletedAt", "timestamptz")
        .execute();
    await db.schema.createIndex("product_barcodes_productId_idx").on("product_barcodes").column("productId").execute();
    await db.schema.createIndex("product_barcodes_barcode_idx").on("product_barcodes").column("barcode").execute();
}
async function down(db) {
    await db.schema.dropIndex("product_barcodes_productId_idx").ifExists().execute();
    await db.schema.dropIndex("product_barcodes_barcode_idx").ifExists().execute();
    await db.schema.dropTable("product_barcodes").ifExists().execute();
}
//# sourceMappingURL=1773203623436_create_product_barcode_schema.js.map