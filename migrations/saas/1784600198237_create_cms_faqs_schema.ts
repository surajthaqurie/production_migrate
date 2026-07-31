import { Kysely, sql } from "kysely";
import { DB } from "src/saas-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("cms_faqs")
    .ifNotExists()
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))

    .addColumn("category", "varchar(100)", (col) => col.notNull().defaultTo("general"))
    .addColumn("question", "text", (col) => col.notNull())
    .addColumn("answer", "text", (col) => col.notNull())
    .addColumn("orderIndex", "integer", (col) => col.notNull().defaultTo(0))

    .addColumn("published", "boolean", (col) => col.notNull().defaultTo(true))

    .addColumn("metadata", "json")
    .addColumn("disableReason", "text")

    .addColumn("createdBy", "uuid", (col) => col.references("admins.id").onDelete("restrict"))
    .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
    .addColumn("deletedAt", "timestamptz")

    .addColumn("createdAt", "timestamptz", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn("updatedAt", "timestamptz", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))

    .execute();

  await db.schema.createIndex("faqs_category_idx").on("cms_faqs").column("category").execute();
  await db.schema.createIndex("faqs_published_idx").on("cms_faqs").column("published").execute();
  await db.schema.createIndex("faqs_deleted_at_idx").on("cms_faqs").column("deletedAt").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("faqs_deleted_at_idx").ifExists().execute();
  await db.schema.dropIndex("faqs_published_idx").ifExists().execute();
  await db.schema.dropIndex("faqs_category_idx").ifExists().execute();
  await db.schema.dropTable("cms_faqs").ifExists().execute();
}
