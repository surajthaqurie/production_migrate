import { Kysely, sql } from "kysely";
import { DB } from "src/tenant-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("invoice_receipt_transactions")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn("code", "varchar(18)", (col) => col.notNull())
    .addColumn("fiscalYear", "varchar(7)", (col) => col.notNull())
    .addColumn("amount", "double precision", (col) => col.notNull().defaultTo(0))
    .addColumn("paymentDate", "timestamptz", (col) => col.notNull())

    .addColumn("customerId", "uuid", (col) => col.references("customers.id").onDelete("restrict").notNull())
    .addColumn("billId", "uuid", (col) => col.references("sales_order_bills.id").notNull().onDelete("restrict"))

    .addColumn("paymentMethodId", "uuid", (col) => col.references("payment_methods.id").notNull().onDelete("restrict"))
    .addColumn("bankAccountId", "uuid", (col) => col.references("bank_accounts.id").onDelete("set null"))

    .addColumn("refNo", "varchar(100)")
    .addColumn("note", "varchar")

    // .addColumn("hasTDS", "boolean", (col) => col.defaultTo(false))
    // .addColumn("tdsInfo", "json") // { amount:"", type:""}

    // .addColumn("hasBankCharge", "boolean", (col) => col.defaultTo(false))
    // .addColumn("bankChargeInfo", "json") // { financialAccountId:"", amount:""}

    .addColumn("metadata", "json")

    .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
    .addColumn("isDeleted", "boolean", (col) => col.defaultTo(false))
    .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
    .addColumn("deletedAt", "timestamptz")

    .addColumn("createdAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())

    .execute();

  //@Index for fast filtering by orderId
  await db.schema.createIndex("invoice_transaction_bill_idx").on("invoice_receipt_transactions").column("billId").execute();
  await db.schema.createIndex("invoice_transaction_customer_idx").on("invoice_receipt_transactions").column("customerId").execute();
  await db.schema.createIndex("invoice_transaction_code_idx").on("invoice_receipt_transactions").column("code").execute();
  await db.schema.createIndex("invoice_transaction_refNo_idx").on("invoice_receipt_transactions").column("refNo").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("invoice_transaction_code_idx").execute();
  await db.schema.dropIndex("invoice_transaction_bill_idx").execute();
  await db.schema.dropIndex("invoice_transaction_customer_idx").execute();
  await db.schema.dropIndex("invoice_transaction_refNo_idx").execute();

  //Drop table
  await db.schema.dropTable("invoice_receipt_transactions").execute();
}
