import { Kysely, sql } from "kysely";
import { DB } from "src/tenant-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("product_fiscal_stocks")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))

    .addColumn("warehouseId", "uuid", (col) => col.references("warehouses.id").notNull().onDelete("restrict"))
    .addColumn("productId", "uuid", (col) => col.references("products.id").notNull().onDelete("restrict"))
    .addColumn("fiscalYear", "varchar(7)", (col) => col.notNull()) // Format: "2080/81"
    .addColumn("previousFiscalYear", "varchar(7)")

    .addColumn("openingStock", "integer", (col) => col.notNull().defaultTo(0))
    .addColumn("closingStock", "integer", (col) => col.notNull().defaultTo(0))

    .addColumn("ratePerItem", "double precision", (col) => col.notNull().defaultTo(0))
    .addColumn("totalAmount", "double precision", (col) => col.notNull().defaultTo(0))

    .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
    .addColumn("createdAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())

    .addUniqueConstraint("unique_warehouse_product_fiscal_year", ["warehouseId", "productId", "fiscalYear"])
    .execute();

  await db.schema.createIndex("product_fiscal_stocks_product_idx").on("product_fiscal_stocks").column("productId").execute();
  await db.schema.createIndex("product_fiscal_stocks_warehouse_idx").on("product_fiscal_stocks").column("warehouseId").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("product_fiscal_stocks_product_idx").execute();
  await db.schema.dropIndex("product_fiscal_stocks_warehouse_idx").execute();

  //Drop table
  await db.schema.dropTable("product_fiscal_stocks").ifExists().execute();
}
