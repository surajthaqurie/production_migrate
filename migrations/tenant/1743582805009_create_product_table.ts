import { Kysely, sql } from "kysely";
import { DB } from "src/tenant-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("products")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn("name", "varchar(255)", (col) => col.notNull())
    .addColumn("slug", "text", (col) => col.unique().notNull())
    .addColumn("sku", "varchar", (col) => col.unique().notNull())

    .addColumn("hasVariant", "boolean", (col) => col.notNull().defaultTo(false))
    .addColumn("taxRate", "double precision", (col) => col.notNull())
    .addColumn("categoryId", "uuid", (col) => col.notNull().references("product_categories.id").onDelete("set null"))
    .addColumn("measurementUnitId", "uuid", (col) => col.notNull().references("measurement_units.id").onDelete("set null"))
    .addColumn("valuationMethodId", "uuid", (col) => col.notNull().references("valuation_methods.id").onDelete("restrict"))

    // Optionals: [Alternate units]
    .addColumn("hasAlternateUnit", "boolean", (col) => col.notNull().defaultTo(false))

    .addColumn("attributes", "jsonb")
    .addColumn("parentId", "uuid", (col) => col.references("products.id").onDelete("set null"))

    .addColumn("description", "text")
    .addColumn("metadata", "json")

    .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
    .addColumn("isDeleted", "boolean", (col) => col.defaultTo(false))
    .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
    .addColumn("deletedAt", "timestamptz")

    //[Account mapping]
    // .addColumn("financialSellingAccountId", "uuid", (col) => col.references("financial_accounts.id").onDelete("restrict"))
    // .addColumn("financialPurchaseAccountId", "uuid", (col) => col.references("financial_accounts.id").onDelete("restrict"))
    // .addColumn("financialSalesReturnAccountId", "uuid", (col) => col.references("financial_accounts.id").onDelete("restrict"))
    // .addColumn("financialPurchaseReturnAccountId", "uuid", (col) => col.references("financial_accounts.id").onDelete("restrict"))

    .addColumn("supplierId", "uuid", (col) => col.references("suppliers.id").onDelete("set null"))

    .addColumn("createdAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .execute();

  await db.schema.createIndex("products_name_idx").on("products").column("name").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("products_name_idx").execute();

  // drop table
  await db.schema.dropTable("products").ifExists().execute();
}
