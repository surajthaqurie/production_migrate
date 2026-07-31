"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("cms_use_cases")
        .ifNotExists()
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("slug", "varchar(255)", (col) => col.notNull().unique())
        .addColumn("title", "varchar(255)", (col) => col.notNull())
        .addColumn("description", "text", (col) => col.notNull())
        .addColumn("targetAudience", "text")
        .addColumn("benefits", "text", (col) => col.notNull().defaultTo("[]"))
        .addColumn("published", "boolean", (col) => col.notNull().defaultTo(true))
        .addColumn("metadata", "json")
        .addColumn("disableReason", "text")
        .addColumn("createdBy", "uuid", (col) => col.references("admins.id").onDelete("restrict"))
        .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("deletedAt", "timestamptz")
        .addColumn("createdAt", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .addColumn("updatedAt", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .execute();
    await db.schema.createIndex("use_cases_slug_idx").on("cms_use_cases").column("slug").execute();
    await db.schema.createIndex("use_cases_published_idx").on("cms_use_cases").column("published").execute();
    await db.schema.createIndex("use_cases_deleted_at_idx").on("cms_use_cases").column("deletedAt").execute();
}
async function down(db) {
    await db.schema.dropIndex("use_cases_deleted_at_idx").ifExists().execute();
    await db.schema.dropIndex("use_cases_published_idx").ifExists().execute();
    await db.schema.dropIndex("use_cases_slug_idx").ifExists().execute();
    await db.schema.dropTable("cms_use_cases").ifExists().execute();
}
//# sourceMappingURL=1784600701245_create_cms_use_cases_schema.js.map