"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("account_charts")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("name", "varchar(255)", (col) => col.notNull())
        .addColumn("slug", "text", (col) => col.unique().notNull())
        .addColumn("isDefault", "boolean", (col) => col.defaultTo(false))
        .addColumn("groupType", (0, kysely_1.sql) `account_chart_groups`, (col) => col.notNull())
        .addColumn("description", "text")
        .addColumn("metadata", "json")
        .addColumn("parentId", "uuid", (col) => col.references("account_charts.id").onDelete("set null"))
        .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
        .addColumn("isDeleted", "boolean", (col) => col.defaultTo(false))
        .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("deletedAt", "timestamptz")
        .addColumn("createdAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .execute();
    await db.schema.createIndex("account_charts_name_idx").on("account_charts").column("name").execute();
}
async function down(db) {
    await db.schema.dropIndex("account_charts_name_idx").execute();
    await db.schema.dropTable("account_charts").ifExists().execute();
}
//# sourceMappingURL=1742791563925_create_chart_of_accounts_table.js.map