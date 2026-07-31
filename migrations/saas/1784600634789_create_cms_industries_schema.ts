import { Kysely, sql } from "kysely";
import { DB } from "src/saas-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("cms_industries")
    .ifNotExists()
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))

    .addColumn("slug", "varchar(255)", (col) => col.notNull().unique())
    .addColumn("name", "varchar(255)", (col) => col.notNull())

    .addColumn("tagline", "text")
    .addColumn("description", "text")
    .addColumn("icon", "varchar(100)")
    .addColumn("imageUrl", "text")
    .addColumn("features", "text", (col) => col.notNull().defaultTo("[]"))

    .addColumn("published", "boolean", (col) => col.notNull().defaultTo(true))

    .addColumn("metadata", "json")
    .addColumn("disableReason", "text")

    .addColumn("createdBy", "uuid", (col) => col.references("admins.id").onDelete("restrict"))
    .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
    .addColumn("deletedAt", "timestamptz")

    .addColumn("createdAt", "timestamptz", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn("updatedAt", "timestamptz", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))

    .execute();

  await db.schema.createIndex("industries_slug_idx").on("cms_industries").column("slug").execute();
  await db.schema.createIndex("industries_published_idx").on("cms_industries").column("published").execute();
  await db.schema.createIndex("industries_deleted_at_idx").on("cms_industries").column("deletedAt").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("industries_deleted_at_idx").ifExists().execute();
  await db.schema.dropIndex("industries_published_idx").ifExists().execute();
  await db.schema.dropIndex("industries_slug_idx").ifExists().execute();
  await db.schema.dropTable("cms_industries").ifExists().execute();
}
