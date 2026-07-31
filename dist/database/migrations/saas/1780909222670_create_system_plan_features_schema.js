"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("system_plan_features")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("categoryId", "uuid", (col) => col.notNull().references("plan_categories.id").onDelete("restrict"))
        .addColumn("name", "varchar(255)", (col) => col.notNull())
        .addColumn("slug", "text", (col) => col.notNull().unique())
        .addColumn("order", "integer", (col) => col.notNull().defaultTo(0))
        .addColumn("module", "varchar(100)")
        .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
        .addColumn("updatedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("isDeleted", "boolean", (col) => col.notNull().defaultTo(false))
        .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("deletedAt", "timestamptz")
        .addColumn("createdAt", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .addColumn("updatedAt", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .execute();
    await db.schema.createIndex("system_plan_features_category_idx").on("system_plan_features").column("categoryId").execute();
    await db.schema.createIndex("system_plan_features_module_idx").on("system_plan_features").column("module").execute();
    await db.schema.createIndex("system_plan_features_display_order_idx").on("system_plan_features").column("order").execute();
    await db.schema.createIndex("system_plan_features_is_deleted_idx").on("system_plan_features").column("isDeleted").execute();
}
async function down(db) {
    await db.schema.dropIndex("system_plan_features_is_deleted_idx").ifExists().execute();
    await db.schema.dropIndex("system_plan_features_display_order_idx").ifExists().execute();
    await db.schema.dropIndex("system_plan_features_module_idx").ifExists().execute();
    await db.schema.dropIndex("system_plan_features_category_idx").ifExists().execute();
    await db.schema.dropTable("system_plan_features").ifExists().execute();
}
//# sourceMappingURL=1780909222670_create_system_plan_features_schema.js.map