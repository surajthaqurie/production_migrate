import { Kysely, sql } from "kysely";
import { DB } from "src/tenant-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("bank_accounts")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn("code", "varchar(15)", (col) => col.unique().notNull())
    .addColumn("slug", "text", (col) => col.unique().notNull())

    .addColumn("name", "varchar(255)", (col) => col.notNull())
    .addColumn("accountType", sql`bank_account_type`, (col) => col.notNull())
    .addColumn("description", "text")

    .addColumn("metadata", "json")

    .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
    .addColumn("isDeleted", "boolean", (col) => col.defaultTo(false))
    .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))

    .addColumn("deletedAt", "timestamptz")
    .addColumn("deletedReason", "text")

    .addColumn("createdAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())

    .execute();

  await db.schema.createIndex("bank_accounts_name_idx").on("bank_accounts").column("name").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("bank_accounts_name_idx").execute();

  //Drop table
  await db.schema.dropTable("bank_accounts").ifExists().execute();
}
