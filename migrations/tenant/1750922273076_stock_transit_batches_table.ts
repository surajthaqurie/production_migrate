import { sql, type Kysely } from "kysely";
import { DB } from "src/tenant-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("stock_issue_transit_batches")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))

    .addColumn("transitItemId", "uuid", (col) => col.references("stock_issue_transit.id").notNull().onDelete("cascade"))
    .addColumn("batchId", "uuid", (col) => col.references("product_batch.id").notNull().onDelete("restrict"))
    .addColumn("quantity", "integer", (col) => col.notNull().defaultTo(0))

    .addColumn("metadata", "json")
    .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))

    .addUniqueConstraint("unique_stock_transit_batches", ["transitItemId", "batchId"])
    .addColumn("createdAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())

    .execute();

  await db.schema.createIndex("stock_issue_transit_batches_idx").on("stock_issue_transit_batches").column("transitItemId").execute();
  await db.schema.createIndex("stock_issue_transit_batches_batch_idx").on("stock_issue_transit_batches").column("batchId").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("stock_issue_transit_batches_idx").execute();
  await db.schema.dropIndex("stock_issue_transit_batches_batch_idx").execute();

  //Drop table
  await db.schema.dropTable("stock_issue_transit_batches").ifExists().execute();
}
