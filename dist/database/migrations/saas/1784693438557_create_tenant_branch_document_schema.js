"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("tenant_branch_documents")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("name", "varchar(255)", (col) => col.notNull())
        .addColumn("tags", (0, kysely_1.sql) `text[]`, (col) => col.defaultTo((0, kysely_1.sql) `'{}'`))
        .addColumn("branchId", "uuid", (col) => col.references("tenant_branches.id").notNull().onDelete("cascade"))
        .addColumn("fileId", "uuid", (col) => col.notNull().references("system_files.id").onDelete("restrict"))
        .addColumn("metadata", "json")
        .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
        .addColumn("isDeleted", "boolean", (col) => col.defaultTo(false))
        .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("deletedAt", "timestamptz")
        .addColumn("createdAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .execute();
    await db.schema.createIndex("tenant_branch_documents_branch_idx").on("tenant_branch_documents").column("branchId").execute();
    await db.schema.createIndex("tenant_branch_documents_name_idx").on("tenant_branch_documents").column("name").execute();
}
async function down(db) {
    await db.schema.dropIndex("tenant_branch_documents_branch_idx").ifExists().execute();
    await db.schema.dropIndex("tenant_branch_documents_name_idx").ifExists().execute();
    await db.schema.dropTable("tenant_branch_documents").ifExists().execute();
}
//# sourceMappingURL=1784693438557_create_tenant_branch_document_schema.js.map