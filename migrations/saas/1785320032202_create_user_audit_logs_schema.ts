import { Kysely, sql } from "kysely";
import { DB } from "src/saas-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("user_audit_logs")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))

    .addColumn("userId", "uuid", (col) => col.references("admins.id").notNull().onDelete("cascade"))
    .addColumn("previousLogs", "jsonb", (col) => col.notNull().defaultTo(sql`'{}'::jsonb`))
    .addColumn("currentLogs", "jsonb", (col) => col.notNull().defaultTo(sql`'{}'::jsonb`))

    .addColumn("event", "text", (col) => col.notNull())
    .addColumn("resource", "text", (col) => col.notNull())

    .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
    .addColumn("remark", "text", (col) => col.notNull())

    .addColumn("description", "text")
    .addColumn("metadata", "json")
    .addColumn("createdAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())

    .execute();

  //@Indexing
  await db.schema.createIndex("user_audit_logs_user_idx").on("user_audit_logs").column("userId").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("user_audit_logs_user_idx").ifExists().execute();

  //Drop table
  await db.schema.dropTable("user_audit_logs").ifExists().execute();
}
