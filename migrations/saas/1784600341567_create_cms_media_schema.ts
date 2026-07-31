import { Kysely, sql } from "kysely";
import { DB } from "src/saas-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("cms_media")
    .ifNotExists()
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))

    .addColumn("filename", "varchar(255)", (col) => col.notNull())
    .addColumn("originalName", "varchar(255)", (col) => col.notNull())
    .addColumn("mimeType", "varchar(100)", (col) => col.notNull())
    .addColumn("size", "integer", (col) => col.notNull())
    .addColumn("url", "text", (col) => col.notNull())
    .addColumn("altText", "text")

    .addColumn("metadata", "json")
    .addColumn("disableReason", "text")

    .addColumn("createdBy", "uuid", (col) => col.references("admins.id").onDelete("restrict"))
    .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
    .addColumn("deletedAt", "timestamptz")

    .addColumn("createdAt", "timestamptz", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))

    .execute();

  await db.schema.createIndex("media_filename_idx").on("cms_media").column("filename").execute();
  await db.schema.createIndex("media_deleted_at_idx").on("cms_media").column("deletedAt").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("media_deleted_at_idx").ifExists().execute();
  await db.schema.dropIndex("media_filename_idx").ifExists().execute();
  await db.schema.dropTable("cms_media").ifExists().execute();
}
