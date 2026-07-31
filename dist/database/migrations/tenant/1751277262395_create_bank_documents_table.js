"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("bank_documents")
        .addColumn("bankAccountId", "uuid", (col) => col.notNull().references("bank_accounts.id").onDelete("cascade"))
        .addColumn("name", "varchar(255)", (col) => col.notNull())
        .addColumn("link", "text", (col) => col.notNull())
        .addColumn("tags", (0, kysely_1.sql) `text[]`, (col) => col.defaultTo((0, kysely_1.sql) `'{}'`))
        .addColumn("metadata", "json")
        .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
        .addColumn("isDeleted", "boolean", (col) => col.defaultTo(false))
        .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("deletedAt", "timestamptz")
        .addColumn("createdAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .execute();
    await db.schema.createIndex("bank_documents_bankAccountId_idx").on("bank_documents").column("bankAccountId").execute();
    await db.schema.createIndex("bank_documents_name_idx").on("bank_documents").column("name").execute();
}
async function down(db) {
    await db.schema.dropIndex("bank_documents_bankAccountId_idx").execute();
    await db.schema.dropIndex("bank_documents_name_idx").execute();
    await db.schema.dropTable("bank_documents").ifExists().execute();
}
//# sourceMappingURL=1751277262395_create_bank_documents_table.js.map