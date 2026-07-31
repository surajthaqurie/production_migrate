import { Kysely, sql } from "kysely";
import { DB } from "src/tenant-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("product_categories")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn("name", "varchar", (col) => col.notNull())
    .addColumn("slug", "text", (col) => col.notNull())
    .addColumn("level", "integer", (col) => col.notNull())
    .addColumn("isDefault", "boolean", (col) => col.defaultTo(false))
    .addColumn("tenantId", "uuid", (col) => col.notNull().references("companies.id").onDelete("cascade"))

    .addColumn("description", "text")
    .addColumn("metadata", "json")

    .addColumn("parentId", "uuid", (col) => col.references("product_categories.id").onDelete("set null"))

    .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
    .addColumn("isDeleted", "boolean", (col) => col.defaultTo(false))
    .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
    .addColumn("deletedAt", "timestamptz")

    .addColumn("createdAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())

    .execute();

  await db.schema.createIndex("product_categories_name_idx").on("product_categories").column("name").execute();
  await db.schema.createIndex("product_categories_slug_idx").on("product_categories").column("slug").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("product_categories_name_idx").execute();
  await db.schema.dropIndex("product_categories_slug_idx").execute();

  //Drop table
  await db.schema.dropTable("product_categories").ifExists().execute();
}
