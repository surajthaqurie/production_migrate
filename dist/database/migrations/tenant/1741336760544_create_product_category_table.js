"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("product_categories")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("name", "varchar", (col) => col.notNull())
        .addColumn("slug", "text", (col) => col.notNull())
        .addColumn("level", "integer", (col) => col.notNull())
        .addColumn("isDefault", "boolean", (col) => col.defaultTo(false))
        .addColumn("tenantId", "uuid", (col) => col.notNull().references("companies.id").onDelete("cascade"))
        .addColumn("description", "text")
        .addColumn("metadata", "json")
        .addColumn("parentId", "uuid", (col) => col.references("product_categories.id").onDelete("set null"))
        .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
        .addColumn("isDeleted", "boolean", (col) => col.defaultTo(false))
        .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("deletedAt", "timestamptz")
        .addColumn("createdAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .execute();
    await db.schema.createIndex("product_categories_name_idx").on("product_categories").column("name").execute();
    await db.schema.createIndex("product_categories_slug_idx").on("product_categories").column("slug").execute();
}
async function down(db) {
    await db.schema.dropIndex("product_categories_name_idx").execute();
    await db.schema.dropIndex("product_categories_slug_idx").execute();
    await db.schema.dropTable("product_categories").ifExists().execute();
}
//# sourceMappingURL=1741336760544_create_product_category_table.js.map