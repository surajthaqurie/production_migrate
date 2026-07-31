import { Kysely, sql } from "kysely";
import { DB } from "src/saas-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("cms_featured_customers")
    .ifNotExists()
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn("name", "varchar(255)", (col) => col.notNull())
    .addColumn("role", "varchar(255)", (col) => col.notNull())
    .addColumn("company", "varchar(255)", (col) => col.notNull())
    .addColumn("location", "varchar(255)", (col) => col.notNull())
    .addColumn("imageUrl", "text")
    .addColumn("displayOrder", "integer", (col) => col.notNull().defaultTo(0))
    .addColumn("status", "varchar(50)", (col) => col.notNull().defaultTo("ACTIVE"))
    .addColumn("published", "boolean", (col) => col.notNull().defaultTo(true))
    .addColumn("createdBy", "uuid", (col) => col.references("admins.id").onDelete("restrict"))
    .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
    .addColumn("deletedAt", "timestamptz")
    .addColumn("createdAt", "timestamptz", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn("updatedAt", "timestamptz", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .execute();

  await db.schema.createIndex("cms_featured_customers_status_idx").on("cms_featured_customers").column("status").execute();
  await db.schema.createIndex("cms_featured_customers_published_idx").on("cms_featured_customers").column("published").execute();
  await db.schema.createIndex("cms_featured_customers_deleted_at_idx").on("cms_featured_customers").column("deletedAt").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("cms_featured_customers_deleted_at_idx").ifExists().execute();
  await db.schema.dropIndex("cms_featured_customers_published_idx").ifExists().execute();
  await db.schema.dropIndex("cms_featured_customers_status_idx").ifExists().execute();
  await db.schema.dropTable("cms_featured_customers").ifExists().execute();
}
