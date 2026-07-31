import { Kysely, sql } from "kysely";
import { DB } from "src/tenant-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("credit_terms")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn("name", "varchar(255)", (col) => col.notNull())
    .addColumn("slug", "text", (col) => col.unique().notNull())
    .addColumn("days", "integer", (col) => col.notNull())
    .addColumn("description", "text")
    .addColumn("metadata", "json")
    .addColumn("isDefault", "boolean", (col) => col.defaultTo(false))

    .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
    .addColumn("isDeleted", "boolean", (col) => col.defaultTo(false))
    .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
    .addColumn("deletedAt", "timestamptz")

    .addColumn("createdAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())

    .execute();

  await db.schema.createIndex("credit_terms_name_idx").on("credit_terms").column("name").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("credit_terms_name_idx").execute();

  //Drop table
  await db.schema.dropTable("credit_terms").ifExists().execute();
}
