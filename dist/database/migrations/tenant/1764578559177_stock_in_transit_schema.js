"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("stock_in_transit")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("fiscalYear", "varchar(7)", (col) => col.notNull())
        .addColumn("code", "varchar(18)", (col) => col.notNull().unique())
        .addColumn("status", (0, kysely_1.sql) `material_transit_status`, (col) => col.notNull().defaultTo((0, kysely_1.sql) `'IN_TRANSIT'`))
        .addColumn("quantity", "integer", (col) => col.notNull().defaultTo(0))
        .addColumn("branchId", "uuid", (col) => col.references("branches.id").notNull().onDelete("restrict"))
        .addColumn("stockIssueId", "uuid", (col) => col.references("stock_issues.id").onDelete("restrict"))
        .addColumn("requisitionId", "uuid", (col) => col.references("material_requisitions.id").onDelete("restrict"))
        .addColumn("metadata", "json")
        .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
        .addColumn("voidedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("voidedAt", "timestamptz")
        .addColumn("voidReason", "text")
        .addColumn("settledBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("settledAt", "timestamptz")
        .addColumn("createdAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .execute();
    await db.schema.createIndex("stock_in_transit_stock_issue_idx").on("stock_in_transit").column("stockIssueId").execute();
    await db.schema.createIndex("stock_in_transit_requisition_idx").on("stock_in_transit").column("requisitionId").execute();
    await db.schema.createIndex("stock_in_transit_fiscalYear_idx").on("stock_in_transit").column("fiscalYear").execute();
    await db.schema.createIndex("stock_in_transit_branch_idx").on("stock_in_transit").column("branchId").execute();
}
async function down(db) {
    await db.schema.dropIndex("stock_in_transit_stock_issue_idx").execute();
    await db.schema.dropIndex("stock_in_transit_requisition_idx").execute();
    await db.schema.dropIndex("stock_in_transit_fiscalYear_idx").execute();
    await db.schema.dropIndex("stock_in_transit_branch_idx").execute();
    await db.schema.dropTable("stock_in_transit").ifExists().execute();
}
//# sourceMappingURL=1764578559177_stock_in_transit_schema.js.map