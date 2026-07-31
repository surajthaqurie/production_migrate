import { Kysely, sql } from "kysely";
import { DB } from "src/tenant-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("purchase_grn_items")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))

    .addColumn("productId", "uuid", (col) => col.references("products.id").notNull().onDelete("restrict"))
    .addColumn("grnId", "uuid", (col) => col.references("purchase_grn.id").notNull().onDelete("restrict"))
    .addColumn("batchId", "uuid", (col) => col.references("product_batch.id"))

    .addColumn("discountValue", "double precision")
    .addColumn("discountType", sql`discount_type`)
    .addColumn("vat", "double precision", (col) => col.defaultTo(0))

    .addColumn("ratePerItem", "double precision", (col) => col.notNull())
    .addColumn("quantity", "integer", (col) => col.notNull().defaultTo(0))
    .addColumn("totalPrice", "double precision", (col) => col.notNull().defaultTo(0))

    .addColumn("metadata", "json")

    .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))

    .addColumn("createdAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())

    //Unique the product and grn
    .addUniqueConstraint("unique_grn_product", ["productId", "grnId"])
    // .addUniqueConstraint("unique_grn_batch_product", ["productId", "grnId", "batchId"])

    .execute();

  //@Index for fast filtering by orderId
  await db.schema.createIndex("purchase_grn_items_grnId_idx").on("purchase_grn_items").column("grnId").execute();
  await db.schema.createIndex("purchase_grn_items_product_idx").on("purchase_grn_items").column("productId").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("purchase_grn_items_grnId_idx").execute();
  await db.schema.dropIndex("purchase_grn_items_product_idx").execute();

  //Drop table
  await db.schema.dropTable("purchase_grn_items").ifExists().execute();
}
