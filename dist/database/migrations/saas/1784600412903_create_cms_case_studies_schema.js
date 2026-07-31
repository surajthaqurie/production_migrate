"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("cms_case_studies")
        .ifNotExists()
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("slug", "varchar(255)", (col) => col.notNull().unique())
        .addColumn("title", "varchar(255)", (col) => col.notNull())
        .addColumn("clientName", "varchar(255)", (col) => col.notNull())
        .addColumn("industry", "varchar(100)", (col) => col.notNull())
        .addColumn("metrics", "text", (col) => col.notNull().defaultTo("{}"))
        .addColumn("summary", "text", (col) => col.notNull())
        .addColumn("content", "text", (col) => col.notNull())
        .addColumn("published", "boolean", (col) => col.notNull().defaultTo(false))
        .addColumn("metadata", "json")
        .addColumn("disableReason", "text")
        .addColumn("createdBy", "uuid", (col) => col.references("admins.id").onDelete("restrict"))
        .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("deletedAt", "timestamptz")
        .addColumn("createdAt", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .addColumn("updatedAt", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .execute();
    await db.schema.createIndex("case_studies_slug_idx").on("cms_case_studies").column("slug").execute();
    await db.schema.createIndex("case_studies_published_idx").on("cms_case_studies").column("published").execute();
    await db.schema.createIndex("case_studies_industry_idx").on("cms_case_studies").column("industry").execute();
    await db.schema.createIndex("case_studies_deleted_at_idx").on("cms_case_studies").column("deletedAt").execute();
}
async function down(db) {
    await db.schema.dropIndex("case_studies_deleted_at_idx").ifExists().execute();
    await db.schema.dropIndex("case_studies_industry_idx").ifExists().execute();
    await db.schema.dropIndex("case_studies_published_idx").ifExists().execute();
    await db.schema.dropIndex("case_studies_slug_idx").ifExists().execute();
    await db.schema.dropTable("cms_case_studies").ifExists().execute();
}
//# sourceMappingURL=1784600412903_create_cms_case_studies_schema.js.map