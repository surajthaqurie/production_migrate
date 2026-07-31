"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("tenants")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("name", "varchar(255)", (col) => col.notNull())
        .addColumn("slug", "text", (col) => col.notNull().unique())
        .addColumn("databaseName", "varchar(100)", (col) => col.notNull().unique())
        .addColumn("tenantDomain", "text", (col) => col.notNull().unique())
        .addColumn("ecommerceDomain", "text", (col) => col.unique())
        .addColumn("status", "varchar(50)", (col) => col.defaultTo("PENDING").notNull())
        .addColumn("isDefault", "boolean", (col) => col.defaultTo(false).notNull())
        .addColumn("createdBy", "uuid", (col) => col.notNull().references("admins.id").onDelete("restrict"))
        .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("deletedAt", "timestamptz")
        .addColumn("isDeleted", "boolean", (col) => col.defaultTo(false).notNull())
        .addColumn("createdAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .execute();
    await db.schema.createIndex("tenants_name_idx").on("tenants").column("name").execute();
}
async function down(db) {
    await db.schema.dropIndex("tenants_name_idx").ifExists().execute();
    await db.schema.dropTable("tenants").execute();
}
//# sourceMappingURL=1777224406104_tenant_schema.js.map