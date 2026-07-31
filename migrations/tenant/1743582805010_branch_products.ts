import { Kysely, sql } from "kysely";
import { DB } from "src/tenant-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("branch_products")
    .addColumn("productId", "uuid", (col) => col.references("products.id").notNull().onDelete("cascade"))
    .addColumn("branchId", "uuid", (col) => col.references("branches.id").notNull().onDelete("cascade"))

    .addColumn("status", sql`product_status`, (col) => col.notNull().defaultTo(sql`'NO_STOCK'`))

    .addColumn("totalQuantity", "integer")
    .addColumn("reorderLevel", "integer")
    .addColumn("minStock", "integer")

    .addColumn("isSellable", "boolean", (col) => col.notNull().defaultTo(false))
    .addColumn("discountMode", "boolean", (col) => col.defaultTo(false))

    // Optionals [pricing and product information]
    .addColumn("costPrice", "double precision") // included VAT
    .addColumn("sellingPrice", "double precision") //include VAT

    .addColumn("wholeSaleAmount", "double precision")
    .addColumn("retailAmount", "double precision")

    // Optionals: [product control]
    .addColumn("lifeDuration", "json") // {durationType:"",duration:""}
    .addColumn("warrantyDuration", "json") // {durationType:"",duration:""}

    .addUniqueConstraint("unique_branch_product", ["branchId", "productId"])

    // .addColumn("createdAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    // .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .execute();

  await db.schema.createIndex("branch_products_product_idx").on("branch_products").column("productId").execute();
  await db.schema.createIndex("branch_products_branch_idx").on("branch_products").column("branchId").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("branch_products_product_idx").execute();
  await db.schema.dropIndex("branch_products_branch_idx").execute();

  //Drop table
  await db.schema.dropTable("branch_products").ifExists().execute();
}
