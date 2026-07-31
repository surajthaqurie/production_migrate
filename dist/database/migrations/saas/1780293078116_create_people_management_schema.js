"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("people_management")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("name", "varchar(100)", (col) => col.notNull())
        .addColumn("email", "varchar(150)", (col) => col.notNull().unique())
        .addColumn("phoneNo", "varchar(20)", (col) => col.notNull().unique())
        .addColumn("source", "varchar(20)", (col) => col.notNull().defaultTo("SAAS"))
        .addColumn("status", "varchar(20)", (col) => col.notNull().defaultTo("ACTIVE"))
        .addColumn("hasCompany", "boolean", (col) => col.notNull().defaultTo(false))
        .addColumn("description", "text")
        .addColumn("metadata", "json")
        .addColumn("createdBy", "uuid", (col) => col.notNull().references("admins.id").onDelete("restrict"))
        .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("isDeleted", "boolean", (col) => col.notNull().defaultTo(false))
        .addColumn("deletedAt", "timestamptz")
        .addColumn("blockedRemark", "text")
        .addColumn("blockedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("blockedAt", "timestamptz")
        .addColumn("createdAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .execute();
    await db.schema.createIndex("idx_people_management_is_deleted").on("people_management").column("isDeleted").execute();
    await db.schema.createIndex("idx_people_management_status").on("people_management").column("status").execute();
    await db.schema.createIndex("idx_people_management_created_by").on("people_management").column("createdBy").execute();
    await db.schema.createIndex("idx_people_management_has_company").on("people_management").column("hasCompany").execute();
    await db.schema.createIndex("idx_people_management_created_at").on("people_management").column("createdAt").execute();
    await db.schema.createIndex("idx_people_management_name").on("people_management").column("name").execute();
}
async function down(db) {
    await db.schema.dropIndex("idx_people_management_name").ifExists().execute();
    await db.schema.dropIndex("idx_people_management_created_at").ifExists().execute();
    await db.schema.dropIndex("idx_people_management_has_company").ifExists().execute();
    await db.schema.dropIndex("idx_people_management_created_by").ifExists().execute();
    await db.schema.dropIndex("idx_people_management_status").ifExists().execute();
    await db.schema.dropIndex("idx_people_management_is_deleted").ifExists().execute();
    await db.schema.dropTable("people_management").ifExists().execute();
}
//# sourceMappingURL=1780293078116_create_people_management_schema.js.map