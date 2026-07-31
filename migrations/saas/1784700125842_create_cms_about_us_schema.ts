import { Kysely, sql } from "kysely";
import { DB } from "src/saas-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("cms_about_us")
    .ifNotExists()
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn("heading", "varchar(255)", (col) => col.notNull())
    .addColumn("description", "text", (col) => col.notNull())
    .addColumn("officeLabel", "varchar(255)")
    .addColumn("officeLocation", "varchar(255)")
    .addColumn("status", "varchar(50)", (col) => col.notNull().defaultTo("DRAFT"))

    .addColumn("metadata", "json")
    .addColumn("disableReason", "text")

    .addColumn("createdBy", "uuid", (col) => col.references("admins.id").onDelete("restrict"))
    .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
    .addColumn("deletedAt", "timestamptz")

    .addColumn("createdAt", "timestamptz", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn("updatedAt", "timestamptz", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))

    .execute();

  await db.schema.createIndex("about_us_status_idx").on("cms_about_us").column("status").execute();
  await db.schema.createIndex("about_us_deleted_at_idx").on("cms_about_us").column("deletedAt").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("about_us_deleted_at_idx").ifExists().execute();
  await db.schema.dropIndex("about_us_status_idx").ifExists().execute();
  await db.schema.dropTable("cms_about_us").ifExists().execute();
}
