"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("cms_competitors")
        .ifNotExists()
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("slug", "varchar(255)", (col) => col.notNull().unique())
        .addColumn("name", "varchar(255)", (col) => col.notNull())
        .addColumn("tagline", "text")
        .addColumn("logoUrl", "text")
        .addColumn("comparisonFeatures", "text", (col) => col.notNull().defaultTo("{}"))
        .addColumn("summary", "text")
        .addColumn("published", "boolean", (col) => col.notNull().defaultTo(true))
        .addColumn("metadata", "json")
        .addColumn("disableReason", "text")
        .addColumn("createdBy", "uuid", (col) => col.references("admins.id").onDelete("restrict"))
        .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("deletedAt", "timestamptz")
        .addColumn("createdAt", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .addColumn("updatedAt", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .execute();
    await db.schema.createIndex("competitors_slug_idx").on("cms_competitors").column("slug").execute();
    await db.schema.createIndex("competitors_published_idx").on("cms_competitors").column("published").execute();
    await db.schema.createIndex("competitors_deleted_at_idx").on("cms_competitors").column("deletedAt").execute();
}
async function down(db) {
    await db.schema.dropIndex("competitors_deleted_at_idx").ifExists().execute();
    await db.schema.dropIndex("competitors_published_idx").ifExists().execute();
    await db.schema.dropIndex("competitors_slug_idx").ifExists().execute();
    await db.schema.dropTable("cms_competitors").ifExists().execute();
}
//# sourceMappingURL=1784600567321_create_cms_competitors_schema.js.map