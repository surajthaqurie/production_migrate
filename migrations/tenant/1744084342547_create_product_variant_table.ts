import { Kysely, sql } from "kysely";
import { DB } from "src/tenant-db.interface";

export async function skip_up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("product_variants")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn("name", "varchar(255)", (col) => col.notNull())

    .addColumn("code", "varchar", (col) => col.notNull())
    .addColumn("quantity", "numeric", (col) => col.notNull().defaultTo(0))

    .addColumn("costPrice", "double precision", (col) => col.notNull())
    .addColumn("sellingPrice", "double precision", (col) => col.notNull())

    //@Variant Attributes
    .addColumn("attributes", "jsonb", (col) => col.notNull()) //[variantId,variantId]

    //@Unique only for the same product
    .addColumn("productId", "uuid", (col) => col.references("products.id").notNull().onDelete("cascade"))
    .addUniqueConstraint("unique_variant_code_per_product", ["code", "productId"])

    .addColumn("description", "text")
    .addColumn("metadata", "json")

    .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
    .addColumn("isDeleted", "boolean", (col) => col.defaultTo(false))
    .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
    .addColumn("deletedAt", "timestamptz")

    .addColumn("createdAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .execute();
}

export async function skip_down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropTable("product_variants").ifExists().execute();
}
