"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("tenant_follow_ups")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("tenantId", "uuid", (col) => col.notNull().references("tenants.id").onDelete("cascade"))
        .addColumn("status", "varchar(20)", (col) => col.notNull().defaultTo("PENDING"))
        .addColumn("content", "text", (col) => col.notNull())
        .addColumn("metadata", "json")
        .addColumn("createdBy", "uuid", (col) => col.notNull().references("admins.id").onDelete("restrict"))
        .addColumn("isDeleted", "boolean", (col) => col.notNull().defaultTo(false))
        .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("deletedAt", "timestamptz")
        .addColumn("createdAt", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .addColumn("updatedAt", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .execute();
    await db.schema.createIndex("idx_tenant_follow_ups_tenant").on("tenant_follow_ups").column("tenantId").execute();
    await db.schema.createIndex("idx_tenant_follow_ups_status").on("tenant_follow_ups").column("status").execute();
    await db.schema.createIndex("idx_tenant_follow_ups_tenant_status").on("tenant_follow_ups").columns(["tenantId", "status"]).execute();
}
async function down(db) {
    await db.schema.dropIndex("idx_tenant_follow_ups_tenant_status").ifExists().execute();
    await db.schema.dropIndex("idx_tenant_follow_ups_status").ifExists().execute();
    await db.schema.dropIndex("idx_tenant_follow_ups_tenant").ifExists().execute();
    await db.schema.dropTable("tenant_follow_ups").ifExists().execute();
}
//# sourceMappingURL=1781523114693_tenant_follow_up_schema.js.map