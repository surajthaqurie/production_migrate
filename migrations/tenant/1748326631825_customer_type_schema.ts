import { Kysely, sql } from "kysely";
import { DB } from "src/tenant-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("customer_types")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn("name", "varchar(255)", (col) => col.notNull())
    .addColumn("slug", "text", (col) => col.notNull().unique())

    .addColumn("discountType", sql`discount_type`, (col) => col.notNull())
    .addColumn("discountValue", "double precision", (col) => col.notNull())

    .addColumn("description", "text")

    .addColumn("createdBy", "uuid", (col) => col.notNull().references("admins.id").onDelete("restrict"))

    .addColumn("isDeleted", "boolean", (col) => col.notNull().defaultTo(false))
    .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
    .addColumn("deletedAt", "timestamptz")

    .addColumn("createdAt", "timestamptz", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn("updatedAt", "timestamptz", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .execute();

  await db.schema.createIndex("customer_types_createdBy_idx").on("customer_types").column("createdBy").execute();
  await db.schema.createIndex("customer_types_isDeleted_idx").on("customer_types").column("isDeleted").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("customer_types_slug_idx").ifExists().execute();
  await db.schema.dropIndex("customer_types_createdBy_idx").ifExists().execute();
  await db.schema.dropIndex("customer_types_isDeleted_idx").ifExists().execute();

  // Drop the table
  await db.schema.dropTable("customer_types").ifExists().execute();
}
