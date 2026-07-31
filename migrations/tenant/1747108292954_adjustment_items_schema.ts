import { Kysely, sql } from "kysely";
import { DB } from "src/tenant-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("adjustment_items")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))

    .addColumn("productId", "uuid", (col) => col.references("products.id").notNull().onDelete("restrict"))
    .addColumn("adjustmentId", "uuid", (col) => col.references("product_adjustments.id").notNull().onDelete("restrict"))

    .addColumn("batchId", "uuid", (col) => col.references("product_batch.id").onDelete("restrict"))
    .addColumn("type", sql`adjustment_item_types`)

    .addColumn("ratePerItem", "double precision", (col) => col.notNull().defaultTo(0))
    .addColumn("quantity", "integer", (col) => col.notNull().defaultTo(0))
    .addColumn("totalPrice", "double precision", (col) => col.notNull().defaultTo(0))

    .addColumn("metadata", "json")

    .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
    .addColumn("createdAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())

    //Unique the product and order
    // .addUniqueConstraint("unique_adjustment_product", ["productId", "adjustmentId"])
    .addUniqueConstraint("unique_adjustment_product_batch", ["productId", "adjustmentId", "batchId"])

    .execute();

  await db.schema.createIndex("adjustment_items_product_idx").on("adjustment_items").column("productId").execute();
  await db.schema.createIndex("adjustment_items_adjustment_idx").on("adjustment_items").column("adjustmentId").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("adjustment_items_product_idx").execute();
  await db.schema.dropIndex("adjustment_items_adjustment_idx").execute();

  //Drop table
  await db.schema.dropTable("adjustment_items").ifExists().execute();
}
