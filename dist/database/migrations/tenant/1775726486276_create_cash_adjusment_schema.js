"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("cash_adjustments")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("fiscalYear", "varchar(7)", (col) => col.notNull())
        .addColumn("branchId", "uuid", (col) => col.references("branches.id").notNull().onDelete("restrict"))
        .addColumn("refNo", "varchar(100)")
        .addColumn("name", "varchar(255)", (col) => col.notNull())
        .addColumn("type", "varchar(10)", (col) => col.notNull())
        .addColumn("amount", "double precision", (col) => col.notNull().defaultTo(0))
        .addColumn("description", "text")
        .addColumn("fileId", "uuid", (col) => col.references("system_files.id").onDelete("restrict"))
        .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
        .addColumn("createdAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addColumn("isDeleted", "boolean", (col) => col.defaultTo(false).notNull())
        .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("deletedAt", "timestamptz")
        .execute();
    await db.schema.createIndex("cash_adjustments_branch_idx").on("cash_adjustments").column("branchId").execute();
    await db.schema.createIndex("cash_adjustments_fiscal_idx").on("cash_adjustments").column("fiscalYear").execute();
    await db.schema.createIndex("cash_adjustments_branch_fiscal_idx").on("cash_adjustments").columns(["branchId", "fiscalYear"]).execute();
    await db.schema.createIndex("cash_adjustments_branch_creator_idx").on("cash_adjustments").column("createdBy").execute();
    await db.schema.createIndex("cash_adjustments_file_idx").on("cash_adjustments").column("fileId").execute();
}
async function down(db) {
    await db.schema.dropIndex("cash_adjustments_branch_idx").execute();
    await db.schema.dropIndex("cash_adjustments_fiscal_idx").execute();
    await db.schema.dropIndex("cash_adjustments_branch_fiscal_idx").execute();
    await db.schema.dropIndex("cash_adjustments_branch_creator_idx").execute();
    await db.schema.dropIndex("cash_adjustments_file_idx").execute();
    await db.schema.dropTable("cash_adjustments").ifExists().execute();
}
//# sourceMappingURL=1775726486276_create_cash_adjusment_schema.js.map