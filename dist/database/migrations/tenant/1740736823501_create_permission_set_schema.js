"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("permission_sets")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("resource", "varchar", (col) => col.notNull())
        .addColumn("roleId", "uuid", (col) => col.notNull().references("user_roles.id").onDelete("restrict"))
        .addColumn("isDefault", "boolean", (col) => col.defaultTo(false))
        .addColumn("actions", (0, kysely_1.sql) `text[]`, (col) => col.notNull().defaultTo((0, kysely_1.sql) `'{}'`))
        .addColumn("metadata", "json")
        .addColumn("description", "text")
        .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
        .addColumn("createdAt", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .addColumn("updatedAt", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .execute();
    await db.schema.createIndex("permission_sets_resource_roleId_idx").on("permission_sets").columns(["resource", "roleId"]).unique().execute();
}
async function down(db) {
    await db.schema.dropIndex("permission_sets_resource_role_idx").ifExists().execute();
    await db.schema.dropTable("permission_sets").ifExists().execute();
}
//# sourceMappingURL=1740736823501_create_permission_set_schema.js.map