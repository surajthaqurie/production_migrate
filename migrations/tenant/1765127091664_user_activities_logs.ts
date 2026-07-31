import { sql, type Kysely } from "kysely";
import { DB } from "src/tenant-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("user_activity_logs")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn("userId", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
    .addColumn("branchId", "uuid", (col) => col.references("branches.id").notNull().onDelete("restrict"))

    .addColumn("method", "varchar(10)", (col) => col.notNull())
    .addColumn("path", "text", (col) => col.notNull())
    .addColumn("statusCode", "integer", (col) => col.notNull())

    .addColumn("ipAddress", "varchar(45)")
    .addColumn("userAgent", "text")
    .addColumn("executionTime", "integer")
    .addColumn("requestBody", "jsonb")

    .addColumn("metadata", "json")

    .addColumn("createdAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())

    .execute();

  await db.schema.createIndex("user_activity_logs_user_idx").on("user_activity_logs").column("userId").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("user_activity_logs_user_idx").execute();

  //Drop table
  await db.schema.dropTable("user_activity_logs").ifExists().execute();
}
