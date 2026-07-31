import { Kysely, sql } from "kysely";
import { DB } from "src/tenant-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("sales_ocr_invoices")

    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn("fileId", "uuid", (col) => col.notNull().references("system_files.id").onDelete("cascade"))
    .addColumn("status", "varchar", (col) => col.defaultTo(sql`'READY'`))

    .addColumn("invoiceId", "uuid", (col) => col.references("sales_order_bills.id").onDelete("set null"))
    .addColumn("snapshot", "jsonb", (col) => col.notNull())
    .addColumn("createdBy", "uuid", (col) => col.notNull().references("admins.id").onDelete("restrict"))
    .addColumn("warehouseId", "uuid", (col) => col.notNull().references("warehouses.id").onDelete("restrict"))
    .addColumn("branchId", "uuid", (col) => col.notNull().references("branches.id").onDelete("restrict"))
    .addColumn("isProcessCompleted", "boolean", (col) => col.defaultTo(false))

    .addColumn("createdAt", "timestamptz", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn("updatedAt", "timestamptz", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))

    .execute();

  // Add indexes
  await db.schema.createIndex("sales_ocr_invoices_file_id_idx").on("sales_ocr_invoices").column("fileId").execute();
  await db.schema.createIndex("sales_ocr_invoices_invoice_id_idx").on("sales_ocr_invoices").column("invoiceId").execute();
  await db.schema.createIndex("sales_ocr_invoices_created_by_idx").on("sales_ocr_invoices").column("createdBy").execute();
  await db.schema.createIndex("sales_ocr_invoices_warehouse_id_idx").on("sales_ocr_invoices").column("warehouseId").execute();
  await db.schema.createIndex("sales_ocr_invoices_branch_id_idx").on("sales_ocr_invoices").column("branchId").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("sales_ocr_invoices_file_id_idx").ifExists().execute();
  await db.schema.dropIndex("sales_ocr_invoices_invoice_id_idx").ifExists().execute();
  await db.schema.dropIndex("sales_ocr_invoices_created_by_idx").ifExists().execute();
  await db.schema.dropIndex("sales_ocr_invoices_warehouse_id_idx").ifExists().execute();
  await db.schema.dropIndex("sales_ocr_invoices_branch_id_idx").ifExists().execute();

  //drop table
  await db.schema.dropTable("sales_ocr_invoices").ifExists().execute();
}
