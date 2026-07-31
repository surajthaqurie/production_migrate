"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("system_notifications")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("content", "varchar", (col) => col.notNull())
        .addColumn("action", "varchar", (col) => col.notNull().notNull())
        .addColumn("resource", "varchar", (col) => col.notNull())
        .addColumn("channels", (0, kysely_1.sql) `text[]`, (col) => col.defaultTo((0, kysely_1.sql) `'{}'`))
        .addColumn("createdAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addUniqueConstraint("unique_notification_resource_action", ["resource", "action"])
        .execute();
    await db.schema.createIndex("system_notifications_resource_idx").on("system_notifications").column("resource").execute();
}
async function down(db) {
    await db.schema.dropIndex("system_notifications_resource_idx").execute();
    await db.schema.dropTable("system_notifications").ifExists().execute();
}
//# sourceMappingURL=1764657113183_system_notification_schema.js.map