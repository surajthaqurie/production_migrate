"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("cms_blog_authors")
        .ifNotExists()
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("name", "varchar(255)", (col) => col.notNull())
        .addColumn("slug", "varchar(255)", (col) => col.notNull().unique())
        .addColumn("role", "varchar(255)")
        .addColumn("bio", "text")
        .addColumn("avatarUrl", "text")
        .addColumn("socialLinks", "json")
        .addColumn("status", "varchar(50)", (col) => col.notNull().defaultTo("ACTIVE"))
        .addColumn("metadata", "json")
        .addColumn("disableReason", "text")
        .addColumn("createdBy", "uuid", (col) => col.references("admins.id").onDelete("restrict"))
        .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("deletedAt", "timestamptz")
        .addColumn("createdAt", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .addColumn("updatedAt", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .execute();
    await db.schema.createIndex("blog_authors_slug_idx").on("cms_blog_authors").column("slug").execute();
    await db.schema.createIndex("blog_authors_status_idx").on("cms_blog_authors").column("status").execute();
    await db.schema.createIndex("blog_authors_deleted_at_idx").on("cms_blog_authors").column("deletedAt").execute();
}
async function down(db) {
    await db.schema.dropIndex("blog_authors_deleted_at_idx").ifExists().execute();
    await db.schema.dropIndex("blog_authors_status_idx").ifExists().execute();
    await db.schema.dropIndex("blog_authors_slug_idx").ifExists().execute();
    await db.schema.dropTable("cms_blog_authors").ifExists().execute();
}
//# sourceMappingURL=1785226700000_create_cms_blog_authors_schema.js.map