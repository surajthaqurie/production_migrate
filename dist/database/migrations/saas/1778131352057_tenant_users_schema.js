"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("tenants_users")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("email", "varchar(255)", (col) => col.notNull().unique())
        .addColumn("password", "varchar(255)", (col) => col.notNull())
        .addColumn("displayName", "varchar(255)", (col) => col.notNull())
        .addColumn("contactNumber", "varchar(255)", (col) => col.notNull().unique())
        .addColumn("avatar", "varchar(255)")
        .addColumn("isDefault", "boolean", (col) => col.defaultTo(false))
        .addColumn("online", "boolean", (col) => col.defaultTo(false))
        .addColumn("lastOnline", "timestamptz")
        .addColumn("loginAttempts", "integer", (col) => col.defaultTo(0))
        .addColumn("isSuspended", "boolean", (col) => col.defaultTo(false))
        .addColumn("suspendedFor", "timestamptz")
        .addColumn("tenantId", "uuid", (col) => col.notNull().references("tenants.id").onDelete("restrict"))
        .addColumn("isDeleted", "boolean", (col) => col.defaultTo(false))
        .addColumn("deletedAt", "timestamptz")
        .addColumn("createdAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .execute();
    await db.schema.createIndex("tenants_users_displayName_idx").on("tenants_users").column("displayName").execute();
}
async function down(db) {
    await db.schema.dropIndex("tenants_users_displayName_idx").execute();
    await db.schema.dropTable("tenants_users").ifExists().execute();
}
//# sourceMappingURL=1778131352057_tenant_users_schema.js.map