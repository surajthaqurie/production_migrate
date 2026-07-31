"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("release_note_contents")
        .ifNotExists()
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("releaseNoteId", "uuid", (col) => col.notNull().references("release_notes.id").onDelete("cascade"))
        .addColumn("label", "text", (col) => col.notNull())
        .addColumn("displayOrder", "integer", (col) => col.notNull().defaultTo(0))
        .addColumn("createdBy", "uuid", (col) => col.references("admins.id").onDelete("restrict"))
        .addColumn("createdAt", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .addColumn("updatedAt", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .execute();
    await db.schema.createIndex("release_note_contents_release_note_id_idx").on("release_note_contents").column("releaseNoteId").execute();
}
async function down(db) {
    await db.schema.dropIndex("release_note_contents_release_note_id_idx").ifExists().execute();
    await db.schema.dropTable("release_note_contents").ifExists().execute();
}
//# sourceMappingURL=1785226650000_create_release_note_contents_schema.js.map