import { Kysely, sql } from "kysely";
import { DB } from "src/saas-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("support_ticket_documents")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))

    .addColumn("ticketId", "uuid", (col) => col.notNull().references("support_tickets.id").onDelete("cascade"))
    .addColumn("fileUrl", "text", (col) => col.notNull())
    .addColumn("originalName", "text", (col) => col.notNull())

    .addColumn("createdBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
    .addColumn("tenantCreatedBy", "uuid", (col) => col.references("tenants_users.id").onDelete("set null"))

    .execute();

  await db.schema.createIndex("idx_support_ticket_documents_ticket").on("support_ticket_documents").column("ticketId").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("idx_support_ticket_documents_ticket").ifExists().execute();

  //Drop Table
  await db.schema.dropTable("support_ticket_documents").ifExists().execute();
}
