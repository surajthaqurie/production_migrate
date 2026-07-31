import { Kysely } from "kysely";
import { DB } from "src/saas-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("blogs_category_idx").ifExists().execute();

  await db.schema
    .alterTable("cms_blogs")
    .addColumn("authorId", "uuid", (col) => col.references("cms_blog_authors.id").onDelete("set null"))
    .addColumn("categoryId", "uuid", (col) => col.references("cms_blog_categories.id").onDelete("set null"))
    .dropColumn("authorName")
    .dropColumn("category")
    .execute();

  await db.schema.createIndex("blogs_author_id_idx").on("cms_blogs").column("authorId").execute();
  await db.schema.createIndex("blogs_category_id_idx").on("cms_blogs").column("categoryId").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema
    .alterTable("cms_blogs")
    .addColumn("authorName", "varchar(255)", (col) => col.notNull().defaultTo("Kuverbooks Team"))
    .addColumn("category", "varchar(100)", (col) => col.notNull().defaultTo("General"))
    .execute();

  await db.schema.createIndex("blogs_category_idx").on("cms_blogs").column("category").execute();

  await db.schema.dropIndex("blogs_category_id_idx").ifExists().execute();
  await db.schema.dropIndex("blogs_author_id_idx").ifExists().execute();
  await db.schema.alterTable("cms_blogs").dropColumn("categoryId").dropColumn("authorId").execute();
}
