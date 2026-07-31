import { Kysely, sql } from "kysely";
import { DB } from "src/tenant-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("admin_transaction_code")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn("code", "varchar(18)", (col) => col.unique().notNull())

    .addColumn("ownerId", "uuid", (col) => col.notNull().references("admins.id").onDelete("cascade"))

    .addColumn("createdAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())

    .execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropTable("admin_transaction_code").ifExists().execute();
}
