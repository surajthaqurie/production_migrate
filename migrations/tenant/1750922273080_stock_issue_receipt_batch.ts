import { sql, type Kysely } from "kysely";
import { DB } from "src/tenant-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("stock_issue_receipt_batches")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))

    .addColumn("receiptItemId", "uuid", (col) => col.references("stock_issue_receipt.id").notNull().onDelete("cascade"))
    .addColumn("batchId", "uuid", (col) => col.references("product_batch.id").notNull().onDelete("restrict"))
    .addColumn("transitQuantity", "integer", (col) => col.notNull().defaultTo(0))
    .addColumn("receiptQuantity", "integer", (col) => col.notNull().defaultTo(0))

    .addColumn("metadata", "json")
    .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))

    .addUniqueConstraint("unique_stock_receipt_batches", ["receiptItemId", "batchId"])
    .addColumn("createdAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())

    .execute();

  await db.schema.createIndex("stock_issue_receipt_batches_idx").on("stock_issue_receipt_batches").column("receiptItemId").execute();
  await db.schema.createIndex("stock_issue_receipt_batches_batch_idx").on("stock_issue_receipt_batches").column("batchId").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("stock_issue_receipt_batches_idx").execute();
  await db.schema.dropIndex("stock_issue_receipt_batches_batch_idx").execute();

  //Drop table
  await db.schema.dropTable("stock_issue_receipt_batches").ifExists().execute();
}
