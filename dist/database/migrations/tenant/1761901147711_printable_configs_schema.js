"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("printable_configs")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("size", "varchar(10)", (col) => col.notNull())
        .addColumn("type", "varchar(255)", (col) => col.notNull())
        .addColumn("branchId", "uuid", (col) => col.references("branches.id").notNull().onDelete("restrict"))
        .addColumn("imageUrl", "text", (col) => col.notNull())
        .addColumn("isActive", "boolean", (col) => col.notNull().defaultTo(false))
        .addColumn("metadata", "json")
        .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
        .addColumn("createdAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addUniqueConstraint("unique_branch_printable_config", ["branchId", "type", "size"])
        .execute();
    await db.schema.createIndex("printable_configs_branch_idx").on("printable_configs").column("branchId").execute();
    await db.schema.createIndex("printable_configs_type_idx").on("printable_configs").column("type").execute();
    await db.schema.createIndex("printable_configs_created_by_idx").on("printable_configs").column("createdBy").execute();
}
async function down(db) {
    await db.schema.dropIndex("printable_configs_branch_idx").execute();
    await db.schema.dropIndex("printable_configs_type_idx").execute();
    await db.schema.dropIndex("printable_configs_created_by_idx").execute();
    await db.schema.dropTable("printable_configs").ifExists().execute();
}
//# sourceMappingURL=1761901147711_printable_configs_schema.js.map