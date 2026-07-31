"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("ecommerce_mission_vision")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("tenantId", "uuid", (col) => col.notNull().references("companies.id").onDelete("cascade"))
        .addColumn("title", "varchar(255)", (col) => col.notNull())
        .addColumn("slug", "text", (col) => col.notNull())
        .addColumn("description", "text", (col) => col.notNull())
        .addColumn("createdBy", "uuid", (col) => col.notNull().references("admins.id").onDelete("restrict"))
        .addColumn("isDeleted", "boolean", (col) => col.notNull().defaultTo(false))
        .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("deletedAt", "timestamptz")
        .addColumn("createdAt", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .addColumn("updatedAt", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .addUniqueConstraint("unique_ecommerce_mission_vision_tenant_slug", ["tenantId", "slug"])
        .execute();
    await db.schema.createIndex("ecommerce_mission_vision_tenant_idx").on("ecommerce_mission_vision").column("tenantId").execute();
    await db.schema.createIndex("ecommerce_mission_vision_slug_idx").on("ecommerce_mission_vision").column("slug").execute();
}
async function down(db) {
    await db.schema.dropIndex("ecommerce_mission_vision_slug_idx").ifExists().execute();
    await db.schema.dropIndex("ecommerce_mission_vision_tenant_idx").ifExists().execute();
    await db.schema.dropTable("ecommerce_mission_vision").ifExists().execute();
}
//# sourceMappingURL=1776859198804_ecommerce_mission_vision_schema.js.map