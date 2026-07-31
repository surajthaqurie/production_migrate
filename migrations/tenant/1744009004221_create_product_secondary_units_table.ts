import { Kysely, sql } from "kysely";
import { DB } from "src/tenant-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("product_secondary_units")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn("name", "varchar(255)", (col) => col.notNull())
    // .addColumn("slug", "text", (col) => col.notNull())

    .addColumn("costPrice", "double precision")
    .addColumn("sellingPrice", "double precision")

    .addColumn("unitType", "uuid", (col) => col.notNull().references("measurement_units.id").onDelete("set null"))
    .addColumn("conversionValue", "double precision", (col) => col.notNull())

    //@Unique only for the same product
    .addColumn("productId", "uuid", (col) => col.references("products.id").notNull().onDelete("cascade"))

    .addColumn("description", "text")
    .addColumn("metadata", "json")

    .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
    .addColumn("isDeleted", "boolean", (col) => col.defaultTo(false))
    .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
    .addColumn("deletedAt", "timestamptz")

    .addUniqueConstraint("unique_secondary_unit_per_product", ["unitType", "productId"])

    .addColumn("createdAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .execute();

  await db.schema.createIndex("product_secondary_units_productId_idx").on("product_secondary_units").column("productId").execute();
  await db.schema.createIndex("product_secondary_units_name_idx").on("product_secondary_units").column("name").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("product_secondary_units_name_idx").execute();
  await db.schema.dropIndex("product_secondary_units_productId_idx").execute();

  //Drop table
  await db.schema.dropTable("product_secondary_units").ifExists().execute();
}
