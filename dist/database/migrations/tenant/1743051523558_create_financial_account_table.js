"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("financial_accounts")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("name", "varchar(255)", (col) => col.notNull())
        .addColumn("slug", "text", (col) => col.unique().notNull())
        .addColumn("code", "varchar(18)", (col) => col.notNull().unique())
        .addColumn("isDefault", "boolean", (col) => col.defaultTo(false))
        .addColumn("accountChartId", "uuid", (col) => col.references("account_charts.id").notNull().onDelete("restrict"))
        .addColumn("groupType", (0, kysely_1.sql) `account_chart_groups`, (col) => col.notNull())
        .addColumn("description", "text")
        .addColumn("metadata", "json")
        .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
        .addColumn("isDeleted", "boolean", (col) => col.defaultTo(false))
        .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("deletedAt", "timestamptz")
        .addColumn("createdAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .execute();
    await db.schema.createIndex("financial_accounts_name_idx").on("financial_accounts").column("name").execute();
}
async function down(db) {
    await db.schema.dropIndex("financial_accounts_name_idx").execute();
    await db.schema.dropTable("financial_accounts").ifExists().execute();
}
//# sourceMappingURL=1743051523558_create_financial_account_table.js.map