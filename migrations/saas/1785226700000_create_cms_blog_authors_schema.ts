import { Kysely, sql } from "kysely";
import { DB } from "src/saas-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("cms_blog_authors")
    .ifNotExists()
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn("name", "varchar(255)", (col) => col.notNull())
    .addColumn("slug", "varchar(255)", (col) => col.notNull().unique())
    .addColumn("role", "varchar(255)")
    .addColumn("bio", "text")
    .addColumn("avatarUrl", "text")
    .addColumn("socialLinks", "json")
    .addColumn("status", "varchar(50)", (col) => col.notNull().defaultTo("ACTIVE"))

    .addColumn("metadata", "json")
    .addColumn("disableReason", "text")

    .addColumn("createdBy", "uuid", (col) => col.references("admins.id").onDelete("restrict"))
    .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
    .addColumn("deletedAt", "timestamptz")

    .addColumn("createdAt", "timestamptz", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn("updatedAt", "timestamptz", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))

    .execute();

  await db.schema.createIndex("blog_authors_slug_idx").on("cms_blog_authors").column("slug").execute();
  await db.schema.createIndex("blog_authors_status_idx").on("cms_blog_authors").column("status").execute();
  await db.schema.createIndex("blog_authors_deleted_at_idx").on("cms_blog_authors").column("deletedAt").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("blog_authors_deleted_at_idx").ifExists().execute();
  await db.schema.dropIndex("blog_authors_status_idx").ifExists().execute();
  await db.schema.dropIndex("blog_authors_slug_idx").ifExists().execute();
  await db.schema.dropTable("cms_blog_authors").ifExists().execute();
}
