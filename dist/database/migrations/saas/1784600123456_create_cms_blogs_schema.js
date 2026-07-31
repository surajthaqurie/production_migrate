"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("cms_blogs")
        .ifNotExists()
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("slug", "varchar(255)", (col) => col.notNull().unique())
        .addColumn("title", "varchar(255)", (col) => col.notNull())
        .addColumn("excerpt", "text")
        .addColumn("content", "text", (col) => col.notNull())
        .addColumn("coverImageUrl", "text")
        .addColumn("authorName", "varchar(255)", (col) => col.notNull().defaultTo("Kuverbooks Team"))
        .addColumn("tags", "text", (col) => col.notNull().defaultTo("[]"))
        .addColumn("category", "varchar(100)", (col) => col.notNull().defaultTo("General"))
        .addColumn("seoTitle", "text")
        .addColumn("seoDescription", "text")
        .addColumn("published", "boolean", (col) => col.notNull().defaultTo(false))
        .addColumn("publishedAt", "timestamptz")
        .addColumn("metadata", "json")
        .addColumn("disableReason", "text")
        .addColumn("createdBy", "uuid", (col) => col.references("admins.id").onDelete("restrict"))
        .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("deletedAt", "timestamptz")
        .addColumn("createdAt", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .addColumn("updatedAt", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .execute();
    await db.schema.createIndex("blogs_slug_idx").on("cms_blogs").column("slug").execute();
    await db.schema.createIndex("blogs_published_idx").on("cms_blogs").column("published").execute();
    await db.schema.createIndex("blogs_category_idx").on("cms_blogs").column("category").execute();
    await db.schema.createIndex("blogs_deleted_at_idx").on("cms_blogs").column("deletedAt").execute();
    await db.schema.createIndex("blogs_created_by_idx").on("cms_blogs").column("createdBy").execute();
}
async function down(db) {
    await db.schema.dropIndex("blogs_created_by_idx").ifExists().execute();
    await db.schema.dropIndex("blogs_deleted_at_idx").ifExists().execute();
    await db.schema.dropIndex("blogs_category_idx").ifExists().execute();
    await db.schema.dropIndex("blogs_published_idx").ifExists().execute();
    await db.schema.dropIndex("blogs_slug_idx").ifExists().execute();
    await db.schema.dropTable("cms_blogs").ifExists().execute();
}
//# sourceMappingURL=1784600123456_create_cms_blogs_schema.js.map