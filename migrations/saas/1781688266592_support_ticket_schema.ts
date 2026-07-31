import { Kysely, sql } from "kysely";
import { DB } from "src/saas-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("support_tickets")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn("code", "varchar(20)", (col) => col.notNull().unique())

    .addColumn("tenantId", "uuid", (col) => col.notNull().references("tenants.id").onDelete("cascade"))

    .addColumn("categoryId", "uuid", (col) => col.notNull().references("support_ticket_categories.id").onDelete("restrict"))

    .addColumn("channel", "varchar(30)", (col) => col.notNull().defaultTo("PORTAL"))
    .addColumn("priority", "int2", (col) => col.notNull().defaultTo(2)) // 1=Low  2=Medium  3=High

    .addColumn("description", "text", (col) => col.notNull())
    .addColumn("status", "varchar(20)", (col) => col.notNull().defaultTo("OPEN"))

    .addColumn("assignedTo", "uuid", (col) => col.references("admins.id").onDelete("set null"))
    .addColumn("assignedAt", "timestamptz")

    .addColumn("resolvedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
    .addColumn("resolvedAt", "timestamptz")

    .addColumn("closedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
    .addColumn("closedAt", "timestamptz")

    .addColumn("metadata", "json")
    .addColumn("createdBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
    .addColumn("tenantCreatedBy", "uuid", (col) => col.references("tenants_users.id").onDelete("set null"))

    .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
    .addColumn("deletedAt", "timestamptz")

    .addColumn("createdAt", "timestamptz", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn("updatedAt", "timestamptz", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .execute();

  await db.schema.createIndex("idx_support_tickets_status").on("support_tickets").column("status").execute();
  await db.schema.createIndex("idx_support_tickets_tenant").on("support_tickets").column("tenantId").execute();
  await db.schema.createIndex("idx_support_tickets_category").on("support_tickets").column("categoryId").execute();

  await db.schema.createIndex("idx_support_tickets_tenant_status").on("support_tickets").columns(["tenantId", "status"]).execute();
  await db.schema.createIndex("idx_support_tickets_priority_status").on("support_tickets").columns(["priority", "status"]).execute();

  await db.schema.createIndex("idx_support_tickets_assigned_to").on("support_tickets").column("assignedTo").execute();
  await db.schema.createIndex("idx_support_tickets_tenant_created_at").on("support_tickets").columns(["tenantId", "createdAt"]).execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("idx_support_tickets_tenant_created_at").ifExists().execute();
  await db.schema.dropIndex("idx_support_tickets_assigned_to").ifExists().execute();
  await db.schema.dropIndex("idx_support_tickets_priority_status").ifExists().execute();
  await db.schema.dropIndex("idx_support_tickets_tenant_status").ifExists().execute();

  await db.schema.dropIndex("idx_support_tickets_category").ifExists().execute();
  await db.schema.dropIndex("idx_support_tickets_tenant").ifExists().execute();
  await db.schema.dropIndex("idx_support_tickets_status").ifExists().execute();

  //DROP table
  await db.schema.dropTable("support_tickets").ifExists().execute();
}
