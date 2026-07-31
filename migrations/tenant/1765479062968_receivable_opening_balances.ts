import { sql, type Kysely } from "kysely";
import { DB } from "src/tenant-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("receivable_opening_balances")
    // .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn("branchId", "uuid", (col) => col.references("branches.id").notNull().onDelete("restrict"))

    .addColumn("fiscalYear", "varchar(7)", (col) => col.notNull())
    .addColumn("previousFiscalYear", "varchar(7)")

    // .addColumn("status", sql`order_bill_status`, (col) => col.notNull())
    // .addColumn("customerId", "uuid", (col) => col.references("customers.id").notNull().onDelete("restrict"))

    .addColumn("billId", "uuid", (col) => col.references("sales_order_bills.id").notNull().onDelete("restrict"))
    .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))

    .addColumn("createdAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())

    // .addUniqueConstraint("unique_customer_fiscal_bill", ["fiscalYear", "customerId", "billId"])
    .addUniqueConstraint("unique_receivable_fiscal_bill", ["fiscalYear", "billId"])
    .execute();

  // Indexes for fast queries
  // await db.schema.createIndex("receivable_opening_balances_customer_idx").on("receivable_opening_balances").column("customerId").execute();
  await db.schema.createIndex("receivable_opening_balances_fiscal_year_idx").on("receivable_opening_balances").column("fiscalYear").execute();
  await db.schema.createIndex("receivable_opening_balances_bill_idx").on("receivable_opening_balances").column("billId").execute();
  await db.schema.createIndex("receivable_opening_balances_branch_idx").on("receivable_opening_balances").column("branchId").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  // await db.schema.dropIndex("receivable_opening_balances_customer_idx").execute();
  await db.schema.dropIndex("receivable_opening_balances_fiscal_year_idx").execute();
  await db.schema.dropIndex("receivable_opening_balances_bill_idx").execute();
  await db.schema.dropIndex("receivable_opening_balances_branch_idx").execute();

  //Drop table
  await db.schema.dropTable("receivable_opening_balances").ifExists().execute();
}
