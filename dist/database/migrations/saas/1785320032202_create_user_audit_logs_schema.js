"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("user_audit_logs")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("userId", "uuid", (col) => col.references("admins.id").notNull().onDelete("cascade"))
        .addColumn("previousLogs", "jsonb", (col) => col.notNull().defaultTo((0, kysely_1.sql) `'{}'::jsonb`))
        .addColumn("currentLogs", "jsonb", (col) => col.notNull().defaultTo((0, kysely_1.sql) `'{}'::jsonb`))
        .addColumn("event", "text", (col) => col.notNull())
        .addColumn("resource", "text", (col) => col.notNull())
        .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
        .addColumn("remark", "text", (col) => col.notNull())
        .addColumn("description", "text")
        .addColumn("metadata", "json")
        .addColumn("createdAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .execute();
    await db.schema.createIndex("user_audit_logs_user_idx").on("user_audit_logs").column("userId").execute();
}
async function down(db) {
    await db.schema.dropIndex("user_audit_logs_user_idx").ifExists().execute();
    await db.schema.dropTable("user_audit_logs").ifExists().execute();
}
//# sourceMappingURL=1785320032202_create_user_audit_logs_schema.js.map