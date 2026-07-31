"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("bill_payment_transactions")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("code", "varchar(18)", (col) => col.notNull())
        .addColumn("amount", "double precision", (col) => col.notNull().defaultTo(0))
        .addColumn("fiscalYear", "varchar(7)", (col) => col.notNull())
        .addColumn("supplierId", "uuid", (col) => col.references("suppliers.id").onDelete("restrict").notNull())
        .addColumn("paymentMethodId", "uuid", (col) => col.references("payment_methods.id").notNull().onDelete("restrict"))
        .addColumn("paymentDate", "timestamptz", (col) => col.notNull())
        .addColumn("billId", "uuid", (col) => col.references("purchase_order_bills.id").onDelete("restrict"))
        .addColumn("bankAccountId", "uuid", (col) => col.references("bank_accounts.id").onDelete("set null"))
        .addColumn("refNo", "varchar(100)")
        .addColumn("note", "varchar")
        .addColumn("metadata", "json")
        .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
        .addColumn("isDeleted", "boolean", (col) => col.defaultTo(false))
        .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("deletedAt", "timestamptz")
        .addColumn("createdAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .execute();
    await db.schema.createIndex("payment_bill_idx").on("bill_payment_transactions").column("billId").execute();
    await db.schema.createIndex("payment_supplierId_idx").on("bill_payment_transactions").column("supplierId").execute();
    await db.schema.createIndex("payment_code_idx").on("bill_payment_transactions").column("code").execute();
    await db.schema.createIndex("payment_refNo_idx").on("bill_payment_transactions").column("refNo").execute();
}
async function down(db) {
    await db.schema.dropIndex("payment_code_idx").execute();
    await db.schema.dropIndex("payment_bill_idx").execute();
    await db.schema.dropIndex("payment_supplierId_idx").execute();
    await db.schema.dropIndex("payment_refNo_idx").execute();
    await db.schema.dropTable("bill_payment_transactions").execute();
}
//# sourceMappingURL=1745563686110_create_bill_payment_transaction_table.js.map