"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("admin_branch_sessions")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("adminId", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
        .addColumn("branchId", "uuid", (col) => col.references("branches.id").notNull().onDelete("restrict"))
        .addColumn("fiscalYear", "varchar(7)", (col) => col.notNull())
        .addColumn("createdAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addUniqueConstraint("unique_admin_branch_fiscal_year_sessions", ["adminId", "branchId", "fiscalYear"])
        .addUniqueConstraint("unique_admin_branch_sessions", ["adminId", "branchId"])
        .execute();
    await db.schema.createIndex("admin_branch_sessions_idx").on("admin_branch_sessions").columns(["adminId", "branchId"]).unique().execute();
}
async function down(db) {
    await db.schema.dropIndex("admin_branch_sessions_idx").ifExists().execute();
    await db.schema.dropTable("admin_branch_sessions").ifExists().execute();
}
//# sourceMappingURL=1741063340162_admin_branch_sessions.js.map