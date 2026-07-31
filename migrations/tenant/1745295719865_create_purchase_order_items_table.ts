import { Kysely, sql } from "kysely";
import { DB } from "src/tenant-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("purchase_order_items")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))

    .addColumn("productId", "uuid", (col) => col.references("products.id").notNull().onDelete("restrict"))
    .addColumn("orderId", "uuid", (col) => col.references("purchase_orders.id").notNull().onDelete("restrict"))

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

    //Unique the product and order
    .addUniqueConstraint("unique_order_product", ["productId", "orderId"])

    .execute();

  //@Index for fast filtering by orderId
  await db.schema.createIndex("order_items_orderId_idx").on("purchase_order_items").column("orderId").execute();
  await db.schema.createIndex("order_items_product_idx").on("purchase_order_items").column("productId").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("order_items_orderId_idx").execute();
  await db.schema.dropIndex("order_items_product_idx").execute();

  //Drop table
  await db.schema.dropTable("purchase_order_items").ifExists().execute();
}
