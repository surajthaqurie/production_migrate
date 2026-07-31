"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("user_roles")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("slug", "text", (col) => col.notNull())
        .addColumn("name", "varchar(50)", (col) => col.notNull())
        .addColumn("branchId", "uuid")
        .addColumn("isDefault", "boolean", (col) => col.defaultTo(false))
        .addColumn("metadata", "json")
        .addColumn("description", "text")
        .addColumn("isDeleted", "boolean", (col) => col.defaultTo(false))
        .addColumn("deletedAt", "timestamptz")
        .addColumn("createdAt", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .addColumn("updatedAt", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .addUniqueConstraint("user_roles_slug_branch_unique", ["slug", "branchId"])
        .execute();
    await db.schema.createIndex("user_roles_name_idx").on("user_roles").column("name").execute();
    await db.schema.createIndex("user_roles_branch_idx").on("user_roles").column("branchId").execute();
}
async function down(db) {
    await db.schema.dropIndex("user_roles_name_idx").execute();
    await db.schema.dropIndex("user_roles_branch_idx").execute();
    await db.schema.dropTable("user_roles").ifExists().execute();
}
//# sourceMappingURL=1740736823300_create_user_role_schema.js.map