import { Kysely, sql } from "kysely";
import { DB } from "src/saas-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("plan_categories")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))

    .addColumn("name", "varchar(255)", (col) => col.notNull())
    .addColumn("slug", "text", (col) => col.notNull().unique())
    .addColumn("order", "integer", (col) => col.notNull().defaultTo(0))

    .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
    .addColumn("updatedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))

    .addColumn("isDeleted", "boolean", (col) => col.notNull().defaultTo(false))
    .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
    .addColumn("deletedAt", "timestamptz")

    .addColumn("createdAt", "timestamptz", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn("updatedAt", "timestamptz", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))

    .execute();

  await db.schema.createIndex("plan_categories_display_order_idx").on("plan_categories").column("order").execute();
  await db.schema.createIndex("plan_categories_is_deleted_idx").on("plan_categories").column("isDeleted").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("plan_categories_is_deleted_idx").ifExists().execute();
  await db.schema.dropIndex("plan_categories_display_order_idx").ifExists().execute();

  //Drop table
  await db.schema.dropTable("plan_categories").ifExists().execute();
}
