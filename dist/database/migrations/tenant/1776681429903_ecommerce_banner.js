"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("ecommerce_hero_banners")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("fileId", "uuid", (col) => col.notNull().references("system_files.id").onDelete("cascade"))
        .addColumn("tenantId", "uuid", (col) => col.notNull().references("companies.id").onDelete("cascade"))
        .addColumn("type", "varchar(50)", (col) => col.notNull())
        .addColumn("imageAltText", "text")
        .addColumn("placement", "varchar(20)", (col) => col.notNull().defaultTo("BOTTOM_RIGHT"))
        .addColumn("sortOrder", "integer", (col) => col.notNull().defaultTo(0))
        .addColumn("heading", "varchar(225)", (col) => col.notNull())
        .addColumn("headingSlug", "text", (col) => col.notNull())
        .addColumn("description", "text", (col) => col.notNull())
        .addColumn("createdBy", "uuid", (col) => col.notNull().references("admins.id").onDelete("restrict"))
        .addColumn("isDeleted", "boolean", (col) => col.notNull().defaultTo(false))
        .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("deletedAt", "timestamptz")
        .addColumn("createdAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addUniqueConstraint("unique_ecommerce_hero_banners_tenant_heading", ["tenantId", "headingSlug"])
        .execute();
    await db.schema.createIndex("ecommerce_hero_banners_tenant_idx").on("ecommerce_hero_banners").column("tenantId").execute();
    await db.schema.createIndex("ecommerce_hero_banners_type_idx").on("ecommerce_hero_banners").column("type").execute();
    await db.schema.createIndex("ecommerce_hero_banners_heading_idx").on("ecommerce_hero_banners").column("heading").execute();
}
async function down(db) {
    await db.schema.dropIndex("ecommerce_hero_banners_heading_idx").ifExists().execute();
    await db.schema.dropIndex("ecommerce_hero_banners_type_idx").ifExists().execute();
    await db.schema.dropIndex("ecommerce_hero_banners_tenant_idx").ifExists().execute();
    await db.schema.dropTable("ecommerce_hero_banners").ifExists().execute();
}
//# sourceMappingURL=1776681429903_ecommerce_banner.js.map