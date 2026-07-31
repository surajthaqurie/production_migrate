"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("system_files")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("key", "text", (col) => col.notNull().unique())
        .addColumn("originalName", "varchar(255)", (col) => col.notNull())
        .addColumn("mimeType", "varchar(50)", (col) => col.notNull())
        .addColumn("size", "integer", (col) => col.notNull())
        .addColumn("createdBy", "uuid", (col) => col.notNull().references("admins.id").onDelete("restrict"))
        .addColumn("isDeleted", "boolean", (col) => col.defaultTo(false))
        .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("deletedAt", "timestamptz")
        .addColumn("createdAt", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .addColumn("updatedAt", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .execute();
    await db.schema.createIndex("system_files_created_by_idx").on("system_files").column("createdBy").execute();
}
async function down(db) {
    await db.schema.dropIndex("system_files_created_by_idx").execute();
    await db.schema.dropTable("system_files").ifExists().execute();
}
//# sourceMappingURL=1740736823405_create_system_file_schema.js.map