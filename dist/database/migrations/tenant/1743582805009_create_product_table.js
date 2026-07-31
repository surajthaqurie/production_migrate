"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("products")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("name", "varchar(255)", (col) => col.notNull())
        .addColumn("slug", "text", (col) => col.unique().notNull())
        .addColumn("sku", "varchar", (col) => col.unique().notNull())
        .addColumn("hasVariant", "boolean", (col) => col.notNull().defaultTo(false))
        .addColumn("taxRate", "double precision", (col) => col.notNull())
        .addColumn("categoryId", "uuid", (col) => col.notNull().references("product_categories.id").onDelete("set null"))
        .addColumn("measurementUnitId", "uuid", (col) => col.notNull().references("measurement_units.id").onDelete("set null"))
        .addColumn("valuationMethodId", "uuid", (col) => col.notNull().references("valuation_methods.id").onDelete("restrict"))
        .addColumn("hasAlternateUnit", "boolean", (col) => col.notNull().defaultTo(false))
        .addColumn("attributes", "jsonb")
        .addColumn("parentId", "uuid", (col) => col.references("products.id").onDelete("set null"))
        .addColumn("description", "text")
        .addColumn("metadata", "json")
        .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
        .addColumn("isDeleted", "boolean", (col) => col.defaultTo(false))
        .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("deletedAt", "timestamptz")
        .addColumn("supplierId", "uuid", (col) => col.references("suppliers.id").onDelete("set null"))
        .addColumn("createdAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .execute();
    await db.schema.createIndex("products_name_idx").on("products").column("name").execute();
}
async function down(db) {
    await db.schema.dropIndex("products_name_idx").execute();
    await db.schema.dropTable("products").ifExists().execute();
}
//# sourceMappingURL=1743582805009_create_product_table.js.map