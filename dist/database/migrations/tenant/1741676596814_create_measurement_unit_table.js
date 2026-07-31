"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("measurement_units")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("slug", "text", (col) => col.unique().notNull())
        .addColumn("name", "varchar", (col) => col.notNull())
        .addColumn("acronymsSlug", "varchar", (col) => col.notNull().unique())
        .addColumn("acronyms", "varchar", (col) => col.notNull())
        .addColumn("unitType", "varchar")
        .addColumn("description", "text")
        .addColumn("metadata", "json")
        .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
        .addColumn("isDeleted", "boolean", (col) => col.defaultTo(false))
        .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("deletedAt", "timestamptz")
        .addColumn("createdAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .execute();
    await db.schema.createIndex("measurement_units_name_idx").on("measurement_units").column("name").execute();
    await db.schema.createIndex("measurement_units_acronyms_idx").on("measurement_units").column("acronyms").execute();
}
async function down(db) {
    await db.schema.dropIndex("measurement_units_name_idx").execute();
    await db.schema.dropIndex("measurement_units_acronyms_idx").execute();
    await db.schema.dropTable("measurement_units").ifExists().execute();
}
//# sourceMappingURL=1741676596814_create_measurement_unit_table.js.map