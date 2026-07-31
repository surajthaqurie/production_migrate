"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("system_plans")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("name", "varchar(255)", (col) => col.notNull())
        .addColumn("slug", "text", (col) => col.notNull())
        .addColumn("isDefault", "boolean", (col) => col.defaultTo(false))
        .addColumn("isCustom", "boolean", (col) => col.defaultTo(false))
        .addColumn("description", "text")
        .addColumn("metadata", "json")
        .addColumn("currency", "varchar(3)", (col) => col.notNull().defaultTo("NRP"))
        .addColumn("interval", "varchar(20)", (col) => col.notNull())
        .addColumn("price", "double precision", (col) => col.notNull())
        .addColumn("discountType", (0, kysely_1.sql) `discount_type`)
        .addColumn("discountValue", "double precision")
        .addColumn("totalAmount", "double precision", (col) => col.notNull())
        .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
        .addColumn("isDeleted", "boolean", (col) => col.defaultTo(false))
        .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("deletedAt", "timestamptz")
        .addColumn("createdAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addUniqueConstraint("system_plans_slug_interval_unique", ["slug", "interval"])
        .execute();
    await db.schema.createIndex("system_plans_created_by_idx").on("system_plans").column("createdBy").execute();
    await db.schema.createIndex("system_plans_currency_idx").on("system_plans").column("currency").execute();
    await db.schema.createIndex("system_plans_interval_idx").on("system_plans").column("interval").execute();
    await db.schema.createIndex("system_plans_created_at_idx").on("system_plans").column("createdAt").execute();
}
async function down(db) {
    await db.schema.dropIndex("system_plans_currency_idx").ifExists().execute();
    await db.schema.dropIndex("system_plans_created_by_idx").ifExists().execute();
    await db.schema.dropIndex("system_plans_interval_idx").ifExists().execute();
    await db.schema.dropIndex("system_plans_created_at_idx").ifExists().execute();
    await db.schema.dropTable("system_plans").ifExists().execute();
}
//# sourceMappingURL=1780896295297_implement_system_plan_schema.js.map