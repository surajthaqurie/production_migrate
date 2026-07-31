"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("product_secondary_units")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("name", "varchar(255)", (col) => col.notNull())
        .addColumn("costPrice", "double precision")
        .addColumn("sellingPrice", "double precision")
        .addColumn("unitType", "uuid", (col) => col.notNull().references("measurement_units.id").onDelete("set null"))
        .addColumn("conversionValue", "double precision", (col) => col.notNull())
        .addColumn("productId", "uuid", (col) => col.references("products.id").notNull().onDelete("cascade"))
        .addColumn("description", "text")
        .addColumn("metadata", "json")
        .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
        .addColumn("isDeleted", "boolean", (col) => col.defaultTo(false))
        .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("deletedAt", "timestamptz")
        .addUniqueConstraint("unique_secondary_unit_per_product", ["unitType", "productId"])
        .addColumn("createdAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .execute();
    await db.schema.createIndex("product_secondary_units_productId_idx").on("product_secondary_units").column("productId").execute();
    await db.schema.createIndex("product_secondary_units_name_idx").on("product_secondary_units").column("name").execute();
}
async function down(db) {
    await db.schema.dropIndex("product_secondary_units_name_idx").execute();
    await db.schema.dropIndex("product_secondary_units_productId_idx").execute();
    await db.schema.dropTable("product_secondary_units").ifExists().execute();
}
//# sourceMappingURL=1744009004221_create_product_secondary_units_table.js.map