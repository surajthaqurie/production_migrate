"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("release_notes")
        .ifNotExists()
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("version", "varchar(50)", (col) => col.notNull().unique())
        .addColumn("title", "varchar(255)", (col) => col.notNull())
        .addColumn("summary", "text")
        .addColumn("releaseDate", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .addColumn("published", "boolean", (col) => col.notNull().defaultTo(false))
        .addColumn("publishedAt", "timestamptz")
        .addColumn("metadata", "json")
        .addColumn("isDeleted", "boolean", (col) => col.notNull().defaultTo(false))
        .addColumn("createdBy", "uuid", (col) => col.references("admins.id").onDelete("restrict"))
        .addColumn("updatedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("deletedAt", "timestamptz")
        .addColumn("createdAt", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .addColumn("updatedAt", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .execute();
    await db.schema.createIndex("release_notes_version_idx").on("release_notes").column("version").execute();
    await db.schema.createIndex("release_notes_published_idx").on("release_notes").column("published").execute();
    await db.schema.createIndex("release_notes_is_deleted_idx").on("release_notes").column("isDeleted").execute();
    await db.schema.createIndex("release_notes_release_date_idx").on("release_notes").column("releaseDate").execute();
    await db.schema.createIndex("release_notes_created_by_idx").on("release_notes").column("createdBy").execute();
}
async function down(db) {
    await db.schema.dropIndex("release_notes_created_by_idx").ifExists().execute();
    await db.schema.dropIndex("release_notes_release_date_idx").ifExists().execute();
    await db.schema.dropIndex("release_notes_is_deleted_idx").ifExists().execute();
    await db.schema.dropIndex("release_notes_published_idx").ifExists().execute();
    await db.schema.dropIndex("release_notes_version_idx").ifExists().execute();
    await db.schema.dropTable("release_notes").ifExists().execute();
}
//# sourceMappingURL=1785226626225_create_release_notes_schema.js.map