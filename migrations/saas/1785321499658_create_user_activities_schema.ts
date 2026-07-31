import { Kysely, sql } from "kysely";
import { DB } from "src/saas-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("user_activity_logs")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))

    .addColumn("userId", "uuid", (col) => col.references("admins.id").notNull().onDelete("cascade"))

    .addColumn("method", "text", (col) => col.notNull())
    .addColumn("path", "text", (col) => col.notNull())
    .addColumn("statusCode", "integer", (col) => col.notNull())
    .addColumn("executionTime", "integer", (col) => col.notNull())

    .addColumn("ipAddress", "text")
    .addColumn("userAgent", "text")
    .addColumn("requestBody", "json")

    .addColumn("createdAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())

    .execute();

  //@Indexing
  await db.schema.createIndex("user_activity_logs_user_idx").on("user_activity_logs").column("userId").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("user_activity_logs_user_idx").ifExists().execute();

  //Drop table
  await db.schema.dropTable("user_activity_logs").ifExists().execute();
}
