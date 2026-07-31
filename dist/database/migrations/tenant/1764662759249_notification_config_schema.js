"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("notification_configs")
        .addColumn("branchId", "uuid", (col) => col.references("branches.id").notNull().onDelete("restrict"))
        .addColumn("userId", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
        .addColumn("notificationId", "uuid", (col) => col.references("system_notifications.id").notNull().onDelete("restrict"))
        .addColumn("isActive", "boolean", (col) => col.notNull().defaultTo(false))
        .addColumn("createdAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addUniqueConstraint("unique_branch_user_notification", ["branchId", "userId", "notificationId"])
        .addUniqueConstraint("unique_user_notification", ["userId", "notificationId"])
        .execute();
    await db.schema.createIndex("notification_configs_branch_idx").on("notification_configs").column("branchId").execute();
    await db.schema.createIndex("notification_configs_user_idx").on("notification_configs").column("userId").execute();
    await db.schema.createIndex("notification_configs_notification_idx").on("notification_configs").column("notificationId").execute();
}
async function down(db) {
    await db.schema.dropIndex("notification_configs_branch_idx").execute();
    await db.schema.dropIndex("notification_configs_user_idx").execute();
    await db.schema.dropIndex("notification_configs_notification_idx").execute();
    await db.schema.dropTable("notification_configs").ifExists().execute();
}
//# sourceMappingURL=1764662759249_notification_config_schema.js.map