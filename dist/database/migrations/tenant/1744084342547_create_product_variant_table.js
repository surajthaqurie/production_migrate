"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.skip_up = skip_up;
exports.skip_down = skip_down;
const kysely_1 = require("kysely");
async function skip_up(db) {
    await db.schema
        .createTable("product_variants")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("name", "varchar(255)", (col) => col.notNull())
        .addColumn("code", "varchar", (col) => col.notNull())
        .addColumn("quantity", "numeric", (col) => col.notNull().defaultTo(0))
        .addColumn("costPrice", "double precision", (col) => col.notNull())
        .addColumn("sellingPrice", "double precision", (col) => col.notNull())
        .addColumn("attributes", "jsonb", (col) => col.notNull())
        .addColumn("productId", "uuid", (col) => col.references("products.id").notNull().onDelete("cascade"))
        .addUniqueConstraint("unique_variant_code_per_product", ["code", "productId"])
        .addColumn("description", "text")
        .addColumn("metadata", "json")
        .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
        .addColumn("isDeleted", "boolean", (col) => col.defaultTo(false))
        .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("deletedAt", "timestamptz")
        .addColumn("createdAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .execute();
}
async function skip_down(db) {
    await db.schema.dropTable("product_variants").ifExists().execute();
}
//# sourceMappingURL=1744084342547_create_product_variant_table.js.map