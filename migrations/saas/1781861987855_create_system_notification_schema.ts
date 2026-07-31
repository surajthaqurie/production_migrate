import { Kysely, sql } from "kysely";
import { DB } from "src/saas-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("system_notifications")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))

    .addColumn("content", "varchar", (col) => col.notNull())

    .addColumn("action", "varchar", (col) => col.notNull().notNull())
    .addColumn("resource", "varchar", (col) => col.notNull())
    .addColumn("channels", sql`text[]`, (col) => col.defaultTo(sql`'{}'`)) // e.g., ['email','sms','inApp']

    .addColumn("createdAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())

    .addUniqueConstraint("unique_notification_resource_action", ["resource", "action"])

    .execute();

  await db.schema.createIndex("system_notifications_resource_idx").on("system_notifications").column("resource").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("system_notifications_resource_idx").execute();

  //Drop table
  await db.schema.dropTable("system_notifications").ifExists().execute();
}
