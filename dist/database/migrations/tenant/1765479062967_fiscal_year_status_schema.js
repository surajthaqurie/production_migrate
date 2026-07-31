"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("fiscal_year_status")
        .addColumn("branchId", "uuid", (col) => col.references("branches.id").notNull().onDelete("restrict"))
        .addColumn("fiscalYear", "varchar(7)", (col) => col.notNull())
        .addColumn("previousFiscalYear", "varchar(7)")
        .addColumn("isLocked", "boolean", (col) => col.notNull().defaultTo(false))
        .addColumn("lockedDate", "timestamptz")
        .addColumn("lockedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("isTransferred", "boolean", (col) => col.notNull().defaultTo(false))
        .addColumn("transferDate", "timestamptz")
        .addColumn("transferBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("isInventoryTransferred", "boolean", (col) => col.notNull().defaultTo(false))
        .addColumn("isSupplierTransferred", "boolean", (col) => col.notNull().defaultTo(false))
        .addColumn("isCustomerTransferred", "boolean", (col) => col.notNull().defaultTo(false))
        .addColumn("isTransitTransferred", "boolean", (col) => col.notNull().defaultTo(false))
        .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
        .addColumn("createdAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addUniqueConstraint("unique_fiscal_year_branch", ["fiscalYear", "branchId"])
        .execute();
    await db.schema.createIndex("fiscal_year_status_branch_idx").on("fiscal_year_status").column("branchId").execute();
    await db.schema.createIndex("fiscal_year_status_createdBy_idx").on("fiscal_year_status").column("createdBy").execute();
}
async function down(db) {
    await db.schema.dropIndex("fiscal_year_status_branch_idx").execute();
    await db.schema.dropIndex("fiscal_year_status_createdBy_idx").execute();
    await db.schema.dropTable("fiscal_year_status").ifExists().execute();
}
//# sourceMappingURL=1765479062967_fiscal_year_status_schema.js.map