import { sql, type Kysely } from "kysely";
import { DB } from "src/tenant-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("product_barcodes")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))

    .addColumn("type", "varchar(255)", (col) => col.notNull())
    .addColumn("productId", "uuid", (col) => col.references("products.id").notNull().onDelete("restrict"))
    .addColumn("barcode", "varchar(255)", (col) => col.notNull().unique())
    .addColumn("isDefault", "boolean", (col) => col.defaultTo(false))

    .addColumn("createdAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())

    .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
    .addColumn("isDeleted", "boolean", (col) => col.defaultTo(false))
    .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
    .addColumn("deletedAt", "timestamptz")

    .execute();

  await db.schema.createIndex("product_barcodes_productId_idx").on("product_barcodes").column("productId").execute();
  await db.schema.createIndex("product_barcodes_barcode_idx").on("product_barcodes").column("barcode").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("product_barcodes_productId_idx").ifExists().execute();
  await db.schema.dropIndex("product_barcodes_barcode_idx").ifExists().execute();

  //Drop table
  await db.schema.dropTable("product_barcodes").ifExists().execute();
}
