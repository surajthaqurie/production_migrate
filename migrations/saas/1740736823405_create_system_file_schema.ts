import { Kysely, sql } from "kysely";
import { DB } from "src/saas-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("system_files")

    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn("key", "text", (col) => col.notNull().unique())

    .addColumn("originalName", "varchar(255)", (col) => col.notNull())
    .addColumn("mimeType", "varchar(50)", (col) => col.notNull())
    .addColumn("size", "integer", (col) => col.notNull())

    .addColumn("createdBy", "uuid", (col) => col.notNull().references("admins.id").onDelete("restrict"))

    .addColumn("isDeleted", "boolean", (col) => col.defaultTo(false))
    .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
    .addColumn("deletedAt", "timestamptz")

    .addColumn("createdAt", "timestamptz", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn("updatedAt", "timestamptz", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))

    .execute();

  await db.schema.createIndex("system_files_created_by_idx").on("system_files").column("createdBy").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("system_files_created_by_idx").execute();

  //Drop table
  await db.schema.dropTable("system_files").ifExists().execute();
}
