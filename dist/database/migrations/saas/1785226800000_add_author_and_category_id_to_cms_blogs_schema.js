"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(db) {
    await db.schema.dropIndex("blogs_category_idx").ifExists().execute();
    await db.schema
        .alterTable("cms_blogs")
        .addColumn("authorId", "uuid", (col) => col.references("cms_blog_authors.id").onDelete("set null"))
        .addColumn("categoryId", "uuid", (col) => col.references("cms_blog_categories.id").onDelete("set null"))
        .dropColumn("authorName")
        .dropColumn("category")
        .execute();
    await db.schema.createIndex("blogs_author_id_idx").on("cms_blogs").column("authorId").execute();
    await db.schema.createIndex("blogs_category_id_idx").on("cms_blogs").column("categoryId").execute();
}
async function down(db) {
    await db.schema
        .alterTable("cms_blogs")
        .addColumn("authorName", "varchar(255)", (col) => col.notNull().defaultTo("Kuverbooks Team"))
        .addColumn("category", "varchar(100)", (col) => col.notNull().defaultTo("General"))
        .execute();
    await db.schema.createIndex("blogs_category_idx").on("cms_blogs").column("category").execute();
    await db.schema.dropIndex("blogs_category_id_idx").ifExists().execute();
    await db.schema.dropIndex("blogs_author_id_idx").ifExists().execute();
    await db.schema.alterTable("cms_blogs").dropColumn("categoryId").dropColumn("authorId").execute();
}
//# sourceMappingURL=1785226800000_add_author_and_category_id_to_cms_blogs_schema.js.map