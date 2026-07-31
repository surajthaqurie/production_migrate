"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("system_addons")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("name", "varchar(255)", (col) => col.notNull())
        .addColumn("slug", "text", (col) => col.notNull().unique())
        .addColumn("description", "text")
        .addColumn("featureId", "uuid", (col) => col.notNull().references("system_plan_features.id").onDelete("restrict"))
        .addColumn("perPrice", "double precision", (col) => col.notNull())
        .addColumn("currency", "varchar(3)", (col) => col.notNull().defaultTo("NPR"))
        .addColumn("metadata", "json")
        .addColumn("createdBy", "uuid", (col) => col.notNull().references("admins.id").onDelete("restrict"))
        .addColumn("updatedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("isDeleted", "boolean", (col) => col.notNull().defaultTo(false))
        .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("deletedAt", "timestamptz")
        .addColumn("createdAt", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .addColumn("updatedAt", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .execute();
    await db.schema.createIndex("idx_system_addons_feature").on("system_addons").column("featureId").execute();
    await db.schema.createIndex("idx_system_addons_is_deleted").on("system_addons").column("isDeleted").execute();
}
async function down(db) {
    await db.schema.dropIndex("idx_system_addons_is_deleted").ifExists().execute();
    await db.schema.dropIndex("idx_system_addons_feature").ifExists().execute();
    await db.schema.dropTable("system_addons").ifExists().execute();
}
//# sourceMappingURL=1783681764870_create_system_addons_schema.js.map