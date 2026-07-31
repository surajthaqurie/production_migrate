import { Kysely, sql } from "kysely";
import { DB } from "src/saas-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("marketing_contact_us")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn("fullName", "varchar(100)", (col) => col.notNull())
    .addColumn("email", "varchar(255)", (col) => col.notNull())
    .addColumn("phoneNumber", "varchar(20)", (col) => col.notNull())
    .addColumn("message", "text", (col) => col.notNull())

    .addColumn("status", "varchar(50)", (col) => col.defaultTo("NEW").notNull())
    .addColumn("isRead", "boolean", (col) => col.defaultTo(false))
    .addColumn("metadata", "jsonb")

    .addColumn("isDeleted", "boolean", (col) => col.defaultTo(false))
    .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
    .addColumn("deletedAt", "timestamptz")

    .addColumn("createdAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`))
    .execute();

  // Create indexes for better performance
  await db.schema.createIndex("marketing_contact_us_email_idx").on("marketing_contact_us").column("email").execute();
  await db.schema.createIndex("marketing_contact_us_status_idx").on("marketing_contact_us").column("status").execute();
  await db.schema.createIndex("marketing_contact_us_created_at_idx").on("marketing_contact_us").column("createdAt").execute();
  await db.schema.createIndex("marketing_contact_us_is_read_idx").on("marketing_contact_us").column("isRead").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("marketing_contact_us_email_idx").ifExists().execute();
  await db.schema.dropIndex("marketing_contact_us_status_idx").ifExists().execute();
  await db.schema.dropIndex("marketing_contact_us_created_at_idx").ifExists().execute();
  await db.schema.dropIndex("marketing_contact_us_is_read_idx").ifExists().execute();

  // Drop the table
  await db.schema.dropTable("marketing_contact_us").ifExists().execute();
}
