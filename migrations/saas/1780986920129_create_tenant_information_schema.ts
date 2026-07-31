import { Kysely } from "kysely";
import { DB } from "src/saas-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("tenant_info")
    .addColumn("tenantId", "uuid", (col) => col.primaryKey().references("tenants.id").notNull().onDelete("cascade"))
    .addColumn("logo", "text", (col) => col.notNull())

    .addColumn("contactPhone", "varchar(20)", (col) => col.notNull()) // unique
    .addColumn("contactEmail", "varchar(255)", (col) => col.notNull()) // unique
    .addColumn("contactPerson", "varchar(255)", (col) => col.notNull())

    .addColumn("location", "varchar(255)", (col) => col.notNull())
    .addColumn("city", "varchar(255)", (col) => col.notNull())
    .addColumn("state", "varchar(255)", (col) => col.notNull())
    .addColumn("zipCode", "varchar(20)")

    .addColumn("isRegistered", "boolean", (col) => col.defaultTo(false).notNull())
    .addColumn("vatNo", "varchar(20)")
    .addColumn("panNo", "varchar(20)")

    .addColumn("blockedRemark", "text")
    .addColumn("blockedAt", "timestamptz")
    .addColumn("blockedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))

    .execute();

  await db.schema.createIndex("tenant_info_contact_email_idx").on("tenant_info").column("contactEmail").execute();
  await db.schema.createIndex("tenant_info_contact_phone_idx").on("tenant_info").column("contactPhone").execute();
  await db.schema.createIndex("tenant_info_registered_idx").on("tenant_info").column("isRegistered").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("tenant_info_contact_phone_idx").ifExists().execute();
  await db.schema.dropIndex("tenant_info_registered_idx").ifExists().execute();
  await db.schema.dropIndex("tenant_info_contact_email_idx").ifExists().execute();

  //Drop Table
  await db.schema.dropTable("tenant_info").execute();
}
