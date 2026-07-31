"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("plan_categories")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("name", "varchar(255)", (col) => col.notNull())
        .addColumn("slug", "text", (col) => col.notNull().unique())
        .addColumn("order", "integer", (col) => col.notNull().defaultTo(0))
        .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
        .addColumn("updatedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("isDeleted", "boolean", (col) => col.notNull().defaultTo(false))
        .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("deletedAt", "timestamptz")
        .addColumn("createdAt", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .addColumn("updatedAt", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .execute();
    await db.schema.createIndex("plan_categories_display_order_idx").on("plan_categories").column("order").execute();
    await db.schema.createIndex("plan_categories_is_deleted_idx").on("plan_categories").column("isDeleted").execute();
}
async function down(db) {
    await db.schema.dropIndex("plan_categories_is_deleted_idx").ifExists().execute();
    await db.schema.dropIndex("plan_categories_display_order_idx").ifExists().execute();
    await db.schema.dropTable("plan_categories").ifExists().execute();
}
//# sourceMappingURL=1780909222660_create_plan_categories_schema.js.map