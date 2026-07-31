import { Kysely, sql } from "kysely";
import { DB } from "src/saas-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("user_roles")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn("slug", "text", (col) => col.notNull().unique())
    .addColumn("name", "varchar(50)", (col) => col.notNull())

    .addColumn("isDefault", "boolean", (col) => col.defaultTo(false))

    .addColumn("metadata", "json")
    .addColumn("description", "text")

    .addColumn("isDeleted", "boolean", (col) => col.defaultTo(false))
    .addColumn("deletedAt", "timestamptz")

    .addColumn("createdAt", "timestamptz", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn("updatedAt", "timestamptz", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))

    .execute();

  await db.schema.createIndex("user_roles_name_idx").on("user_roles").column("name").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("user_roles_name_idx").execute();

  //Drop table
  await db.schema.dropTable("user_roles").ifExists().execute();
}
