"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("cms_featured_customers")
        .ifNotExists()
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("name", "varchar(255)", (col) => col.notNull())
        .addColumn("role", "varchar(255)", (col) => col.notNull())
        .addColumn("company", "varchar(255)", (col) => col.notNull())
        .addColumn("location", "varchar(255)", (col) => col.notNull())
        .addColumn("imageUrl", "text")
        .addColumn("displayOrder", "integer", (col) => col.notNull().defaultTo(0))
        .addColumn("status", "varchar(50)", (col) => col.notNull().defaultTo("ACTIVE"))
        .addColumn("published", "boolean", (col) => col.notNull().defaultTo(true))
        .addColumn("createdBy", "uuid", (col) => col.references("admins.id").onDelete("restrict"))
        .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("deletedAt", "timestamptz")
        .addColumn("createdAt", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .addColumn("updatedAt", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .execute();
    await db.schema.createIndex("cms_featured_customers_status_idx").on("cms_featured_customers").column("status").execute();
    await db.schema.createIndex("cms_featured_customers_published_idx").on("cms_featured_customers").column("published").execute();
    await db.schema.createIndex("cms_featured_customers_deleted_at_idx").on("cms_featured_customers").column("deletedAt").execute();
}
async function down(db) {
    await db.schema.dropIndex("cms_featured_customers_deleted_at_idx").ifExists().execute();
    await db.schema.dropIndex("cms_featured_customers_published_idx").ifExists().execute();
    await db.schema.dropIndex("cms_featured_customers_status_idx").ifExists().execute();
    await db.schema.dropTable("cms_featured_customers").ifExists().execute();
}
//# sourceMappingURL=1785226850000_create_cms_featured_customers_schema.js.map