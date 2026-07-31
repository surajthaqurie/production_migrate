import { Kysely, sql } from "kysely";
import { DB } from "src/saas-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("support_ticket_categories")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn("name", "varchar(100)", (col) => col.notNull())
    .addColumn("slug", "text", (col) => col.notNull().unique())
    .addColumn("description", "text")

    .addColumn("createdBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
    .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
    .addColumn("deletedAt", "timestamptz")

    .addColumn("createdAt", "timestamptz", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn("updatedAt", "timestamptz", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropTable("support_ticket_categories").ifExists().execute();
}
