"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("support_ticket_categories")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("name", "varchar(100)", (col) => col.notNull())
        .addColumn("slug", "text", (col) => col.notNull().unique())
        .addColumn("description", "text")
        .addColumn("createdBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("deletedAt", "timestamptz")
        .addColumn("createdAt", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .addColumn("updatedAt", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .execute();
}
async function down(db) {
    await db.schema.dropTable("support_ticket_categories").ifExists().execute();
}
//# sourceMappingURL=1781597703868_support_category_schema.js.map