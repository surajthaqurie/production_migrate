import { sql, type Kysely } from "kysely";
import { DB } from "src/tenant-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("sales_order_item_batches")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))

    .addColumn("orderItemId", "uuid", (col) => col.references("sales_order_items.id").notNull().onDelete("cascade"))
    .addColumn("batchId", "uuid", (col) => col.references("product_batch.id").notNull().onDelete("restrict"))
    .addColumn("quantity", "integer", (col) => col.notNull().defaultTo(0))

    .addColumn("metadata", "json")
    .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))

    .addUniqueConstraint("unique_sales_order_item_batches", ["orderItemId", "batchId"])

    .addColumn("createdAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())

    .execute();

  await db.schema.createIndex("sales_order_item_batches_idx").on("sales_order_item_batches").column("orderItemId").execute();
  await db.schema.createIndex("sales_order_item_batches_batch_idx").on("sales_order_item_batches").column("batchId").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("sales_order_item_batches_idx").execute();
  await db.schema.dropIndex("sales_order_item_batches_batch_idx").execute();

  //Drop table
  await db.schema.dropTable("sales_order_item_batches").ifExists().execute();
}
