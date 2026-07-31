"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("branch_configs")
        .addColumn("branchId", "uuid", (col) => col.references("branches.id").notNull().unique().onDelete("restrict"))
        .addColumn("pendingPurchaseOrder", "boolean", (col) => col.defaultTo(false))
        .addColumn("pendingPurchaseBill", "boolean", (col) => col.defaultTo(false))
        .addColumn("pendingGrn", "boolean", (col) => col.defaultTo(false))
        .addColumn("pendingAdjustment", "boolean", (col) => col.defaultTo(false))
        .addColumn("pendingDebitNote", "boolean", (col) => col.defaultTo(false))
        .addColumn("pendingCreditNote", "boolean", (col) => col.defaultTo(false))
        .addColumn("pendingSalesOrder", "boolean", (col) => col.defaultTo(false))
        .addColumn("pendingSalesInvoice", "boolean", (col) => col.defaultTo(false))
        .addColumn("pendingStockIssue", "boolean", (col) => col.defaultTo(false))
        .addColumn("metadata", "json")
        .addColumn("createdAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .execute();
}
async function down(db) {
    await db.schema.dropTable("branch_configs").ifExists().execute();
}
//# sourceMappingURL=1752140718369_branch_configs.js.map