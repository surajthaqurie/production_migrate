"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("cms_site_settings")
        .ifNotExists()
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("key", "varchar(255)", (col) => col.notNull().unique())
        .addColumn("value", "text", (col) => col.notNull())
        .addColumn("description", "text")
        .addColumn("metadata", "json")
        .addColumn("disableReason", "text")
        .addColumn("createdBy", "uuid", (col) => col.references("admins.id").onDelete("restrict"))
        .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("deletedAt", "timestamptz")
        .addColumn("updatedAt", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .execute();
    await db.schema.createIndex("site_settings_key_idx").on("cms_site_settings").column("key").execute();
    await db.schema.createIndex("site_settings_deleted_at_idx").on("cms_site_settings").column("deletedAt").execute();
}
async function down(db) {
    await db.schema.dropIndex("site_settings_deleted_at_idx").ifExists().execute();
    await db.schema.dropIndex("site_settings_key_idx").ifExists().execute();
    await db.schema.dropTable("cms_site_settings").ifExists().execute();
}
//# sourceMappingURL=1784600276891_create_cms_site_settings_schema.js.map