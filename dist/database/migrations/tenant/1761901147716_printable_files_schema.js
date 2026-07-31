"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("printable_files")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("resourceType", "varchar(50)", (col) => col.notNull())
        .addColumn("resourceId", "uuid", (col) => col.notNull())
        .addColumn("key", "text", (col) => col.notNull().unique())
        .addColumn("size", "varchar(10)", (col) => col.notNull())
        .addColumn("metadata", "json")
        .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
        .addColumn("createdAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addUniqueConstraint("printable_files_resource_id_size_unique", ["resourceId", "size"])
        .execute();
    await db.schema.createIndex("printable_files_resource_type_idx").on("printable_files").column("resourceType").execute();
    await db.schema.createIndex("printable_files_resource_type_id_idx").on("printable_files").columns(["resourceType", "resourceId"]).execute();
}
async function down(db) {
    await db.schema.dropIndex("printable_files_resource_type_id_idx").ifExists().execute();
    await db.schema.dropIndex("printable_files_resource_type_idx").ifExists().execute();
    await db.schema.dropTable("printable_files").ifExists().execute();
}
//# sourceMappingURL=1761901147716_printable_files_schema.js.map