import { sql, type Kysely } from "kysely";
import { DB } from "src/tenant-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  // Create table
  await db.schema
    .createTable("ecommerce_enquiry_products")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))

    .addColumn("enquiryId", "uuid", (col) => col.notNull().references("ecommerce_enquiries.id").onDelete("cascade"))
    .addColumn("productId", "uuid", (col) => col.notNull().references("products.id").onDelete("restrict"))

    .addColumn("quantity", "integer", (col) => col.notNull())
    .addColumn("amount", "double precision", (col) => col.notNull().defaultTo(0))

    .addColumn("createdAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())

    .addUniqueConstraint("unique_ecommerce_enquiry_products", ["enquiryId", "productId"])

    .execute();

  await db.schema.createIndex("enquiry_products_enquiry_idx").on("ecommerce_enquiry_products").column("enquiryId").execute();
  await db.schema.createIndex("enquiry_products_product_idx").on("ecommerce_enquiry_products").column("productId").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("enquiry_products_enquiry_idx").execute();
  await db.schema.dropIndex("enquiry_products_product_idx").execute();

  //Drop table
  await db.schema.dropTable("ecommerce_enquiry_products").ifExists().execute();
}
