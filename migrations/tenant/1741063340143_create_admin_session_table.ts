import { Kysely, sql } from "kysely";
import { DB } from "src/tenant-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("admin_sessions")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn("refreshToken", "varchar(255)", (col) => col.notNull().unique())
    .addColumn("sessionSecret", "varchar(255)", (col) => col.notNull().unique())

    .addColumn("isDeleted", "boolean", (col) => col.defaultTo(false))

    .addColumn("createdBy", "uuid", (col) => col.notNull().references("admins.id").onDelete("cascade"))
    .addColumn("agentMeta", "jsonb", (col) => col.notNull())
    .addColumn("metadata", "json")

    .addColumn("createdAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`))
    .execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropTable("admin_sessions").ifExists().execute();
}
