import { Kysely, sql } from "kysely";
import { DB } from "src/tenant-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("product_summary")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))

    .addColumn("warehouseId", "uuid", (col) => col.references("warehouses.id").notNull().onDelete("restrict"))
    .addColumn("productId", "uuid", (col) => col.references("products.id").notNull().onDelete("restrict"))
    .addColumn("fiscalYear", "varchar(7)", (col) => col.notNull())

    .addColumn("quantity", "integer", (col) => col.notNull().defaultTo(0))
    .addColumn("grnQuantity", "integer", (col) => col.notNull().defaultTo(0))
    .addColumn("billQuantity", "integer", (col) => col.notNull().defaultTo(0))
    .addColumn("creditQuantity", "integer", (col) => col.notNull().defaultTo(0))
    .addColumn("adjustInQuantity", "integer", (col) => col.notNull().defaultTo(0))
    .addColumn("issueInQuantity", "integer", (col) => col.notNull().defaultTo(0))
    .addColumn("requisitionInQuantity", "integer", (col) => col.notNull().defaultTo(0))

    .addColumn("invoiceQuantity", "integer", (col) => col.notNull().defaultTo(0))
    .addColumn("adjustOutQuantity", "integer", (col) => col.notNull().defaultTo(0))
    .addColumn("debitQuantity", "integer", (col) => col.notNull().defaultTo(0))
    .addColumn("issueOutQuantity", "integer", (col) => col.notNull().defaultTo(0))
    .addColumn("requisitionOutQuantity", "integer", (col) => col.notNull().defaultTo(0))

    .addColumn("createdAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())

    .addUniqueConstraint("unique_summary_warehouse_product_fiscal_year", ["warehouseId", "productId", "fiscalYear"])
    .execute();

  await db.schema.createIndex("product_summary_product_idx").on("product_summary").column("productId").execute();
  await db.schema.createIndex("product_summary_warehouse_idx").on("product_summary").column("warehouseId").execute();
  await db.schema.createIndex("product_summary_fiscal_idx").on("product_summary").column("fiscalYear").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("product_summary_product_idx").execute();
  await db.schema.dropIndex("product_summary_warehouse_idx").execute();
  await db.schema.dropIndex("product_summary_fiscal_idx").execute();

  //Drop table
  await db.schema.dropTable("product_summary").ifExists().execute();
}
