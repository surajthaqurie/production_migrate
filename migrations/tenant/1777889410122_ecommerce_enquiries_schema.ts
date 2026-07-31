import { sql, type Kysely } from "kysely";
import { DB } from "src/tenant-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  // Ensure UUID generation (Postgres)

  await db.schema
    .createTable("ecommerce_enquiries")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))

    .addColumn("code", "varchar(50)", (col) => col.notNull().unique())

    .addColumn("fullName", "varchar(100)", (col) => col.notNull())
    .addColumn("email", "varchar(255)", (col) => col.notNull())
    .addColumn("phoneNumber", "varchar(20)")

    .addColumn("status", "varchar(20)", (col) => col.notNull().defaultTo("NEW"))
    .addColumn("isRead", "boolean", (col) => col.notNull().defaultTo(false))

    .addColumn("content", "text")
    .addColumn("metadata", "jsonb", (col) => col.notNull().defaultTo(sql`'{}'::jsonb`))

    .addColumn("isDeleted", "boolean", (col) => col.notNull().defaultTo(false))
    .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
    .addColumn("deletedAt", "timestamptz")

    .addColumn("createdAt", "timestamptz", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn("updatedAt", "timestamptz", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))

    .execute();

  await db.schema.createIndex("ecommerce_enquiries_email_idx").on("ecommerce_enquiries").column("email").execute();
  await db.schema.createIndex("ecommerce_enquiries_status_idx").on("ecommerce_enquiries").column("status").execute();
  await db.schema.createIndex("ecommerce_enquiries_created_at_idx").on("ecommerce_enquiries").column("createdAt").execute();
  await db.schema.createIndex("ecommerce_enquiries_is_read_idx").on("ecommerce_enquiries").column("isRead").execute();
  await db.schema.createIndex("ecommerce_enquiries_status_createdAt_idx").on("ecommerce_enquiries").columns(["status", "createdAt"]).execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("ecommerce_enquiries_email_idx").ifExists().execute();
  await db.schema.dropIndex("ecommerce_enquiries_status_idx").ifExists().execute();
  await db.schema.dropIndex("ecommerce_enquiries_created_at_idx").ifExists().execute();
  await db.schema.dropIndex("ecommerce_enquiries_is_read_idx").ifExists().execute();
  await db.schema.dropIndex("ecommerce_enquiries_status_createdAt_idx").ifExists().execute();

  // Drop the table
  await db.schema.dropTable("ecommerce_enquiries").ifExists().execute();
}
