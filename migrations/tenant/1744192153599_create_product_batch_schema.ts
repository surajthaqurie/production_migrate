import { Kysely, sql } from "kysely";
import { DB } from "src/tenant-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("product_batch")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn("code", "varchar(18)", (col) => col.unique().notNull())

    .addColumn("totalQuantity", "numeric", (col) => col.notNull().defaultTo(0))
    .addColumn("remQuantity", "numeric", (col) => col.notNull().defaultTo(0))

    .addColumn("costPrice", "double precision", (col) => col.notNull().defaultTo(0))
    .addColumn("sellingPrice", "double precision", (col) => col.notNull().defaultTo(0))

    //@Unique only for the same product
    .addColumn("productId", "uuid", (col) => col.references("products.id").notNull().onDelete("cascade"))
    .addColumn("warehouseId", "uuid", (col) => col.references("warehouses.id").notNull().onDelete("restrict"))

    .addColumn("fiscalYear", "varchar(7)", (col) => col.notNull())

    .addColumn("metadata", "json")

    .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))

    .addColumn("createdAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())

    //Unique the product and order
    // .addUniqueConstraint("unique_batch_product_warehouse", ["productId", "warehouseId"])

    .execute();

  //@Indexing
  await db.schema.createIndex("product_batch_product_idx").on("product_batch").column("productId").execute();
  await db.schema.createIndex("product_batch_warehouse_idx").on("product_batch").column("warehouseId").execute();
  await db.schema.createIndex("product_batch_fiscalYear_idx").on("product_batch").column("fiscalYear").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("product_batch_product_idx").execute();
  await db.schema.dropIndex("product_batch_warehouse_idx").execute();
  await db.schema.dropIndex("product_batch_fiscalYear_idx").execute();

  //Drop table
  await db.schema.dropTable("product_batch").ifExists().execute();
}
