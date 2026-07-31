"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("receivable_opening_balances")
        .addColumn("branchId", "uuid", (col) => col.references("branches.id").notNull().onDelete("restrict"))
        .addColumn("fiscalYear", "varchar(7)", (col) => col.notNull())
        .addColumn("previousFiscalYear", "varchar(7)")
        .addColumn("billId", "uuid", (col) => col.references("sales_order_bills.id").notNull().onDelete("restrict"))
        .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
        .addColumn("createdAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addUniqueConstraint("unique_receivable_fiscal_bill", ["fiscalYear", "billId"])
        .execute();
    await db.schema.createIndex("receivable_opening_balances_fiscal_year_idx").on("receivable_opening_balances").column("fiscalYear").execute();
    await db.schema.createIndex("receivable_opening_balances_bill_idx").on("receivable_opening_balances").column("billId").execute();
    await db.schema.createIndex("receivable_opening_balances_branch_idx").on("receivable_opening_balances").column("branchId").execute();
}
async function down(db) {
    await db.schema.dropIndex("receivable_opening_balances_fiscal_year_idx").execute();
    await db.schema.dropIndex("receivable_opening_balances_bill_idx").execute();
    await db.schema.dropIndex("receivable_opening_balances_branch_idx").execute();
    await db.schema.dropTable("receivable_opening_balances").ifExists().execute();
}
//# sourceMappingURL=1765479062968_receivable_opening_balances.js.map