"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("product_images")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("productId", "uuid", (col) => col.notNull().references("products.id").onDelete("cascade"))
        .addColumn("fileId", "uuid", (col) => col.notNull().references("system_files.id").onDelete("restrict"))
        .addColumn("imageAltText", "text", (col) => col.notNull())
        .addColumn("isPrimary", "boolean", (col) => col.notNull().defaultTo(false))
        .addColumn("createdBy", "uuid", (col) => col.notNull().references("admins.id").onDelete("restrict"))
        .addColumn("createdAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .execute();
    await db.schema.createIndex("product_images_product_id_idx").on("product_images").column("productId").execute();
    await db.schema.createIndex("product_images_file_id_idx").on("product_images").column("fileId").execute();
    await db.schema.createIndex("product_images_is_primary_idx").on("product_images").column("isPrimary").execute();
    await db.schema.createIndex("product_images_created_by_idx").on("product_images").column("createdBy").execute();
}
async function down(db) {
    await db.schema.dropIndex("product_images_product_id_idx").execute();
    await db.schema.dropIndex("product_images_file_id_idx").execute();
    await db.schema.dropIndex("product_images_is_primary_idx").execute();
    await db.schema.dropIndex("product_images_created_by_idx").execute();
    await db.schema.dropTable("product_images").ifExists().execute();
}
//# sourceMappingURL=1743582805015_product_images_schema.js.map