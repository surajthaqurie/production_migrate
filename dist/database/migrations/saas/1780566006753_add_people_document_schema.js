"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("person_documents")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("name", "varchar(255)", (col) => col.notNull())
        .addColumn("tags", (0, kysely_1.sql) `text[]`, (col) => col.defaultTo((0, kysely_1.sql) `'{}'`))
        .addColumn("personId", "uuid", (col) => col.references("people_management.id").notNull().onDelete("cascade"))
        .addColumn("fileId", "uuid", (col) => col.notNull().references("system_files.id").onDelete("restrict"))
        .addColumn("metadata", "json")
        .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
        .addColumn("isDeleted", "boolean", (col) => col.defaultTo(false))
        .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("deletedAt", "timestamptz")
        .addColumn("createdAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .execute();
    await db.schema.createIndex("person_documents_person_idx").on("person_documents").column("personId").execute();
    await db.schema.createIndex("person_documents_name_idx").on("person_documents").column("name").execute();
}
async function down(db) {
    await db.schema.dropIndex("person_documents_person_idx").execute();
    await db.schema.dropIndex("person_documents_name_idx").execute();
    await db.schema.dropTable("person_documents").ifExists().execute();
}
//# sourceMappingURL=1780566006753_add_people_document_schema.js.map