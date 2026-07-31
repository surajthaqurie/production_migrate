"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("subscription_overrides")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("subscriptionId", "uuid", (col) => col.notNull().references("subscriptions.id").onDelete("cascade"))
        .addColumn("price", "double precision", (col) => col.notNull())
        .addColumn("currency", "varchar(3)", (col) => col.notNull())
        .addColumn("interval", "varchar(20)", (col) => col.notNull())
        .addColumn("status", "varchar(20)", (col) => col.notNull().defaultTo("PENDING"))
        .addColumn("overrideReason", "text")
        .addColumn("approvedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("approvedAt", "timestamptz")
        .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
        .addColumn("updatedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("disableReason", "text")
        .addColumn("deletedAt", "timestamptz")
        .addColumn("createdAt", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .addColumn("updatedAt", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .execute();
    await db.schema.createIndex("subscription_overrides_subscription_idx").on("subscription_overrides").column("subscriptionId").execute();
    await db.schema.createIndex("subscription_overrides_status_idx").on("subscription_overrides").column("status").execute();
}
async function down(db) {
    await db.schema.dropIndex("subscription_overrides_status_idx").ifExists().execute();
    await db.schema.dropIndex("subscription_overrides_subscription_idx").ifExists().execute();
    await db.schema.dropTable("subscription_overrides").ifExists().execute();
}
//# sourceMappingURL=1783681764860_create_subscription_overrides_schema.js.map