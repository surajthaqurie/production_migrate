import { sql, type Kysely } from "kysely";
import { DB } from "src/tenant-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("payable_opening_balances")
    // .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))

    .addColumn("branchId", "uuid", (col) => col.references("branches.id").notNull().onDelete("restrict"))
    .addColumn("billId", "uuid", (col) => col.references("purchase_order_bills.id").notNull().onDelete("cascade"))

    // .addColumn("supplierId", "uuid", (col) => col.references("suppliers.id").notNull().onDelete("cascade"))
    // .addColumn("status", sql`order_bill_status`, (col) => col.notNull())

    .addColumn("fiscalYear", "varchar(7)", (col) => col.notNull())
    .addColumn("previousFiscalYear", "varchar(7)")

    .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))

    .addColumn("createdAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())

    .addUniqueConstraint("unique_payable_fiscal_bill", ["fiscalYear", "billId"])
    // .addUniqueConstraint("unique_supplier_fiscal_bill", ["fiscalYear", "supplierId", "billId"])

    .execute();

  // await db.schema.createIndex("payable_opening_balances_supplier_idx").on("payable_opening_balances").column("supplierId").execute();
  await db.schema.createIndex("payable_opening_balances_fiscal_year_idx").on("payable_opening_balances").column("fiscalYear").execute();
  await db.schema.createIndex("payable_opening_balances_bill_idx").on("payable_opening_balances").column("billId").execute();
  await db.schema.createIndex("payable_opening_balances_branch_idx").on("payable_opening_balances").column("branchId").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  // await db.schema.dropIndex("payable_opening_balances_supplier_idx").execute();
  await db.schema.dropIndex("payable_opening_balances_fiscal_year_idx").execute();
  await db.schema.dropIndex("payable_opening_balances_bill_idx").execute();
  await db.schema.dropIndex("payable_opening_balances_branch_idx").execute();

  //Drop table
  await db.schema.dropTable("payable_opening_balances").ifExists().execute();
}
