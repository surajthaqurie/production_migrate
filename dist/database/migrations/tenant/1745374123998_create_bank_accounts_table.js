"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("bank_accounts")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("code", "varchar(15)", (col) => col.unique().notNull())
        .addColumn("slug", "text", (col) => col.unique().notNull())
        .addColumn("name", "varchar(255)", (col) => col.notNull())
        .addColumn("accountType", (0, kysely_1.sql) `bank_account_type`, (col) => col.notNull())
        .addColumn("description", "text")
        .addColumn("metadata", "json")
        .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
        .addColumn("isDeleted", "boolean", (col) => col.defaultTo(false))
        .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("deletedAt", "timestamptz")
        .addColumn("deletedReason", "text")
        .addColumn("createdAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .execute();
    await db.schema.createIndex("bank_accounts_name_idx").on("bank_accounts").column("name").execute();
}
async function down(db) {
    await db.schema.dropIndex("bank_accounts_name_idx").execute();
    await db.schema.dropTable("bank_accounts").ifExists().execute();
}
//# sourceMappingURL=1745374123998_create_bank_accounts_table.js.map