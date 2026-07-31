"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("ecommerce_configs")
        .addColumn("tenantId", "uuid", (col) => col.primaryKey().references("companies.id").onDelete("cascade"))
        .addColumn("domain", "varchar", (col) => col.notNull().unique())
        .addColumn("metadata", "json")
        .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
        .addColumn("enabled", "boolean", (col) => col.notNull().defaultTo(true))
        .addColumn("enabledBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("enabledAt", "timestamptz")
        .addColumn("createdAt", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .addColumn("updatedAt", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .execute();
    await db.schema.createIndex("ecommerce_configs_enabled_idx").on("ecommerce_configs").column("enabled").execute();
}
async function down(db) {
    await db.schema.dropIndex("ecommerce_configs_enabled_idx").on("ecommerce_configs").execute();
    await db.schema.dropTable("ecommerce_configs").ifExists().execute();
}
//# sourceMappingURL=1776229275889_ecommerce_configuration_schema.js.map