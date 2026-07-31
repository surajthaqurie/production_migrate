import { Kysely, sql } from "kysely";
import { DB } from "src/tenant-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("printable_files")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))

    .addColumn("resourceType", "varchar(50)", (col) => col.notNull()) // Invoice, Purchase Order, etc
    .addColumn("resourceId", "uuid", (col) => col.notNull())

    .addColumn("key", "text", (col) => col.notNull().unique())
    .addColumn("size", "varchar(10)", (col) => col.notNull()) //A4, A5, Small

    .addColumn("metadata", "json")
    .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))

    .addColumn("createdAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())

    .addUniqueConstraint("printable_files_resource_id_size_unique", ["resourceId", "size"])

    .execute();

  await db.schema.createIndex("printable_files_resource_type_idx").on("printable_files").column("resourceType").execute();
  await db.schema.createIndex("printable_files_resource_type_id_idx").on("printable_files").columns(["resourceType", "resourceId"]).execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("printable_files_resource_type_id_idx").ifExists().execute();
  await db.schema.dropIndex("printable_files_resource_type_idx").ifExists().execute();

  //Drop table
  await db.schema.dropTable("printable_files").ifExists().execute();
}
