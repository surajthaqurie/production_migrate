import { Kysely, sql } from "kysely";
import { DB } from "src/tenant-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("bill_payment_transactions")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
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
  await db.schema.createIndex("payment_bill_idx").on("bill_payment_transactions").column("billId").execute();
  await db.schema.createIndex("payment_supplierId_idx").on("bill_payment_transactions").column("supplierId").execute();
  await db.schema.createIndex("payment_code_idx").on("bill_payment_transactions").column("code").execute();
  await db.schema.createIndex("payment_refNo_idx").on("bill_payment_transactions").column("refNo").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("payment_code_idx").execute();
  await db.schema.dropIndex("payment_bill_idx").execute();
  await db.schema.dropIndex("payment_supplierId_idx").execute();
  await db.schema.dropIndex("payment_refNo_idx").execute();

  //Drop table
  await db.schema.dropTable("bill_payment_transactions").execute();
}
