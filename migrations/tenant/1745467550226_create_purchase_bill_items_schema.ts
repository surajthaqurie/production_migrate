import { Kysely, sql } from "kysely";
import { DB } from "src/tenant-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("purchase_bill_items")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))

    .addColumn("productId", "uuid", (col) => col.references("products.id").notNull().onDelete("restrict"))
    .addColumn("billId", "uuid", (col) => col.references("purchase_order_bills.id").notNull().onDelete("restrict"))
    .addColumn("batchId", "uuid", (col) => col.references("product_batch.id"))

    .addColumn("discountMode", "boolean", (col) => col.defaultTo(false))
    .addColumn("discountValue", "double precision")
    .addColumn("discountType", sql`discount_type`)
    .addColumn("vat", "double precision", (col) => col.defaultTo(0))

    .addColumn("ratePerItem", "double precision", (col) => col.notNull())
    .addColumn("quantity", "integer", (col) => col.notNull().defaultTo(0))
    .addColumn("debitedQuantity", "integer", (col) => col.notNull().defaultTo(0))
    .addColumn("totalPrice", "double precision", (col) => col.notNull().defaultTo(0))

    .addColumn("metadata", "json")

    .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))

    .addColumn("createdAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())

    //Unique the product and bill
    .addUniqueConstraint("unique_bill_product", ["productId", "billId"])

    .execute();

  //@Index for fast filtering by billId
  await db.schema.createIndex("purchase_bill_items_orderId_idx").on("purchase_bill_items").column("billId").execute();
  await db.schema.createIndex("purchase_bill_items_product_idx").on("purchase_bill_items").column("productId").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("purchase_bill_items_orderId_idx").execute();
  await db.schema.dropIndex("purchase_bill_items_product_idx").execute();

  //Drop table
  await db.schema.dropTable("purchase_bill_items").ifExists().execute();
}
