import { Kysely, sql } from "kysely";
import { DB } from "src/saas-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("cms_use_cases")
    .ifNotExists()
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))

    .addColumn("slug", "varchar(255)", (col) => col.notNull().unique())
    .addColumn("title", "varchar(255)", (col) => col.notNull())

    .addColumn("description", "text", (col) => col.notNull())
    .addColumn("targetAudience", "text")
    .addColumn("benefits", "text", (col) => col.notNull().defaultTo("[]"))

    .addColumn("published", "boolean", (col) => col.notNull().defaultTo(true))

    .addColumn("metadata", "json")
    .addColumn("disableReason", "text")

    .addColumn("createdBy", "uuid", (col) => col.references("admins.id").onDelete("restrict"))
    .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
    .addColumn("deletedAt", "timestamptz")

    .addColumn("createdAt", "timestamptz", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn("updatedAt", "timestamptz", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))

    .execute();

  await db.schema.createIndex("use_cases_slug_idx").on("cms_use_cases").column("slug").execute();
  await db.schema.createIndex("use_cases_published_idx").on("cms_use_cases").column("published").execute();
  await db.schema.createIndex("use_cases_deleted_at_idx").on("cms_use_cases").column("deletedAt").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("use_cases_deleted_at_idx").ifExists().execute();
  await db.schema.dropIndex("use_cases_published_idx").ifExists().execute();
  await db.schema.dropIndex("use_cases_slug_idx").ifExists().execute();
  await db.schema.dropTable("cms_use_cases").ifExists().execute();
}
