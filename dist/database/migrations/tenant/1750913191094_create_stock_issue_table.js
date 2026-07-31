"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("stock_issues")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("code", "varchar(18)", (col) => col.notNull().unique())
        .addColumn("fiscalYear", "varchar(7)", (col) => col.notNull())
        .addColumn("status", (0, kysely_1.sql) `material_transfer_status`, (col) => col.notNull().defaultTo((0, kysely_1.sql) `'PENDING'`))
        .addColumn("warehouseFromId", "uuid", (col) => col.references("warehouses.id").notNull().onDelete("restrict"))
        .addColumn("warehouseToId", "uuid", (col) => col.references("warehouses.id").notNull().onDelete("restrict"))
        .addColumn("issuedDate", "timestamptz", (col) => col.notNull())
        .addColumn("requestAmount", "double precision", (col) => col.notNull().defaultTo(0))
        .addColumn("transitAmount", "double precision", (col) => col.notNull().defaultTo(0))
        .addColumn("receivedAmount", "double precision", (col) => col.notNull().defaultTo(0))
        .addColumn("refNo", "varchar(100)")
        .addColumn("metadata", "json")
        .addColumn("remarks", "text")
        .addColumn("approvedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("approvedAt", "timestamptz")
        .addColumn("transitedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("transitedAt", "timestamptz")
        .addColumn("voidedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("voidedAt", "timestamptz")
        .addColumn("voidReason", "text")
        .addColumn("completedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("completedAt", "timestamptz")
        .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
        .addColumn("isDeleted", "boolean", (col) => col.defaultTo(false))
        .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("deletedAt", "timestamptz")
        .addColumn("createdAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .execute();
    await db.schema.createIndex("stock_issues_warehouseFromId_idx").on("stock_issues").column("warehouseFromId").execute();
    await db.schema.createIndex("stock_issues_warehouseToId_idx").on("stock_issues").column("warehouseToId").execute();
    await db.schema.createIndex("stock_issues_fiscalYear_idx").on("stock_issues").column("fiscalYear").execute();
    await db.schema.createIndex("stock_issues_refNo_idx").on("stock_issues").column("refNo").execute();
}
async function down(db) {
    await db.schema.dropIndex("stock_issues_refNo_idx").execute();
    await db.schema.dropIndex("stock_issues_warehouseFromId_idx").execute();
    await db.schema.dropIndex("stock_issues_warehouseToId_idx").execute();
    await db.schema.dropIndex("stock_issues_fiscalYear_idx").execute();
    await db.schema.dropTable("stock_issues").ifExists().execute();
}
//# sourceMappingURL=1750913191094_create_stock_issue_table.js.map