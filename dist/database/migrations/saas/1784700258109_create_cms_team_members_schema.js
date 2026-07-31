"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("cms_team_members")
        .ifNotExists()
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("name", "varchar(255)", (col) => col.notNull())
        .addColumn("designation", "varchar(255)", (col) => col.notNull())
        .addColumn("bio", "text", (col) => col.notNull())
        .addColumn("profileImage", "varchar(255)")
        .addColumn("displayOrder", "integer", (col) => col.notNull().defaultTo(0))
        .addColumn("status", "varchar(50)", (col) => col.notNull().defaultTo("ACTIVE"))
        .addColumn("metadata", "json")
        .addColumn("disableReason", "text")
        .addColumn("createdBy", "uuid", (col) => col.references("admins.id").onDelete("restrict"))
        .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("deletedAt", "timestamptz")
        .addColumn("createdAt", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .addColumn("updatedAt", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .execute();
    await db.schema.createIndex("team_members_status_idx").on("cms_team_members").column("status").execute();
    await db.schema.createIndex("team_members_display_order_idx").on("cms_team_members").column("displayOrder").execute();
    await db.schema.createIndex("team_members_deleted_at_idx").on("cms_team_members").column("deletedAt").execute();
}
async function down(db) {
    await db.schema.dropIndex("team_members_deleted_at_idx").ifExists().execute();
    await db.schema.dropIndex("team_members_display_order_idx").ifExists().execute();
    await db.schema.dropIndex("team_members_status_idx").ifExists().execute();
    await db.schema.dropTable("cms_team_members").ifExists().execute();
}
//# sourceMappingURL=1784700258109_create_cms_team_members_schema.js.map