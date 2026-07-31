"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("user_activity_logs")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("userId", "uuid", (col) => col.references("admins.id").notNull().onDelete("cascade"))
        .addColumn("method", "text", (col) => col.notNull())
        .addColumn("path", "text", (col) => col.notNull())
        .addColumn("statusCode", "integer", (col) => col.notNull())
        .addColumn("executionTime", "integer", (col) => col.notNull())
        .addColumn("ipAddress", "text")
        .addColumn("userAgent", "text")
        .addColumn("requestBody", "json")
        .addColumn("createdAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .execute();
    await db.schema.createIndex("user_activity_logs_user_idx").on("user_activity_logs").column("userId").execute();
}
async function down(db) {
    await db.schema.dropIndex("user_activity_logs_user_idx").ifExists().execute();
    await db.schema.dropTable("user_activity_logs").ifExists().execute();
}
//# sourceMappingURL=1785321499658_create_user_activities_schema.js.map