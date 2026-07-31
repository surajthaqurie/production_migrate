"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("ecommerce_contact_us")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("fullName", "varchar(100)", (col) => col.notNull())
        .addColumn("email", "varchar(255)", (col) => col.notNull())
        .addColumn("message", "text", (col) => col.notNull())
        .addColumn("status", "varchar(50)", (col) => col.defaultTo("NEW").notNull())
        .addColumn("isRead", "boolean", (col) => col.defaultTo(false))
        .addColumn("metadata", "jsonb")
        .addColumn("isDeleted", "boolean", (col) => col.defaultTo(false))
        .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("deletedAt", "timestamptz")
        .addColumn("createdAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .execute();
    await db.schema.createIndex("ecommerce_contact_us_email_idx").on("ecommerce_contact_us").column("email").execute();
    await db.schema.createIndex("ecommerce_contact_us_status_idx").on("ecommerce_contact_us").column("status").execute();
    await db.schema.createIndex("ecommerce_contact_us_created_at_idx").on("ecommerce_contact_us").column("createdAt").execute();
    await db.schema.createIndex("ecommerce_contact_us_is_read_idx").on("ecommerce_contact_us").column("isRead").execute();
}
async function down(db) {
    await db.schema.dropIndex("ecommerce_contact_us_email_idx").ifExists().execute();
    await db.schema.dropIndex("ecommerce_contact_us_status_idx").ifExists().execute();
    await db.schema.dropIndex("ecommerce_contact_us_created_at_idx").ifExists().execute();
    await db.schema.dropIndex("ecommerce_contact_us_is_read_idx").ifExists().execute();
    await db.schema.dropTable("ecommerce_contact_us").ifExists().execute();
}
//# sourceMappingURL=1777026288080_ecommerce_contact_us.js.map