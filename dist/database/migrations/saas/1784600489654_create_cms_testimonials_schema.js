"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("cms_testimonials")
        .ifNotExists()
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("quote", "text", (col) => col.notNull())
        .addColumn("authorName", "varchar(255)", (col) => col.notNull())
        .addColumn("authorRole", "varchar(255)", (col) => col.notNull())
        .addColumn("company", "varchar(255)", (col) => col.notNull())
        .addColumn("avatarUrl", "text")
        .addColumn("rating", "integer", (col) => col.notNull().defaultTo(5))
        .addColumn("category", "varchar(100)", (col) => col.notNull().defaultTo("retail"))
        .addColumn("featured", "boolean", (col) => col.notNull().defaultTo(false))
        .addColumn("published", "boolean", (col) => col.notNull().defaultTo(true))
        .addColumn("metadata", "json")
        .addColumn("disableReason", "text")
        .addColumn("createdBy", "uuid", (col) => col.references("admins.id").onDelete("restrict"))
        .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("deletedAt", "timestamptz")
        .addColumn("createdAt", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .addColumn("updatedAt", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .execute();
    await db.schema.createIndex("testimonials_category_idx").on("cms_testimonials").column("category").execute();
    await db.schema.createIndex("testimonials_published_idx").on("cms_testimonials").column("published").execute();
    await db.schema.createIndex("testimonials_featured_idx").on("cms_testimonials").column("featured").execute();
    await db.schema.createIndex("testimonials_deleted_at_idx").on("cms_testimonials").column("deletedAt").execute();
}
async function down(db) {
    await db.schema.dropIndex("testimonials_deleted_at_idx").ifExists().execute();
    await db.schema.dropIndex("testimonials_featured_idx").ifExists().execute();
    await db.schema.dropIndex("testimonials_published_idx").ifExists().execute();
    await db.schema.dropIndex("testimonials_category_idx").ifExists().execute();
    await db.schema.dropTable("cms_testimonials").ifExists().execute();
}
//# sourceMappingURL=1784600489654_create_cms_testimonials_schema.js.map