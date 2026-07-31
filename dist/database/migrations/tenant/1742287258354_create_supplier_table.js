"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("suppliers")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("name", "varchar(255)", (col) => col.notNull())
        .addColumn("slug", "text", (col) => col.unique().notNull())
        .addColumn("code", "varchar(15)", (col) => col.notNull().unique())
        .addColumn("creditLimit", "numeric")
        .addColumn("primaryContact", "varchar(32)", (col) => col.notNull())
        .addColumn("primaryPhone", "varchar(20)", (col) => col.notNull())
        .addColumn("primaryEmail", "varchar(255)", (col) => col.notNull())
        .addColumn("landLineNumber", "varchar(9)")
        .addColumn("location", "text")
        .addColumn("description", "text")
        .addColumn("metadata", "json")
        .addColumn("secondaryPhone", "varchar(255)")
        .addColumn("secondaryEmail", "varchar(255)")
        .addColumn("panNo", "varchar(20)")
        .addColumn("vatNo", "varchar(20)")
        .addColumn("creditTermsId", "uuid", (col) => col.references("credit_terms.id").onDelete("set null"))
        .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
        .addColumn("isDeleted", "boolean", (col) => col.defaultTo(false))
        .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("deletedAt", "timestamptz")
        .addColumn("createdAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .execute();
    await db.schema.createIndex("suppliers_name_idx").on("suppliers").column("name").execute();
    await db.schema.createIndex("suppliers_primaryPhone_idx").on("suppliers").column("primaryPhone").execute();
    await db.schema.createIndex("suppliers_primaryEmail_idx").on("suppliers").column("primaryEmail").execute();
    await db.schema.createIndex("suppliers_location_idx").on("suppliers").column("location").execute();
    await db.schema.createIndex("suppliers_landLineNumber_idx").on("suppliers").column("landLineNumber").execute();
    await db.schema.createIndex("suppliers_secondaryPhone_idx").on("suppliers").column("secondaryPhone").execute();
    await db.schema.createIndex("suppliers_secondaryEmail_idx").on("suppliers").column("secondaryEmail").execute();
}
async function down(db) {
    await db.schema.dropIndex("suppliers_name_idx").execute();
    await db.schema.dropIndex("suppliers_primaryPhone_idx").execute();
    await db.schema.dropIndex("suppliers_primaryEmail_idx").execute();
    await db.schema.dropIndex("suppliers_location_idx").execute();
    await db.schema.dropIndex("suppliers_landLineNumber_idx").execute();
    await db.schema.dropIndex("suppliers_secondaryPhone_idx").execute();
    await db.schema.dropIndex("suppliers_secondaryEmail_idx").execute();
    await db.schema.dropTable("suppliers").ifExists().execute();
}
//# sourceMappingURL=1742287258354_create_supplier_table.js.map