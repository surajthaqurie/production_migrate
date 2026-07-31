"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("cms_media")
        .ifNotExists()
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("filename", "varchar(255)", (col) => col.notNull())
        .addColumn("originalName", "varchar(255)", (col) => col.notNull())
        .addColumn("mimeType", "varchar(100)", (col) => col.notNull())
        .addColumn("size", "integer", (col) => col.notNull())
        .addColumn("url", "text", (col) => col.notNull())
        .addColumn("altText", "text")
        .addColumn("metadata", "json")
        .addColumn("disableReason", "text")
        .addColumn("createdBy", "uuid", (col) => col.references("admins.id").onDelete("restrict"))
        .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("deletedAt", "timestamptz")
        .addColumn("createdAt", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .execute();
    await db.schema.createIndex("media_filename_idx").on("cms_media").column("filename").execute();
    await db.schema.createIndex("media_deleted_at_idx").on("cms_media").column("deletedAt").execute();
}
async function down(db) {
    await db.schema.dropIndex("media_deleted_at_idx").ifExists().execute();
    await db.schema.dropIndex("media_filename_idx").ifExists().execute();
    await db.schema.dropTable("cms_media").ifExists().execute();
}
//# sourceMappingURL=1784600341567_create_cms_media_schema.js.map