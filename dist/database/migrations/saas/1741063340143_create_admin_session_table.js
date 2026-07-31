"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("admin_sessions")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("refreshToken", "varchar(255)", (col) => col.notNull().unique())
        .addColumn("sessionSecret", "varchar(255)", (col) => col.notNull().unique())
        .addColumn("isDeleted", "boolean", (col) => col.defaultTo(false))
        .addColumn("createdBy", "uuid", (col) => col.notNull().references("admins.id").onDelete("cascade"))
        .addColumn("agentMeta", "jsonb", (col) => col.notNull())
        .addColumn("metadata", "json")
        .addColumn("createdAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .execute();
}
async function down(db) {
    await db.schema.dropTable("admin_sessions").ifExists().execute();
}
//# sourceMappingURL=1741063340143_create_admin_session_table.js.map