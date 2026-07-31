"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("tenant_people")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("tenantId", "uuid", (col) => col.notNull().references("tenants.id").onDelete("restrict"))
        .addColumn("personId", "uuid", (col) => col.notNull().unique().references("people_management.id").onDelete("restrict"))
        .addColumn("createdBy", "uuid", (col) => col.notNull().references("admins.id").onDelete("restrict"))
        .addColumn("createdAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .execute();
    await db.schema.createIndex("tenant_people_tenant_idx").on("tenant_people").column("tenantId").execute();
    await db.schema.createIndex("tenant_people_creator_idx").on("tenant_people").column("createdBy").execute();
}
async function down(db) {
    await db.schema.dropIndex("tenant_people_tenant_idx").ifExists().execute();
    await db.schema.dropIndex("tenant_people_creator_idx").ifExists().execute();
    await db.schema.dropTable("tenant_people").execute();
}
//# sourceMappingURL=1780988677052_tenant_people_schema.js.map