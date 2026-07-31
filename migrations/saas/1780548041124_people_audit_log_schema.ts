import { Kysely, sql } from "kysely";
import { DB } from "src/saas-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("people_logs")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))

    .addColumn("personId", "uuid", (col) => col.references("people_management.id").notNull().onDelete("cascade"))

    .addColumn("previousLogs", "jsonb", (col) => col.notNull())
    .addColumn("currentLogs", "jsonb", (col) => col.notNull())

    .addColumn("event", "text", (col) => col.notNull())
    .addColumn("remark", "text", (col) => col.notNull())

    .addColumn("description", "text")
    .addColumn("metadata", "json")

    .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))

    .addColumn("createdAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())

    .execute();

  await db.schema.createIndex("people_logs_personId_idx").on("people_logs").column("personId").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("people_logs_personId_idx").ifExists().execute();

  //Drop Table
  await db.schema.dropTable("people_logs").ifExists().execute();
}
