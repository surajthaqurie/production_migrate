"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("tenant_follow_up_files")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("followUpId", "uuid", (col) => col.notNull().references("tenant_follow_ups.id").onDelete("cascade"))
        .addColumn("fileId", "uuid", (col) => col.notNull().references("system_files.id").onDelete("restrict"))
        .addColumn("createdBy", "uuid", (col) => col.notNull().references("admins.id").onDelete("restrict"))
        .addColumn("createdAt", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .addUniqueConstraint("unique_tenant_follow_up_files_follow_up_file", ["followUpId", "fileId"])
        .execute();
    await db.schema.createIndex("idx_tenant_follow_up_files_follow_up").on("tenant_follow_up_files").column("followUpId").execute();
}
async function down(db) {
    await db.schema.dropIndex("idx_tenant_follow_up_files_follow_up").ifExists().execute();
    await db.schema.dropTable("tenant_follow_up_files").ifExists().execute();
}
//# sourceMappingURL=1781523114694_tenant_follow_up_files_schema.js.map