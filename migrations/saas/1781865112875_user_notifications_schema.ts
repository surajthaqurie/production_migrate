import { Kysely, sql } from "kysely";
import { DB } from "src/tenant-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("user_notifications")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))

    .addColumn("userId", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))

    .addColumn("resource", "varchar", (col) => col.notNull())
    .addColumn("content", "varchar", (col) => col.notNull())

    .addColumn("isNew", "boolean", (col) => col.defaultTo(true).notNull())
    .addColumn("seenAt", "timestamptz")

    .addColumn("referenceCode", "varchar(18)")
    .addColumn("referenceId", "uuid")

    .addColumn("createdAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())

    .execute();

  await db.schema.createIndex("user_notifications_user_idx").on("user_notifications").column("userId").execute();
  await db.schema.createIndex("user_notifications_resource_idx").on("user_notifications").column("resource").execute();
  await db.schema.createIndex("user_notifications_referenceCode_idx").on("user_notifications").column("referenceCode").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("user_notifications_user_idx").execute();
  await db.schema.dropIndex("user_notifications_resource_idx").execute();
  await db.schema.dropIndex("user_notifications_referenceCode_idx").execute();

  //Drop table
  await db.schema.dropTable("user_notifications").ifExists().execute();
}
