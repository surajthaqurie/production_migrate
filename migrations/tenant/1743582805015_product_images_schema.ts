import { Kysely, sql } from "kysely";
import { DB } from "src/tenant-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("product_images")

    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn("productId", "uuid", (col) => col.notNull().references("products.id").onDelete("cascade"))
    .addColumn("fileId", "uuid", (col) => col.notNull().references("system_files.id").onDelete("restrict"))
    .addColumn("imageAltText", "text", (col) => col.notNull())
    .addColumn("isPrimary", "boolean", (col) => col.notNull().defaultTo(false))

    .addColumn("createdBy", "uuid", (col) => col.notNull().references("admins.id").onDelete("restrict"))
    .addColumn("createdAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())

    // .addUniqueConstraint("product_image__file_unique", ["productId", "fileId"])

    .execute();

  await db.schema.createIndex("product_images_product_id_idx").on("product_images").column("productId").execute();
  await db.schema.createIndex("product_images_file_id_idx").on("product_images").column("fileId").execute();
  await db.schema.createIndex("product_images_is_primary_idx").on("product_images").column("isPrimary").execute();
  await db.schema.createIndex("product_images_created_by_idx").on("product_images").column("createdBy").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("product_images_product_id_idx").execute();
  await db.schema.dropIndex("product_images_file_id_idx").execute();
  await db.schema.dropIndex("product_images_is_primary_idx").execute();
  await db.schema.dropIndex("product_images_created_by_idx").execute();

  // Drop table
  await db.schema.dropTable("product_images").ifExists().execute();
}
